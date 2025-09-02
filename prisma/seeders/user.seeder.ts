import { PrismaClient, UserStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { ROLE_NAMES } from 'src/common/constants'

export class UserSeeder {
  constructor(private readonly prisma: PrismaClient) {}

  async seed(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'nguyenhuuphuc22052004@gmail.com'
    const adminPassword = process.env.ADMIN_PASSWORD || '@PuckluvPerfume'

    // Check if admin user exists
    const existingAdmin = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    })

    if (existingAdmin) {
      console.log('Admin user already exists, skipping user seeding.')
      return
    }

    console.log('Seeding admin user...')

    // Find Admin Role
    const adminRole = await this.prisma.role.findFirstOrThrow({
      where: { name: ROLE_NAMES.ADMIN },
    })

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)

    // Create admin user
    await this.prisma.user.create({
      data: {
        email: adminEmail,
        name: 'System Administrator',
        password: hashedPassword,
        phoneNumber: '0123456789',
        status: UserStatus.ACTIVE,
        roleId: adminRole.id,
      },
    })

    console.log(`Admin user created successfully with email: ${adminEmail}`)

    // Có thể tạo thêm một vài user mẫu khác
    await this.seedSampleUsers()
  }

  private async seedSampleUsers(): Promise<void> {
    console.log('Seeding sample users...')

    const clientRole = await this.prisma.role.findFirstOrThrow({
      where: { name: ROLE_NAMES.CLIENT },
    })

    const sellerRole = await this.prisma.role.findFirstOrThrow({
      where: { name: ROLE_NAMES.SELLER },
    })

    const saltRounds = 10
    const defaultPassword = await bcrypt.hash('123456', saltRounds)

    const sampleUsers = [
      {
        email: 'client@example.com',
        name: 'John Client',
        password: defaultPassword,
        phoneNumber: '0987654321',
        status: UserStatus.ACTIVE,
        roleId: clientRole.id,
      },
      {
        email: 'seller@example.com',
        name: 'Jane Seller',
        password: defaultPassword,
        phoneNumber: '0123456788',
        status: UserStatus.ACTIVE,
        roleId: sellerRole.id,
      },
    ]

    for (const userData of sampleUsers) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      })

      if (!existingUser) {
        await this.prisma.user.create({
          data: userData,
        })
        console.log(`Sample user created: ${userData.email}`)
      } else {
        console.log(`User ${userData.email} already exists, skipping...`)
      }
    }
  }
}
