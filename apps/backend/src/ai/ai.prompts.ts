import { GearRecommendationRequestDto } from './dto/gear-recommendation.dto';
import { SpotRecommendationRequestDto } from './dto/spot-recommendation.dto';
import { TechnicalTipsRequestDto } from './dto/technical-tips.dto';
import { mockFishingSpots, mockGearStock, mockWeather } from './ai.mock-data';

export const SPOT_RECOMMENDATION_SYSTEM_PROMPT =
  'You are a professional fishing and fishing-spot analysis assistant. Your task is to select the most suitable fishing spots by considering the meteorological data provided by the user, the target fish species, and the list of available spots registered in the system. STRICT RULE: Your response MUST be only valid JSON. Do not include any greetings, explanations, or markdown outside JSON.';

export const GEAR_RECOMMENDATION_SYSTEM_PROMPT =
  'You are a professional fishing gear expert. Your task is to assemble the most suitable 3-piece (Kamis, Makine, Yem) equipment combination based on the user\'s target fish species, spot conditions, and fishing style. STRICT RULES: 1. You must choose equipment ONLY from the provided store stock list. Never invent products. 2. For each product, write a professional "expert note" that references the user\'s selections (fish, spot, style). 3. Your response MUST be only valid JSON. Do not include any greetings, explanations, or markdown outside JSON.';

export const TECHNICAL_TIPS_SYSTEM_PROMPT =
  'You are a professional fishing guide and tactics expert. Your task is to produce the most effective, field-applicable fishing tactics based on the user\'s target fish species, coordinates, and current weather conditions. STRICT RULES: You must always split your advice into 4 main categories in this exact order: "En Verimli Zaman", "Olta Aksiyonu", "Ideal Dugum ve Takim", "Uzman Ipucu". Your explanations must not be long text blocks; they must be short, punchy, and in bullet form. Except for "Uzman Ipucu", the other categories must include bullet items. Your response MUST be only valid JSON. Do not include any greetings, explanations, or markdown outside JSON.';

const formatSpotLines = (): string =>
  mockFishingSpots
    .map(
      (spot) =>
        `- ${spot.meraAdi} | suTipi: ${spot.suTipi} | derinlik: ${spot.derinlik} | koordinat: ${spot.koordinat.lat},${spot.koordinat.lng} | notlar: ${spot.notlar}`,
    )
    .join('\n');

const formatGearLines = (items: { urunAdi: string; fiyat: number }[]): string =>
  items.map((item) => `- ${item.urunAdi} (Fiyat: ${item.fiyat})`).join('\n');

export const buildSpotRecommendationUserPrompt = (
  input: SpotRecommendationRequestDto,
): string => {
  return [
    `Target Fish: ${input.targetFish}`,
    `Region Coordinates: lat=${input.coordinates.lat}, lng=${input.coordinates.lng}`,
    `Current Weather: ${mockWeather.temperatureC}C, wind=${mockWeather.windSpeedMps}m/s, pressure=${mockWeather.pressureHpa}hPa, conditions=${mockWeather.conditions}`,
    'Available Fishing Spots (database matches):',
    formatSpotLines(),
  ].join('\n');
};

export const buildGearRecommendationUserPrompt = (
  input: GearRecommendationRequestDto,
): string => {
  return [
    `Target Fish: ${input.targetFish}`,
    `Region Coordinates: lat=${input.coordinates.lat}, lng=${input.coordinates.lng}`,
    `Fishing Style: ${input.fishingStyle}`,
    'Store Stock List:',
    'Rods:',
    formatGearLines(mockGearStock.rods),
    'Reels:',
    formatGearLines(mockGearStock.reels),
    'Baits:',
    formatGearLines(mockGearStock.baits),
  ].join('\n');
};

export const buildTechnicalTipsUserPrompt = (
  input: TechnicalTipsRequestDto,
): string => {
  return [
    `Target Fish: ${input.targetFish}`,
    `Region Coordinates: lat=${input.coordinates.lat}, lng=${input.coordinates.lng}`,
    `Current Weather: ${mockWeather.temperatureC}C, wind=${mockWeather.windSpeedMps}m/s, pressure=${mockWeather.pressureHpa}hPa, conditions=${mockWeather.conditions}`,
  ].join('\n');
};
