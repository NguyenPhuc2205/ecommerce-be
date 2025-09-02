import { PrismaClient } from '@prisma/client'
import { RoleSeeder } from './role.seeder'
import { PermissionSeeder } from './permission.seeder'
import { UserSeeder } from './user.seeder'

async function runSeeders() {
  try {
    console.log('Starting database seeding...')

    // Create direct Prisma instance
    const prisma = new PrismaClient()
    await prisma.$connect()

    // Create Seeder instances
    const roleSeeder = new RoleSeeder(prisma)
    const permissionSeeder = new PermissionSeeder(prisma)
    const userSeeder = new UserSeeder(prisma)

    // Call seed methods (One by one)
    console.log('\nSeeding roles...')
    await roleSeeder.seed()

    console.log('\nSeeding permissions...')
    await permissionSeeder.seed()

    console.log('\nSeeding users...')
    await userSeeder.seed()

    // Complete & Close Prisma connection
    console.log('\nDatabase seeding completed successfully!')
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  }
}

async function main() {
  await runSeeders()
}

main()
  .catch((e) => {
    console.error('Error in seed script:', e)
    process.exit(1)
  })
  .finally(() => {
    console.log('Seed script complete.')
  })
