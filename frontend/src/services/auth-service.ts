import { MOCK_USERS, type MockUser } from "@/mocks";

export interface LoginResponse {
  user: MockUser;
  token: string;
}

/**
 * Abstraction layer untuk layanan Autentikasi.
 * Saat backend selesai, cukup ganti logika di dalam fungsi-fungsi ini
 * dengan panggilan fetch/axios ke endpoint NestJS `/api/v1/auth/*`.
 */
export const AuthService = {
  /**
   * Simulasi login ke server.
   * Kredensial valid:
   * - superadmin / password
   * - manager / password
   * - auditor / password
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    return new Promise((resolve, reject) => {
      // Simulasi delay jaringan 1 detik
      setTimeout(() => {
        const user = MOCK_USERS[username.toLowerCase()];

        if (user && password === "password") {
          // Buat mock token random
          const token = `mock-jwt-token-${user.id}-${crypto.randomUUID()}`;

          // Set cookie di browser agar Next.js Middleware dapat membacanya
          document.cookie = `senopati_session=${token}; path=/; max-age=86400; SameSite=Strict`;
          // Simpan user profile di localStorage
          localStorage.setItem("senopati_profile", JSON.stringify(user));

          resolve({
            user,
            token,
          });
        } else {
          reject(new Error("Username atau password salah."));
        }
      }, 1000);
    });
  },

  /**
   * Mengakhiri sesi pengguna (logout).
   */
  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Hapus cookie sesi
        document.cookie = "senopati_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        // Hapus localStorage
        localStorage.removeItem("senopati_profile");
        resolve();
      }, 300);
    });
  },

  /**
   * Mendapatkan profil user aktif secara lokal (client-side).
   */
  getCurrentUser(): MockUser | null {
    if (typeof window === "undefined") return null;
    const profileJson = localStorage.getItem("senopati_profile");
    if (!profileJson) return null;
    try {
      return JSON.parse(profileJson) as MockUser;
    } catch {
      return null;
    }
  },

  /**
   * Simulasi cek status token berkala (session verification).
   */
  async checkSession(): Promise<MockUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = AuthService.getCurrentUser();
        const hasCookie = document.cookie.includes("senopati_session=");
        if (user && hasCookie) {
          resolve(user);
        } else {
          reject(new Error("Sesi berakhir atau tidak valid."));
        }
      }, 500);
    });
  },
};
