export const USER_IMAGES = {
  AVATAR: 'avatar',
  COVER: 'cover',
} as const

export type UserImage = (typeof USER_IMAGES)[keyof typeof USER_IMAGES]

export const IMAGE_SOURCES = {
  DICEBEAR: 'dicebear',
  UI_AVATAR: 'ui_avatar',
  ROBOHASH: 'robohash',
  PICSUM: 'picsum',
  UNSPLASH: 'unsplash',
  GRADIENT: 'gradient',
} as const

export type ImageSource = (typeof IMAGE_SOURCES)[keyof typeof IMAGE_SOURCES]
