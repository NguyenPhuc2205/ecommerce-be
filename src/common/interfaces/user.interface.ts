import { ImageSource } from '@/common/constants'

export interface IAvatarConfig {
  size?: number
  rounded?: boolean
  bold?: boolean
  fontSize?: number
  style?: string
}

export interface ICoverConfig {
  width?: number
  height?: number
  quality?: number
}

export interface IValidationConfig {
  timeout?: number
  retries?: number
  validateContentType?: boolean
}

export interface IUserImageConfig {
  avatar?: IAvatarConfig
  cover?: ICoverConfig
  validation?: IValidationConfig
  generateOptions?: boolean
}

export interface IImageResult {
  url: string
  type: ImageSource
  style?: string
  theme?: string
  fallback?: string
}

export interface IUserImages {
  avatar: string
  cover: string
  avatarFallbacks: string[]
  coverFallbacks: string[]
  avatarOptions?: Array<{ url: string; style: string; type: string }>
  coverOptions?: Array<{ url: string; theme: string; type: string }>
}

export interface IAvatarOption {
  url: string
  style: string
  type: ImageSource
  preview?: string
}

export interface ICoverOption {
  url: string
  theme: string
  type: ImageSource
  preview?: string
}
