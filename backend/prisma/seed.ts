import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Seeding...');

    // 1. Define Permissions
    // Format: "resource:action" matches our middleware logic
    const permissions = [
        // Organization
        { action: 'read', resource: 'org', key: 'org:read', description: 'View organization details' },
        { action: 'write', resource: 'org', key: 'org:write', description: 'Update organization details' },
        { action: 'delete', resource: 'org', key: 'org:delete', description: 'Delete organization' },

        // Billing
        { action: 'read', resource: 'billing', key: 'billing:read', description: 'View subscription status' },
        { action: 'write', resource: 'billing', key: 'billing:write', description: 'Manage payment methods and plans' },

        // Users / Members
        { action: 'read', resource: 'users', key: 'users:read', description: 'View organization members' },
        { action: 'invite', resource: 'users', key: 'users:invite', description: 'Invite new members' },
        { action: 'remove', resource: 'users', key: 'users:remove', description: 'Remove members' },

        // Roles
        { action: 'read', resource: 'roles', key: 'roles:read', description: 'View available roles' },
        { action: 'assign', resource: 'roles', key: 'roles:assign', description: 'Assign roles to members' },
    ];

    console.log('   - Creating Permissions...');
    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { key: perm.key },
            update: {},
            create: perm,
        });
    }

    // 2. Define Roles and assign Permissions
    const ownerPerms = permissions.map(p => p.key); // Owner gets everything
    const adminPerms = permissions
        .filter(p => !['org:delete', 'billing:write'].includes(p.key)) // Admin can't delete org or change billing
        .map(p => p.key);
    const memberPerms = ['org:read', 'users:read', 'roles:read']; // Member is read-only-ish

    const roles = [
        { name: 'Owner', system: true, perms: ownerPerms },
        { name: 'Admin', system: true, perms: adminPerms },
        { name: 'Member', system: true, perms: memberPerms },
    ];

    console.log('   - Creating Roles & Assigning Permissions...');
    for (const roleDef of roles) {
        // Create Role
        const role = await prisma.role.upsert({
            where: { name: roleDef.name },
            update: {},
            create: {
                name: roleDef.name,
                isSystem: roleDef.system,
                description: `System ${roleDef.name} Role`
            }
        });

        // Assign Permissions
        // First, clear existing to ensure strict state (optional, but good for idempotent seeds)
        await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });

        // Find permission IDs
        const dbPerms = await prisma.permission.findMany({
            where: { key: { in: roleDef.perms } }
        });

        // Create specific RolePermission links
        await prisma.rolePermission.createMany({
            data: dbPerms.map(p => ({
                roleId: role.id,
                permissionId: p.id
            }))
        });
    }

    // 3. Create Plans
    const plans = [
        { name: 'Free', maxUsers: 2, priceId: null },
        { name: 'Pro', maxUsers: 10, priceId: 'price_test_pro' },
        { name: 'Enterprise', maxUsers: 100, priceId: 'price_test_ent' },
    ];

    console.log('   - Creating Plans...');
    for (const plan of plans) {
        await prisma.plan.upsert({
            where: { id: plan.name.toUpperCase() }, // Using Name as ID for simplicity or generate UUID
            update: {},
            create: {
                id: plan.name.toUpperCase(), // constant ID
                name: plan.name,
                stripePriceId: plan.priceId,
                maxUsers: plan.maxUsers
            }
        });
    }

    console.log('✅ Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
