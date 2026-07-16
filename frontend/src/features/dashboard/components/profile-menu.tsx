"use client";

import { LogOut, User as UserIcon, Activity } from "lucide-react";
import { Avatar, Dropdown } from "@/shared/components";

export function ProfileMenu() {
  const handleLogout = () => {
    alert("Keluar dari aplikasi...");
  };

  const handleProfile = () => {
    alert("Buka profil...");
  };

  const handleActivities = () => {
    alert("Buka aktivitas audit...");
  };

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 rounded-full focus:outline-none p-0.5 hover:bg-bg-secondary border border-transparent hover:border-border transition-colors">
          <Avatar src="" alt="Fakhrul" fallback="FK" size="sm" />
        </button>
      }
      items={[
        {
          id: "header",
          label: "Supriyadi (NIP. 1988...)\nSekretariat Negara",
          disabled: true,
          onClick: () => {},
        },
        {
          id: "profile",
          label: "Profil Saya",
          icon: <UserIcon className="h-3.5 w-3.5" />,
          onClick: handleProfile,
        },
        {
          id: "activities",
          label: "Log Aktivitas",
          icon: <Activity className="h-3.5 w-3.5" />,
          onClick: handleActivities,
        },
        {
          id: "logout",
          label: "Keluar",
          icon: <LogOut className="h-3.5 w-3.5" />,
          onClick: handleLogout,
          danger: true,
        },
      ]}
    />
  );
}
