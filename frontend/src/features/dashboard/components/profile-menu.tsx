"use client";

import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon, Activity } from "lucide-react";
import { Avatar, Dropdown } from "@/shared/components";
import { useAuthStore } from "@/stores";

export function ProfileMenu() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  const handleProfile = () => {
    alert(`Profil: ${user?.name}\nJabatan: ${user?.position}`);
  };

  const handleActivities = () => {
    router.push("/dashboard/audit");
  };

  const getInitials = () => {
    if (!user?.name) return "US";
    return user.name.slice(0, 2).toUpperCase();
  };

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 rounded-full focus:outline-none p-0.5 hover:bg-bg-secondary border border-transparent hover:border-border transition-colors cursor-pointer">
          <Avatar src={user?.avatarUrl} alt={user?.name || "User"} fallback={getInitials()} size="sm" />
        </button>
      }
      items={[
        {
          id: "header",
          label: `${user?.name || "Staf Setneg"} (NIP. ${user?.nip || "19..."})\n${user?.position || "Pegawai"}`,
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
