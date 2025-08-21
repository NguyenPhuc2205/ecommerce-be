export const ROLE_NAMES = {
  ADMIN: 'ADMIN',
  CLIENT: 'CLIENT',
  SELLER: 'SELLER',
} as const

export type RoleName = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES]
