import { PrismaClient } from '@prisma/client'
import { ROLE_NAMES } from 'src/common/constants'

export class RoleSeeder {
  constructor(private readonly prisma: PrismaClient) {}

  async seed(): Promise<void> {
    const roleCount = await this.prisma.role.count()
    if (roleCount > 0) {
      console.log('Roles already exist, skipping role seeding.')
      return
    }

    console.log('Seeding roles...')

    await this.prisma.role.createMany({
      data: [
        {
          name: ROLE_NAMES.ADMIN,
          description: 'Administrator role with full access',
          isActive: true,
        },
        {
          name: ROLE_NAMES.CLIENT,
          description: 'Client role with limited access',
          isActive: true,
        },
        {
          name: ROLE_NAMES.SELLER,
          description: 'Seller role with product management access',
          isActive: true,
        },
      ],
      skipDuplicates: true,
    })

    console.log('✅ Roles seeded successfully')
  }
}
