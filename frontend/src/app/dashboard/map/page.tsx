"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/components";
import { MapEngine } from "@/features/map/components";
import { Map } from "lucide-react";

export default function MapPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-none">
          <div className="flex flex-col gap-1.5 text-left">
            <CardTitle className="text-xl flex items-center gap-2">
              <Map className="h-5 w-5 text-accent" /> Interactive Map Engine
            </CardTitle>
            <CardDescription>
              Navigasi visual aset berbasis denah isometrik gedung, lantai, dan pemetaan ruangan fisik Istana.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <MapEngine />
        </CardContent>
      </Card>
    </div>
  );
}
