// ================================================================
// USER STATUS
// ================================================================
/**
 * Possible statuses for a user account.
 *
 * Defines the lifecycle states of user accounts within the application.
 * Re-defined from Prisma schema to avoid direct dependency on generated types
 * and provide better type safety across the application.
 *
 * @property {string} ACTIVE - The user account is active and fully functional with all features accessible
 * @property {string} INACTIVE - The user account is temporarily inactive (e.g., user deactivated their account)
 * @property {string} BLOCKED - The user account is permanently blocked due to policy violations or security concerns
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
 * Types of user profile images supported by the application.
 *
 * Defines the different image categories that can be associated
 * with user profiles for visual personalization.
 *
 * @property {string} AVATAR - User profile picture/avatar (typically square, displayed in listings and comments)
 * @property {string} COVER - User profile cover/banner image (typically wide, displayed on profile pages)
 */
export const USER_IMAGES = {
  AVATAR: 'avatar',
  COVER: 'cover',
} as const

export type UserImageKey = keyof typeof USER_IMAGES

export type UserImage = (typeof USER_IMAGES)[keyof typeof USER_IMAGES]

/**
 * External services and methods for generating user profile images.
 *
 * Provides multiple options for automatic image generation and selection
 * when users don't upload their own profile images. Each source offers
 * different styles and capabilities.
 *
 * @property {string} DICEBEAR - DiceBear avatar generation service (customizable SVG avatars)
 * @property {string} UI_AVATAR - UI Avatars service (text-based initial avatars)
 * @property {string} ROBOHASH - RoboHash service (unique robot/monster avatars based on identifier)
 * @property {string} PICSUM - Lorem Picsum service (random stock photos)
 * @property {string} UNSPLASH - Unsplash photo service (high-quality random photos)
 * @property {string} GRADIENT - Custom gradient image generation (colorful abstract backgrounds)
 * @property {string} PLACEHOLDER - Placeholder image service (simple placeholder graphics)
 *
 * @see {@link https://dicebear.com | DiceBear Documentation}
 * @see {@link https://ui-avatars.com | UI Avatars Documentation}
 * @see {@link https://robohash.org | RoboHash Documentation}
 * @see {@link https://picsum.photos | Lorem Picsum Documentation}
 * @see {@link https://unsplash.com | Unsplash Documentation}
 * @see {@link https://via.placeholder.com | Placeholder.com Documentation}
 */
export const IMAGE_SOURCES = {
  DICEBEAR: 'dicebear',
  UI_AVATAR: 'ui_avatar',
  ROBOHASH: 'robohash',
  PICSUM: 'picsum',
  UNSPLASH: 'unsplash',
  GRADIENT: 'gradient',
  PLACEHOLDER: 'placeholder',
} as const

export type ImageSourceKey = keyof typeof IMAGE_SOURCES

export type ImageSource = (typeof IMAGE_SOURCES)[keyof typeof IMAGE_SOURCES]
