import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/services/prisma.service'
import { HTTPMethod } from '@prisma/client'
import { ROLE_NAMES } from 'src/common/constants/role.constants'

@Injectable()
export class PermissionSeeder {
  constructor(private readonly prisma: PrismaService) {}

  async seed(): Promise<void> {
    const permissionCount = await this.prisma.permission.count()
    if (permissionCount > 0) {
      console.log('Permissions already exist, skipping permission seeding.')
      return
    }

    console.log('Seeding permissions...')

    // Tạo permissions cơ bản
    await this.prisma.permission.createMany({
      data: [
        // User management permissions
        {
          name: 'Create User',
          description: 'Create new users',
          path: '/users/create',
          method: HTTPMethod.POST,
          module: 'user',
        },
        {
          name: 'Read Users',
          description: 'View user list',
          path: '/users',
          method: HTTPMethod.GET,
          module: 'user',
        },
        {
          name: 'Update User',
          description: 'Update user information',
          path: '/users/:id',
          method: HTTPMethod.PUT,
          module: 'user',
        },
        {
          name: 'Delete User',
          description: 'Delete users',
          path: '/users/:id',
          method: HTTPMethod.DELETE,
          module: 'user',
        },

        // Role management permissions
        {
          name: 'Create Role',
          description: 'Create new roles',
          path: '/roles/create',
          method: HTTPMethod.POST,
          module: 'role',
        },
        {
          name: 'Read Roles',
          description: 'View role list',
          path: '/roles',
          method: HTTPMethod.GET,
          module: 'role',
        },
        {
          name: 'Update Role',
          description: 'Update role information',
          path: '/roles/:id',
          method: HTTPMethod.PUT,
          module: 'role',
        },
        {
          name: 'Delete Role',
          description: 'Delete roles',
          path: '/roles/:id',
          method: HTTPMethod.DELETE,
          module: 'role',
        },

        // Permission management permissions
        {
          name: 'Create Permission',
          description: 'Create new permissions',
          path: '/permissions/create',
          method: HTTPMethod.POST,
          module: 'permission',
        },
        {
          name: 'Read Permissions',
          description: 'View permission list',
          path: '/permissions',
          method: HTTPMethod.GET,
          module: 'permission',
        },
        {
          name: 'Update Permission',
          description: 'Update permission information',
          path: '/permissions/:id',
          method: HTTPMethod.PUT,
          module: 'permission',
        },
        {
          name: 'Delete Permission',
          description: 'Delete permissions',
          path: '/permissions/:id',
          method: HTTPMethod.DELETE,
          module: 'permission',
        },

        // Product management permissions
        {
          name: 'Create Product',
          description: 'Create new products',
          path: '/products/create',
          method: HTTPMethod.POST,
          module: 'product',
        },
        {
          name: 'Read Products',
          description: 'View product list',
          path: '/products',
          method: HTTPMethod.GET,
          module: 'product',
        },
        {
          name: 'Update Product',
          description: 'Update product information',
          path: '/products/:id',
          method: HTTPMethod.PUT,
          module: 'product',
        },
        {
          name: 'Delete Product',
          description: 'Delete products',
          path: '/products/:id',
          method: HTTPMethod.DELETE,
          module: 'product',
        },

        // Order management permissions
        {
          name: 'Create Order',
          description: 'Create new orders',
          path: '/orders/create',
          method: HTTPMethod.POST,
          module: 'order',
        },
        {
          name: 'Read Orders',
          description: 'View order list',
          path: '/orders',
          method: HTTPMethod.GET,
          module: 'order',
        },
        {
          name: 'Update Order',
          description: 'Update order information',
          path: '/orders/:id',
          method: HTTPMethod.PUT,
          module: 'order',
        },
        {
          name: 'Delete Order',
          description: 'Delete orders',
          path: '/orders/:id',
          method: HTTPMethod.DELETE,
          module: 'order',
        },
      ],
      skipDuplicates: true,
    })

    console.log('Assigning permissions to admin role...')

    // Assign Permission to Admin Role
    const adminRole = await this.prisma.role.findFirstOrThrow({
      where: { name: ROLE_NAMES.ADMIN },
    })

    const allPermissions = await this.prisma.permission.findMany()

    await this.prisma.role.update({
      where: { id: adminRole.id },
      data: {
        permissions: {
          connect: allPermissions.map((permission) => ({ id: permission.id })),
        },
      },
    })

    // Assign Permission to Client Role
    const clientRole = await this.prisma.role.findFirstOrThrow({
      where: { name: ROLE_NAMES.CLIENT },
    })

    const clientPermissions = allPermissions.filter(
      (permission) =>
        (permission.module === 'product' && permission.method === HTTPMethod.GET) ||
        (permission.module === 'order' && ['GET', 'POST'].includes(permission.method)),
    )

    await this.prisma.role.update({
      where: { id: clientRole.id },
      data: {
        permissions: {
          connect: clientPermissions.map((permission) => ({ id: permission.id })),
        },
      },
    })

    // Assign Permission to Seller Role
    const sellerRole = await this.prisma.role.findFirstOrThrow({
      where: { name: ROLE_NAMES.SELLER },
    })

    const sellerPermissions = allPermissions.filter(
      (permission) =>
        permission.module === 'product' || (permission.module === 'order' && permission.method === HTTPMethod.GET),
    )

    await this.prisma.role.update({
      where: { id: sellerRole.id },
      data: {
        permissions: {
          connect: sellerPermissions.map((permission) => ({ id: permission.id })),
        },
      },
    })

    console.log('✅ Permissions seeded successfully')
  }
}
