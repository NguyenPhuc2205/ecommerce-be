// ================================================================
// USER STATUS
// ================================================================
/**
 * Possible statuses for a user account.
 * Re-define from prisma schema to avoid direct dependency.
 *
 * @property ACTIVE - The user account is active and in good standing.
 * @property INACTIVE - The user account is inactive and may not access certain features.
 * @property BLOCKED - The user account is blocked due to violations or issues.
 */
export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const

export type UserStatusKey = keyof typeof USER_STATUS

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

// ================================================================
// USER MEDIA
// ================================================================
/**
 * Types of user images.
 *
 * @property AVATAR - User avatar image.
 * @property COVER - User cover image.
 */
export const USER_IMAGES = {
  AVATAR: 'avatar',
  COVER: 'cover',
} as const

export type UserImageKey = keyof typeof USER_IMAGES

export type UserImage = (typeof USER_IMAGES)[keyof typeof USER_IMAGES]

/**
 * Sources for generating user images.
 *
 * @property DICEBEAR - Dicebear avatar generation service.
 * @property UI_AVATAR - UI Avatar generation service.
 * @property ROBOHASH - Robohash image generation service.
 * @property PICSUM - Picsum photo service.
 * @property UNSPLASH - Unsplash photo service.
 * @property GRADIENT - Gradient image generation service.
 */
export const IMAGE_SOURCES = {
  DICEBEAR: 'dicebear',
  UI_AVATAR: 'ui_avatar',
  ROBOHASH: 'robohash',
  PICSUM: 'picsum',
  UNSPLASH: 'unsplash',
  GRADIENT: 'gradient',
} as const

export type ImageSourceKey = keyof typeof IMAGE_SOURCES

export type ImageSource = (typeof IMAGE_SOURCES)[keyof typeof IMAGE_SOURCES]
