import { UserRole } from "@/stores/layout-store";

export interface MockUser {
  id: string;
  username: string;
  email: string;
  name: string;
  nip: string;
  position: string;
  departmentName: string;
  role: UserRole;
  avatarUrl?: string;
  scope: {
    departmentId: string;
    buildingId?: string;
  };
}

export const MOCK_USERS: Record<string, MockUser> = {
  superadmin: {
    id: "user-sa-001",
    username: "superadmin",
    email: "superadmin@setneg.go.id",
    name: "Supriyadi",
    nip: "198810232010041001",
    position: "Kepala Subbagian Umum & TI",
    departmentName: "Subbagian Umum dan TI",
    role: "SuperAdmin",
    scope: {
      departmentId: "dept-ti-01",
    },
  },
  manager: {
    id: "user-am-002",
    username: "manager",
    email: "manager.aset@setneg.go.id",
    name: "Rian Hidayat",
    nip: "199105152014021002",
    position: "Staf Operasional Pengelola Aset",
    departmentName: "Urusan Rumah Tangga Aset",
    role: "AssetManager",
    scope: {
      departmentId: "dept-rt-02",
      buildingId: "bld-gedung-agung-01",
    },
  },
  auditor: {
    id: "user-au-003",
    username: "auditor",
    email: "auditor.inspektorat@setneg.go.id",
    name: "Sri Wahyuni",
    nip: "198509122008122001",
    position: "Auditor Ahli Muda",
    departmentName: "Inspektorat Bidang Aset",
    role: "Auditor",
    scope: {
      departmentId: "dept-insp-03",
    },
  },
};
