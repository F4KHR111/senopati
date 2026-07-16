"use client";

import { motion } from "framer-motion";
import { Shield, LayoutDashboard, Compass } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center gap-6 text-center"
      >
        {/* Logo Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <Shield className="h-10 w-10 text-accent" strokeWidth={1.5} />
        </motion.div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            SENOPATI
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-text-secondary">
            System Enterprise Nasional Operasional
            <br />
            Pengelolaan Aset Terintegrasi
          </p>
        </div>

        {/* Divider */}
        <div className="h-px w-16 bg-accent/40" />

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/dashboard" passHref>
            <Button variant="primary" className="gap-2">
              <LayoutDashboard className="h-4 w-4" /> Masuk ke Dashboard
            </Button>
          </Link>
          <Link href="/design-system" passHref>
            <Button variant="secondary" className="gap-2">
              <Compass className="h-4 w-4" /> Style Guide & Showcase
            </Button>
          </Link>
        </div>

        {/* Subtitle */}
        <p className="text-xs tracking-widest uppercase text-text-tertiary mt-4">
          Sekretariat Negara Republik Indonesia
        </p>
      </motion.div>
    </main>
  );
}
