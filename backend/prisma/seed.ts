import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const url = process.env.DATABASE_URL!.replace('mysql://', 'mariadb://');
const adapter = new PrismaMariaDb(url);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Starting Database Seeding ---');

  // 1. Seed Asset Statuses
  console.log('Seeding asset statuses...');
  const assetStatuses = [
    { name: 'Active', description: 'Asset is active and available' },
    { name: 'Maintenance', description: 'Asset is under maintenance' },
    { name: 'Borrowed', description: 'Asset is currently borrowed' },
    { name: 'Disposed', description: 'Asset has been disposed' },
    { name: 'Lost', description: 'Asset is lost' },
    { name: 'Archived', description: 'Asset is archived' }
  ];
  for (const status of assetStatuses) {
    await prisma.assetStatus.upsert({
      where: { name: status.name },
      update: { description: status.description },
      create: { name: status.name, description: status.description }
    });
  }

  // 2. Seed Asset Conditions
  console.log('Seeding asset conditions...');
  const assetConditions = [
    { name: 'Excellent', description: 'Asset is in brand new or perfect condition' },
    { name: 'Good', description: 'Asset is in good working condition' },
    { name: 'Minor Damage', description: 'Asset has minor cosmetic or functional damage' },
    { name: 'Major Damage', description: 'Asset has major functional damage' },
    { name: 'Broken', description: 'Asset is completely broken/unusable' },
    { name: 'Lost', description: 'Asset is lost' }
  ];
  for (const condition of assetConditions) {
    await prisma.assetCondition.upsert({
      where: { name: condition.name },
      update: { description: condition.description },
      create: { name: condition.name, description: condition.description }
    });
  }

  // 3. Seed Asset Categories
  console.log('Seeding asset categories...');
  const assetCategories = [
    { category_name: 'Vehicle', description: 'Vehicles and transport assets' },
    { category_name: 'Inventory', description: 'Office equipment, furniture, and inventory' },
    { category_name: 'Linen', description: 'Sheets, towels, and linen assets' },
    { category_name: 'Supply', description: 'Consumable supplies' },
    { category_name: 'Art', description: 'Artworks and historical items' }
  ];
  for (const category of assetCategories) {
    await prisma.assetCategory.upsert({
      where: { category_name: category.category_name },
      update: { description: category.description },
      create: { category_name: category.category_name, description: category.description }
    });
  }

  // 4. Seed Document Types
  console.log('Seeding document types...');
  const documentTypes = [
    { name: 'Purchase Documents', description: 'Invoice, purchase order, or acquisition receipts' },
    { name: 'Warranty', description: 'Warranty certificate or agreement' },
    { name: 'Maintenance Files', description: 'Service receipts, logs, or maintenance reports' },
    { name: 'Inspection Reports', description: 'Physical inspection or audit reports' },
    { name: 'Certificates', description: 'Official certificates or licensing documents' },
    { name: 'Invoices', description: 'Purchase invoices and billing files' }
  ];
  for (const type of documentTypes) {
    await prisma.documentType.upsert({
      where: { name: type.name },
      update: { description: type.description },
      create: { name: type.name, description: type.description }
    });
  }

  // 5. Seed Permissions
  console.log('Seeding permissions...');
  const permissions = [
    // Dashboard
    { module: 'dashboard', action: 'read', description: 'View dashboard data' },
    // Asset
    { module: 'asset', action: 'create', description: 'Create asset record' },
    { module: 'asset', action: 'read', description: 'Read asset details' },
    { module: 'asset', action: 'update', description: 'Update asset information' },
    { module: 'asset', action: 'delete', description: 'Soft-delete asset' },
    { module: 'asset', action: 'import', description: 'Bulk import assets' },
    { module: 'asset', action: 'export', description: 'Export asset data' },
    { module: 'asset', action: 'history', description: 'View asset change history' },
    { module: 'asset', action: 'qrcode', description: 'Generate/read asset QR code' },
    { module: 'asset', action: 'approve', description: 'Approve asset changes (e.g., acquisition)' },
    // Vehicle
    { module: 'vehicle', action: 'create', description: 'Create vehicle details' },
    { module: 'vehicle', action: 'read', description: 'Read vehicle details' },
    { module: 'vehicle', action: 'update', description: 'Update vehicle details' },
    { module: 'vehicle', action: 'delete', description: 'Delete vehicle details' },
    { module: 'vehicle', action: 'import', description: 'Import vehicle details' },
    { module: 'vehicle', action: 'export', description: 'Export vehicle details' },
    { module: 'vehicle', action: 'history', description: 'View vehicle history' },
    // Inventory
    { module: 'inventory', action: 'create', description: 'Create inventory details' },
    { module: 'inventory', action: 'read', description: 'Read inventory details' },
    { module: 'inventory', action: 'update', description: 'Update inventory details' },
    { module: 'inventory', action: 'delete', description: 'Delete inventory details' },
    { module: 'inventory', action: 'import', description: 'Import inventory details' },
    { module: 'inventory', action: 'export', description: 'Export inventory details' },
    { module: 'inventory', action: 'history', description: 'View inventory history' },
    // Linen
    { module: 'linen', action: 'create', description: 'Create linen details' },
    { module: 'linen', action: 'read', description: 'Read linen details' },
    { module: 'linen', action: 'update', description: 'Update linen details' },
    { module: 'linen', action: 'delete', description: 'Delete linen details' },
    { module: 'linen', action: 'import', description: 'Import linen details' },
    { module: 'linen', action: 'export', description: 'Export linen details' },
    { module: 'linen', action: 'history', description: 'View linen history' },
    // Supply
    { module: 'supply', action: 'create', description: 'Create supply details' },
    { module: 'supply', action: 'read', description: 'Read supply details' },
    { module: 'supply', action: 'update', description: 'Update supply details' },
    { module: 'supply', action: 'delete', description: 'Delete supply details' },
    { module: 'supply', action: 'import', description: 'Import supply details' },
    { module: 'supply', action: 'export', description: 'Export supply details' },
    { module: 'supply', action: 'history', description: 'View supply history' },
    // Art
    { module: 'art', action: 'create', description: 'Create art details' },
    { module: 'art', action: 'read', description: 'Read art details' },
    { module: 'art', action: 'update', description: 'Update art details' },
    { module: 'art', action: 'delete', description: 'Delete art details' },
    { module: 'art', action: 'import', description: 'Import art details' },
    { module: 'art', action: 'export', description: 'Export art details' },
    { module: 'art', action: 'history', description: 'View art history' },
    // Department
    { module: 'department', action: 'create', description: 'Create department' },
    { module: 'department', action: 'read', description: 'Read department details' },
    { module: 'department', action: 'update', description: 'Update department' },
    { module: 'department', action: 'delete', description: 'Delete department' },
    // Employee
    { module: 'employee', action: 'create', description: 'Create employee' },
    { module: 'employee', action: 'read', description: 'Read employee details' },
    { module: 'employee', action: 'update', description: 'Update employee details' },
    { module: 'employee', action: 'delete', description: 'Delete employee' },
    // Building
    { module: 'building', action: 'create', description: 'Create building' },
    { module: 'building', action: 'read', description: 'Read building details' },
    { module: 'building', action: 'update', description: 'Update building details' },
    { module: 'building', action: 'delete', description: 'Delete building' },
    // Floor
    { module: 'floor', action: 'create', description: 'Create floor' },
    { module: 'floor', action: 'read', description: 'Read floor details' },
    { module: 'floor', action: 'update', description: 'Update floor details' },
    { module: 'floor', action: 'delete', description: 'Delete floor' },
    // Zone
    { module: 'zone', action: 'create', description: 'Create zone' },
    { module: 'zone', action: 'read', description: 'Read zone details' },
    { module: 'zone', action: 'update', description: 'Update zone details' },
    { module: 'zone', action: 'delete', description: 'Delete zone' },
    // Room
    { module: 'room', action: 'create', description: 'Create room' },
    { module: 'room', action: 'read', description: 'Read room details' },
    { module: 'room', action: 'update', description: 'Update room details' },
    { module: 'room', action: 'delete', description: 'Delete room' },
    // Vendor
    { module: 'vendor', action: 'create', description: 'Create vendor' },
    { module: 'vendor', action: 'read', description: 'Read vendor details' },
    { module: 'vendor', action: 'update', description: 'Update vendor details' },
    { module: 'vendor', action: 'delete', description: 'Delete vendor' },
    // Manufacturer
    { module: 'manufacturer', action: 'create', description: 'Create manufacturer' },
    { module: 'manufacturer', action: 'read', description: 'Read manufacturer details' },
    { module: 'manufacturer', action: 'update', description: 'Update manufacturer details' },
    { module: 'manufacturer', action: 'delete', description: 'Delete manufacturer' },
    // Maintenance
    { module: 'maintenance', action: 'create', description: 'Create maintenance request' },
    { module: 'maintenance', action: 'read', description: 'Read maintenance details' },
    { module: 'maintenance', action: 'update', description: 'Update maintenance details' },
    { module: 'maintenance', action: 'delete', description: 'Delete maintenance record' },
    { module: 'maintenance', action: 'history', description: 'View maintenance history' },
    // Movement
    { module: 'movement', action: 'create', description: 'Create movement request' },
    { module: 'movement', action: 'read', description: 'Read movement details' },
    { module: 'movement', action: 'update', description: 'Update movement details' },
    { module: 'movement', action: 'delete', description: 'Delete movement record' },
    { module: 'movement', action: 'history', description: 'View movement history' },
    // Stock Opname
    { module: 'stock-opname', action: 'import', description: 'Import stock opname data' },
    { module: 'stock-opname', action: 'export', description: 'Export stock opname data' },
    { module: 'stock-opname', action: 'perform', description: 'Execute a stock-opname session' },
    { module: 'stock-opname', action: 'history', description: 'View stock opname history' },
    // Media
    { module: 'media', action: 'create', description: 'Upload media' },
    { module: 'media', action: 'read', description: 'View media' },
    { module: 'media', action: 'update', description: 'Update media details' },
    { module: 'media', action: 'delete', description: 'Delete media' },
    // Document
    { module: 'document', action: 'create', description: 'Upload document' },
    { module: 'document', action: 'read', description: 'Read document' },
    { module: 'document', action: 'update', description: 'Update document details' },
    { module: 'document', action: 'delete', description: 'Delete document' },
    // User
    { module: 'user', action: 'create', description: 'Create user account' },
    { module: 'user', action: 'read', description: 'Read user profile' },
    { module: 'user', action: 'update', description: 'Update user account' },
    { module: 'user', action: 'delete', description: 'Delete user account' },
    // Role
    { module: 'role', action: 'create', description: 'Create custom role' },
    { module: 'role', action: 'read', description: 'Read role definitions' },
    { module: 'role', action: 'update', description: 'Update role permissions' },
    { module: 'role', action: 'delete', description: 'Delete custom role' },
    // Permission
    { module: 'permission', action: 'create', description: 'Create permission' },
    { module: 'permission', action: 'read', description: 'Read permission catalog' },
    { module: 'permission', action: 'update', description: 'Update permission details' },
    { module: 'permission', action: 'delete', description: 'Delete permission' },
    // Audit
    { module: 'audit', action: 'read', description: 'Read system audit logs' },
    // Notification
    { module: 'notification', action: 'send', description: 'Send system notifications' },
    { module: 'notification', action: 'read', description: 'Read user notifications' },
    // Report
    { module: 'report', action: 'generate', description: 'Generate custom reports' },
    { module: 'report', action: 'read', description: 'Read reports' }
  ];

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        module_action: {
          module: permission.module,
          action: permission.action
        }
      },
      update: { description: permission.description },
      create: {
        module: permission.module,
        action: permission.action,
        description: permission.description
      }
    });
  }

  // 6. Seed Roles
  console.log('Seeding roles...');
  const roles = [
    { name: 'Super Admin', description: 'Full system access, bypasses all scope checks.' },
    { name: 'Admin BMN', description: 'Manages BMN related modules, scoped to department/building.' },
    { name: 'Kepala Urusan', description: 'Oversees departmental operations, scoped.' },
    { name: 'Tata Usaha', description: 'Handles administrative data (departments, employees, buildings).' },
    { name: 'Rumah Tangga & Perlengkapan', description: 'Manages household and equipment assets, scoped.' },
    { name: 'PJ Kendaraan', description: 'Responsible for vehicle module, maintenance, movement, scoped.' },
    { name: 'PJ Inventaris', description: 'Manages inventory module, scoped.' },
    { name: 'PJ Linen', description: 'Manages linen module, scoped.' },
    { name: 'PJ Persediaan', description: 'Manages supply module, scoped.' },
    { name: 'PJ Benda Seni', description: 'Manages art collection module, scoped.' },
    { name: 'Auditor', description: 'Read-only access to audit logs and historical data across scopes.' },
    { name: 'Viewer', description: 'Global read-only access to all modules (respecting scope unless overridden).' }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description }
    });
  }

  // 7. Seed Role Permission Mappings
  console.log('Seeding role permission mappings...');
  const dbRoles = await prisma.role.findMany();
  const dbPermissions = await prisma.permission.findMany();

  const roleMap = new Map<string, string>();
  for (const r of dbRoles) {
    roleMap.set(r.name, r.id);
  }

  const permMap = new Map<string, string>();
  for (const p of dbPermissions) {
    permMap.set(`${p.module}.${p.action}`, p.id);
  }

  const rolePermissionMapping: Record<string, string[]> = {
    'Super Admin': ['*'],
    'Admin BMN': [
      'dashboard.read',
      'asset.create', 'asset.read', 'asset.update', 'asset.delete', 'asset.import', 'asset.export', 'asset.history', 'asset.qrcode', 'asset.approve',
      'vehicle.create', 'vehicle.read', 'vehicle.update', 'vehicle.delete', 'vehicle.import', 'vehicle.export', 'vehicle.history',
      'inventory.create', 'inventory.read', 'inventory.update', 'inventory.delete', 'inventory.import', 'inventory.export', 'inventory.history',
      'linen.create', 'linen.read', 'linen.update', 'linen.delete', 'linen.import', 'linen.export', 'linen.history',
      'supply.create', 'supply.read', 'supply.update', 'supply.delete', 'supply.import', 'supply.export', 'supply.history',
      'art.create', 'art.read', 'art.update', 'art.delete', 'art.import', 'art.export', 'art.history',
      'maintenance.create', 'maintenance.read', 'maintenance.update', 'maintenance.delete', 'maintenance.history',
      'movement.create', 'movement.read', 'movement.update', 'movement.delete', 'movement.history',
      'stock-opname.import', 'stock-opname.export', 'stock-opname.perform', 'stock-opname.history',
      'media.create', 'media.read', 'media.update', 'media.delete',
      'document.create', 'document.read', 'document.update', 'document.delete',
      'user.create', 'user.read', 'user.update', 'user.delete',
      'role.create', 'role.read', 'role.update', 'role.delete',
      'permission.create', 'permission.read', 'permission.update', 'permission.delete',
      'audit.read',
      'notification.send', 'notification.read',
      'report.generate', 'report.read'
    ],
    'Kepala Urusan': [
      'dashboard.read',
      'asset.create', 'asset.read', 'asset.update', 'asset.qrcode',
      'vehicle.read',
      'inventory.read',
      'linen.read',
      'supply.read',
      'art.read',
      'maintenance.read',
      'movement.read',
      'stock-opname.perform',
      'media.read',
      'document.read',
      'report.read'
    ],
    'Tata Usaha': [
      'dashboard.read',
      'department.create', 'department.read', 'department.update', 'department.delete',
      'employee.create', 'employee.read', 'employee.update', 'employee.delete',
      'building.create', 'building.read', 'building.update', 'building.delete',
      'floor.create', 'floor.read', 'floor.update', 'floor.delete',
      'zone.create', 'zone.read', 'zone.update', 'zone.delete',
      'room.create', 'room.read', 'room.update', 'room.delete'
    ],
    'Rumah Tangga & Perlengkapan': [
      'dashboard.read',
      'asset.create', 'asset.read', 'asset.update', 'asset.delete', 'asset.import', 'asset.export', 'asset.history', 'asset.qrcode',
      'media.create', 'media.read', 'media.update', 'media.delete',
      'document.create', 'document.read', 'document.update', 'document.delete'
    ],
    'PJ Kendaraan': [
      'dashboard.read',
      'vehicle.create', 'vehicle.read', 'vehicle.update', 'vehicle.delete', 'vehicle.import', 'vehicle.export', 'vehicle.history',
      'maintenance.create', 'maintenance.read', 'maintenance.update', 'maintenance.delete',
      'movement.create', 'movement.read', 'movement.update', 'movement.delete',
      'media.create', 'media.read', 'media.update', 'media.delete'
    ],
    'PJ Inventaris': [
      'dashboard.read',
      'inventory.create', 'inventory.read', 'inventory.update', 'inventory.delete', 'inventory.import', 'inventory.export', 'inventory.history',
      'media.create', 'media.read', 'media.update', 'media.delete'
    ],
    'PJ Linen': [
      'dashboard.read',
      'linen.create', 'linen.read', 'linen.update', 'linen.delete', 'linen.import', 'linen.export', 'linen.history',
      'media.create', 'media.read', 'media.update', 'media.delete'
    ],
    'PJ Persediaan': [
      'dashboard.read',
      'supply.create', 'supply.read', 'supply.update', 'supply.delete', 'supply.import', 'supply.export', 'supply.history',
      'media.create', 'media.read', 'media.update', 'media.delete'
    ],
    'PJ Benda Seni': [
      'dashboard.read',
      'art.create', 'art.read', 'art.update', 'art.delete', 'art.import', 'art.export', 'art.history',
      'media.create', 'media.read', 'media.update', 'media.delete'
    ],
    'Auditor': [
      'dashboard.read', 'audit.read', 'asset.read', 'vehicle.read', 'inventory.read', 'linen.read', 'supply.read', 'art.read',
      'department.read', 'employee.read', 'building.read', 'floor.read', 'zone.read', 'room.read', 'vendor.read', 'manufacturer.read',
      'maintenance.read', 'movement.read', 'stock-opname.perform', 'media.read', 'document.read', 'report.read', 'notification.read'
    ],
    'Viewer': [
      'dashboard.read', 'asset.read', 'vehicle.read', 'inventory.read', 'linen.read', 'supply.read', 'art.read',
      'department.read', 'employee.read', 'building.read', 'floor.read', 'zone.read', 'room.read', 'vendor.read', 'manufacturer.read',
      'maintenance.read', 'movement.read', 'stock-opname.perform', 'media.read', 'document.read', 'report.read', 'notification.read'
    ]
  };

  for (const [roleName, permissionKeys] of Object.entries(rolePermissionMapping)) {
    const roleId = roleMap.get(roleName);
    if (!roleId) {
      console.warn(`Role ${roleName} not found in database roles mapping.`);
      continue;
    }

    // Determine target permission IDs
    let targetPermissionIds: string[] = [];
    if (permissionKeys.includes('*')) {
      targetPermissionIds = Array.from(permMap.values());
    } else {
      for (const key of permissionKeys) {
        const permId = permMap.get(key);
        if (permId) {
          targetPermissionIds.push(permId);
        } else {
          console.warn(`Permission key "${key}" not found in database permissions mapping.`);
        }
      }
    }

    // Upsert mappings for this role
    for (const permissionId of targetPermissionIds) {
      await prisma.rolePermission.upsert({
        where: {
          role_id_permission_id: {
            role_id: roleId,
            permission_id: permissionId
          }
        },
        update: {},
        create: {
          role_id: roleId,
          permission_id: permissionId
        }
      });
    }

    // Remove obsolete permissions for this role to make it fully idempotent
    const currentMappings = await prisma.rolePermission.findMany({
      where: { role_id: roleId }
    });
    for (const mapping of currentMappings) {
      if (!targetPermissionIds.includes(mapping.permission_id)) {
        console.log(`Removing unmapped permission relation for role ${roleName}: permission id ${mapping.permission_id}`);
        await prisma.rolePermission.delete({
          where: { id: mapping.id }
        });
      }
    }
  }

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
