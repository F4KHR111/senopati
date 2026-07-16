"use client";

import { Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/shared/components";

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-secondary p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-6 text-center max-w-sm"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 border border-accent/20 text-accent-dark animate-pulse">
          <Compass className="h-8 w-8" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-primary">Halaman Tidak Ditemukan (404)</h1>
          <p className="text-xs text-text-secondary leading-relaxed">
            Halaman yang Anda tuju tidak ditemukan atau telah dipindahkan. Periksa kembali alamat URL Anda.
          </p>
        </div>

        <Link href="/dashboard" passHref>
          <Button variant="secondary" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
