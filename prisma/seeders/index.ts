import { NestFactory } from '@nestjs/core'
import { RoleSeeder } from './role.seeder'
import { PermissionSeeder } from './permission.seeder'
import { UserSeeder } from './user.seeder'
import { AppModule } from 'src/app.module'
import { PrismaService } from 'src/common/services/prisma.service'

async function runSeeders() {
  try {
    console.log('Starting database seeding...')

    // Create app context
    const app = await NestFactory.createApplicationContext(AppModule)

    // PrismaService instance
    const prisma = app.get(PrismaService)
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
    await app.close()
  } catch (error) {
    console.error('Error during seeding:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  runSeeders().catch((error) => {
    console.error('Failed to seed database:', error)
    process.exit(1)
  })
}

export { runSeeders }
