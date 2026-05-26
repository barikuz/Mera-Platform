import { supabase } from "./supabase";

/**
 * Supabase hata mesajlarını Türkçe kullanıcı dostu mesajlara çevirir.
 */
function mapAuthError(errorMessage: string): string {
  const lower = errorMessage.toLowerCase();

  if (lower.includes("invalid login credentials")) {
    return "E-posta adresi veya şifre hatalı.";
  }
  if (lower.includes("email not confirmed")) {
    return "E-posta adresiniz henüz doğrulanmamış. Lütfen gelen kutunuzu kontrol edin.";
  }
  if (lower.includes("user already registered")) {
    return "Bu e-posta adresi ile zaten bir hesap mevcut.";
  }
  if (lower.includes("signup is disabled")) {
    return "Kayıt işlemi şu anda devre dışı.";
  }
  if (lower.includes("password should be at least")) {
    return "Şifre en az 6 karakter olmalıdır.";
  }
  if (lower.includes("rate limit")) {
    return "Çok fazla deneme yaptınız. Lütfen birkaç dakika bekleyin.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.";
  }
  if (lower.includes("unable to validate email address")) {
    return "Geçersiz e-posta adresi. Lütfen kontrol edin.";
  }

  return "Bir hata oluştu. Lütfen tekrar deneyin.";
}

export type AuthResult =
  | { success: true }
  | { success: false; error: string };

/**
 * E-posta ve şifre ile giriş yapar.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.",
    };
  }
}

/**
 * Yeni kullanıcı kaydı oluşturur.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      return { success: false, error: mapAuthError(error.message) };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.",
    };
  }
}

/**
 * Oturumu kapatır.
 */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}
