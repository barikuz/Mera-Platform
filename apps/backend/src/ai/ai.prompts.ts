import { GearRecommendationRequestDto } from './dto/gear-recommendation.dto';
import { SpotRecommendationRequestDto } from './dto/spot-recommendation.dto';
import { TechnicalTipsRequestDto } from './dto/technical-tips.dto';

export type PromptFishingSpot = {
  meraAdi: string;
  suTipi: string;
  derinlik: string;
  koordinat: {
    lat: number;
    lng: number;
  };
};

export type PromptWeather = {
  temperatureC: number;
  windSpeedMps: number;
  pressureHpa: number;
  conditions: string;
};

export type PromptGearItem = {
  productId: string;
  urunAdi: string;
  fiyat: number;
};

export type PromptGearStock = {
  rods: PromptGearItem[];
  reels: PromptGearItem[];
  baits: PromptGearItem[];
};

export const SPOT_RECOMMENDATION_SYSTEM_PROMPT =
  'You are a professional fishing and fishing-spot analysis assistant. Your task is to select the most suitable fishing spots by considering the meteorological data provided by the user, the target fish species, and the list of available spots registered in the system. STRICT RULE: Your response MUST be only valid JSON. Do not include any greetings, explanations, or markdown outside JSON.';
export const GEAR_RECOMMENDATION_SYSTEM_PROMPT =
  'You are a professional fishing gear expert. Your task is to assemble the most suitable 3-piece equipment combination based on the user\'s target fish species, spot conditions, and fishing style. STRICT RULES: 1. You must choose equipment ONLY from the provided store stock list. Never invent products. 2. Your recommendation MUST consist of EXACTLY one Rod (Kamış), EXACTLY one Reel (Makine), and EXACTLY one Bait/Lure (Yem). Never skip a category or provide multiple items from the same category. 3. For each product, write a professional "expert note" that references the user\'s selections (fish, spot, style). 4. Your response MUST be only valid JSON. Do not include any greetings, explanations, or markdown outside JSON.';
export const TECHNICAL_TIPS_SYSTEM_PROMPT =
  'You are a professional fishing guide and tactics expert. Your task is to produce the most effective, field-applicable fishing tactics based on the user\'s target fish species, coordinates, and current weather conditions. STRICT RULES: You must always split your advice into 4 main categories in this exact order: "En Verimli Zaman", "Olta Aksiyonu", "Ideal Dugum ve Takim", "Uzman Ipucu". Your explanations must not be long text blocks; they must be short, punchy, and in bullet form. Except for "Uzman Ipucu", the other categories must include bullet items. Your response MUST be only valid JSON. Do not include any greetings, explanations, or markdown outside JSON.';

const formatSpotLines = (spots: PromptFishingSpot[]): string =>
  spots
    .map(
      (spot) =>
        `- ${spot.meraAdi} | suTipi: ${spot.suTipi} | derinlik: ${spot.derinlik} | koordinat: ${spot.koordinat.lat},${spot.koordinat.lng}`,
    )
    .join('\n');

const formatGearLines = (items: PromptGearItem[]): string =>
  items
    .map(
      (item) =>
        `- productId: ${item.productId} | ${item.urunAdi} (Fiyat: ${item.fiyat})`,
    )
    .join('\n');

export const buildSpotRecommendationUserPrompt = (
  input: SpotRecommendationRequestDto,
  weather: PromptWeather,
  spots: PromptFishingSpot[],
): string => {
  return [
    `Target Fish: ${input.targetFish}`,
    `Region Coordinates: lat=${input.coordinates.lat}, lng=${input.coordinates.lng}`,
    `Current Weather: ${weather.temperatureC}C, wind=${weather.windSpeedMps}m/s, pressure=${weather.pressureHpa}hPa, conditions=${weather.conditions}`,
    'Available Fishing Spots (database matches):',
    formatSpotLines(spots),
  ].join('\n');
};

export const buildGearRecommendationUserPrompt = (
  input: GearRecommendationRequestDto,
  weather: PromptWeather,
  stock: PromptGearStock,
): string => {
  return [
    `Target Fish: ${input.targetFish}`,
    `Region Coordinates: lat=${input.coordinates.lat}, lng=${input.coordinates.lng}`,
    `Fishing Style: ${input.fishingStyle}`,
    `Current Weather: ${weather.temperatureC}C, wind=${weather.windSpeedMps}m/s, pressure=${weather.pressureHpa}hPa, conditions=${weather.conditions}`,
    'Store Stock List:',
    'Rods:',
    formatGearLines(stock.rods),
    'Reels:',
    formatGearLines(stock.reels),
    'Baits:',
    formatGearLines(stock.baits),
  ].join('\n');
};

export const buildTechnicalTipsUserPrompt = (
  input: TechnicalTipsRequestDto,
  weather: PromptWeather,
): string => {
  return [
    `Target Fish: ${input.targetFish}`,
    `Region Coordinates: lat=${input.coordinates.lat}, lng=${input.coordinates.lng}`,
    `Current Weather: ${weather.temperatureC}C, wind=${weather.windSpeedMps}m/s, pressure=${weather.pressureHpa}hPa, conditions=${weather.conditions}`,
  ].join('\n');
};
export const FISHING_CONDITIONS_SYSTEM_PROMPT =
  'You are a professional fishing conditions analyst. Based solely on the provided weather data for nearby fishing spots, evaluate the overall fishing conditions and return a structured JSON response. ' +
  'Evaluate conditions as "good" (calm weather, stable pressure, low-to-moderate wind ideal for fishing), "okay" (moderate conditions, some limitations but fishing is still viable), or "poor" (strong winds, extreme temperatures, or conditions that make fishing difficult or unsafe). ' +
  'STRICT RULES: 1. Base your evaluation ONLY on the weather data provided. 2. Write the description in Turkish. 3. Keep the description to 1-2 sentences maximum. 4. Your response MUST be only valid JSON. Do not include any greetings, explanations, or markdown outside JSON.';

export type FishingConditionsWeatherContext = {
  spotName: string;
  temperatureC: number;
  windSpeedMps: number;
  pressureHpa: number;
  conditions: string;
};

export const buildFishingConditionsUserPrompt = (
  weatherContexts: FishingConditionsWeatherContext[],
): string => {
  const spotsBlock = weatherContexts
    .map(
      (ctx, i) =>
        `Spot ${i + 1} (${ctx.spotName}): temp=${ctx.temperatureC}C, wind=${ctx.windSpeedMps}m/s, pressure=${ctx.pressureHpa}hPa, conditions="${ctx.conditions}"`,
    )
    .join('\n');

  return [
    'Evaluate fishing conditions based on the following nearby spot weather data:',
    spotsBlock,
  ].join('\n');
};
