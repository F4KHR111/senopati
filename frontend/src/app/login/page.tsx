"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, ArrowRight, UserCheck } from "lucide-react";
import { Button, Input, Card, CardContent } from "@/shared/components";
import { useAuthStore, useToastStore } from "@/stores";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { login, isLoading } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!username || !password) {
      setErrorMsg("Username dan password wajib diisi.");
      return;
    }

    try {
      await login(username, password);
      addToast({
        type: "success",
        title: "Login Berhasil",
        description: `Selamat datang kembali, ${username}!`,
      });
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal masuk ke sistem.";
      setErrorMsg(message);
    }
  };

  // Helper to instantly load mock credentials for testers
  const fillMockCredentials = (user: string) => {
    setUsername(user);
    setPassword("password");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row bg-bg-secondary select-none">
      {/* Left panel: Branding Banner (Government Modern style) */}
      <div className="md:flex md:w-[45%] bg-primary text-text-inverse p-8 flex-col justify-between relative overflow-hidden border-r border-primary-light hidden">
        {/* Decorative backdrop gradients */}
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light">
            <Shield className="h-5 w-5 text-accent" />
          </div>
          <span className="text-sm font-bold tracking-wider">SENOPATI</span>
        </div>

        <div className="flex flex-col gap-3 max-w-sm">
          <span className="text-[10px] tracking-widest text-accent uppercase font-bold">
            Sekretariat Negara RI
          </span>
          <h1 className="text-2xl font-bold tracking-tight leading-snug">
            Sistem Pengelolaan Aset Istana Kepresidenan
          </h1>
          <p className="text-xs text-text-tertiary leading-relaxed">
            Platform modern terintegrasi untuk visualisasi, pemantauan, dan audit cagar budaya, inventaris, linen, dan kendaraan dinas.
          </p>
        </div>

        <span className="text-[10px] text-text-tertiary">
          © 2026 Sekretariat Negara Republik Indonesia.
        </span>
      </div>

      {/* Right panel: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-sm flex flex-col gap-6"
        >
          {/* Logo mobile-only */}
          <div className="flex flex-col items-center gap-2 md:hidden text-center mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-md">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h2 className="text-lg font-bold text-primary tracking-tight">SENOPATI</h2>
            <p className="text-[11px] text-text-secondary">
              Sekretariat Negara Republik Indonesia
            </p>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <h1 className="text-xl font-bold text-primary">Masuk ke Platform</h1>
            <p className="text-xs text-text-secondary">
              Gunakan akun kedinasan Anda yang terdaftar.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md text-xs text-error font-medium" role="alert">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <Input
              label="Username"
              type="text"
              placeholder="Masukkan username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
            />

            <Button type="submit" variant="primary" className="mt-2 gap-2" isLoading={isLoading}>
              Masuk Sistem <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Mock Login Selector (Super helpful for verification) */}
          <Card className="border-dashed bg-bg-secondary/40">
            <CardContent className="p-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" /> Uji Coba Mock Login
              </span>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillMockCredentials("superadmin")}
                  disabled={isLoading}
                  className="text-[10px] h-8 px-1"
                >
                  Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillMockCredentials("manager")}
                  disabled={isLoading}
                  className="text-[10px] h-8 px-1"
                >
                  Manager
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillMockCredentials("auditor")}
                  disabled={isLoading}
                  className="text-[10px] h-8 px-1"
                >
                  Auditor
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
