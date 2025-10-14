import { IMAGE_SOURCES, USER_IMAGES, UserImage, ImageSource } from '@/common/constants'
import { AVATAR_STYLES, COVER_THEMES, TRENDING_COLORS, GRADIENT_COMBOS } from '@/common/constants/color.constant'
import {
  IAvatarConfig,
  IImageResult,
  ICoverConfig,
  IValidationConfig,
  IUserImageConfig,
  IUserImages,
  IAvatarOption,
  ICoverOption,
} from '@/common/interfaces/user-image.interface'

/**
 * Generates a unique seed based on user information using djb2 hash function.
 * This function uses for DiceBear or Boring Avatars hash input (same input, same output).
 * @param identifier - The user's identifier (e.g., userId, email, phoneNumber).
 * @param userName - The user's name.
 * @param type - The type of user image (avatar or cover).
 * @returns A unique seed string.
 * @ref http://www.cse.yorku.ca/~oz/hash.html
 */
export const generateSeed = (
  identifier: string | number, // userId or email, phoneNumber
  userName: string,
  type: UserImage,
): string => {
  const baseString = `${identifier}-${userName}-${type}`
  let hash = 0

  for (let i = 0; i < baseString.length; i++) {
    // Get character code at index i (a -> 97, A -> 65)
    const char = baseString.charCodeAt(i)

    // Go left 5 bit (multiply by 32) - hash + char
    hash = (hash << 5) - hash + char

    // Cast to 32 bit integer (AND with itself)
    hash = hash & hash
  }

  // Convert to base 36 and limit to 12 characters
  return Math.abs(hash).toString(36).substring(0, 12)
}

/**
 * Picks an item from the array based on the seed.
 * @param items - The array of items to pick from.
 * @param seed - The seed string used for picking.
 * @returns A randomly picked item from the array.
 */
export const pickBySeed = <T>(items: readonly T[], seed: string): T => {
  let hash = 0
  for (let i = 0; i < seed.length; ++i) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash = hash & hash
  }

  // Ensure index is within bounds
  const index = Math.abs(hash) % items.length
  return items[index]
}

/**
 * Get the initials from a full name
 * @param name The full name of the user
 * @returns The initials of the user
 */
export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return 'U'

  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'U'
  if (words.length === 1) return words[0].charAt(0).toUpperCase()

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase()
}

/**
 * Formats a user's name.
 * @param firstName The first name of the user
 * @param lastName The last name of the user (optional)
 * @returns The formatted full name
 */
export const formatName = (firstName: string, lastName?: string): string => {
  const fullName = lastName ? `${firstName} ${lastName}` : firstName
  return fullName.trim().replace(/\s+/g, '+')
}

export const pickRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * TRENDING_COLORS.length)
  return TRENDING_COLORS[randomIndex]
}

export const pickRandomTheme = (): string => {
  const randomIndex = Math.floor(Math.random() * COVER_THEMES.length)
  return COVER_THEMES[randomIndex]
}

export const pickRandomAvatarStyle = (): string => {
  const randomIndex = Math.floor(Math.random() * AVATAR_STYLES.length)
  return AVATAR_STYLES[randomIndex]
}

export const pickColorBySeed = (seed: string): string => {
  return pickBySeed(TRENDING_COLORS, seed)
}

export const pickThemeBySeed = (seed: string): string => {
  return pickBySeed(COVER_THEMES, seed)
}

export const pickAvatarStyleBySeed = (seed: string): string => {
  return pickBySeed(AVATAR_STYLES, seed)
}

export const getRandomColor = (seed?: string): string => {
  if (seed) {
    return pickBySeed(TRENDING_COLORS, seed)
  }
  return TRENDING_COLORS[Math.floor(Math.random() * TRENDING_COLORS.length)]
}

/**
 * Parse full name into components
 */
export const parseName = (fullName: string): { firstName: string; lastName?: string } => {
  if (!fullName || typeof fullName !== 'string') {
    return { firstName: 'User' }
  }

  const words = fullName.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return { firstName: 'User' }
  if (words.length === 1) return { firstName: words[0] }

  return {
    firstName: words[0],
    lastName: words.slice(1).join(' '),
  }
}

/**
 * Convert hex color to RGB format for better compatibility
 * @param hex The hex color string
 * @returns The RGB representation of the color
 */
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return 'rgb(0,0,0)'

  return `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})`
}

// ===========================
// AVATAR GENERATORS
// ===========================
/**
 * Generate a DiceBear avatar (Primary choice - Most reliable).
 * @param identifier The unique identifier for the avatar
 * @param userName The name of the user
 * @param config Configuration options for the avatar
 * @returns The generated avatar image result
 */
export const generateDiceBearAvatar = (
  identifier: string | number,
  userName: string,
  config: IAvatarConfig = {},
): IImageResult => {
  const { size = 512, style } = config
  const seed = generateSeed(identifier, userName, USER_IMAGES.AVATAR)
  const backgroundColor = getRandomColor(seed).replace('#', '')
  const avatarStyle = style || pickAvatarStyleBySeed(seed)

  const params = new URLSearchParams({
    seed,
    backgroundColor,
    size: size.toString(),
    radius: '10', // Rounded corners
    scale: '100', // Full scale
  })

  // Add style-specific enhancements
  if (avatarStyle === 'avataaars') {
    params.append('mouth', 'smile')
    params.append('eyes', 'default')
  } else if (avatarStyle === 'bottts') {
    params.append('colorful', 'true')
  }

  const url = `https://api.dicebear.com/7.x/${avatarStyle}/svg?${params.toString()}`

  return {
    url,
    type: IMAGE_SOURCES.DICEBEAR,
    style: avatarStyle,
  }
}

/**
 * Generate UI Avatars (Text-based fallback)
 * @param userName The name of the user
 * @param config Configuration options for the avatar
 * @returns The generated avatar image result
 */
export const generateUIAvatar = (userName: string, config: IAvatarConfig = {}): IImageResult => {
  const { size = 512, rounded = true, bold = true, fontSize = 0.5 } = config

  const initials = getInitials(userName)
  const backgroundColor = getRandomColor(userName).replace('#', '')

  const params = new URLSearchParams({
    name: initials,
    background: backgroundColor,
    color: 'ffffff',
    rounded: rounded.toString(),
    bold: bold.toString(),
    'font-size': fontSize.toString(),
    size: size.toString(),
    format: 'svg',
    length: '2',
  })

  const url = `https://ui-avatars.com/api/?${params.toString()}`

  return {
    url,
    type: IMAGE_SOURCES.UI_AVATAR,
  }
}

/**
 * Generate Robohash avatar (Fun alternative)
 * @param identifier The unique identifier for the avatar
 * @param userName The name of the user
 * @param config Configuration options for the avatar
 * @returns The generated avatar image result
 */
export const generateRobohashAvatar = (
  identifier: string | number,
  userName: string,
  config: IAvatarConfig = {},
): IImageResult => {
  const { size = 512 } = config
  const seed = generateSeed(identifier, userName, USER_IMAGES.AVATAR)

  // Different robot sets for variety
  const sets = ['set1', 'set2', 'set3', 'set4']
  const selectedSet = pickBySeed(sets, seed)

  const params = new URLSearchParams({
    size: `${size}x${size}`,
    set: selectedSet,
    bgset: 'bg1',
  })

  const url = `https://robohash.org/${encodeURIComponent(seed)}?${params.toString()}`

  return {
    url,
    type: IMAGE_SOURCES.ROBOHASH,
  }
}

// ===========================
// COVER GENERATORS
// ===========================
/**
 * Generate Picsum cover (Nature photos - Primary choice)
 * @param identifier The unique identifier for the cover
 * @param config Configuration options for the cover
 * @returns The generated cover image result
 */
export const generatePicsumCover = (identifier: string | number, config: ICoverConfig = {}): IImageResult => {
  const { width = 1200, height = 400 } = config
  const seed = generateSeed(identifier, 'cover', USER_IMAGES.COVER)

  // Use seed to ensure consistency but add randomness
  const photoId = (Math.abs(parseInt(seed, 36)) % 1000) + 1 // 1-1000

  const url = `https://picsum.photos/seed/${seed}/${width}/${height}?random=${photoId}`

  return {
    url,
    type: IMAGE_SOURCES.PICSUM,
    theme: 'nature',
  }
}

/**
 * Generate Unsplash themed cover
 * @param identifier The unique identifier for the cover
 * @param config Configuration options for the cover
 * @returns The generated cover image result
 */
export const generateUnsplashCover = (identifier: string | number, config: ICoverConfig = {}): IImageResult => {
  const { width = 1200, height = 400 } = config
  const seed = generateSeed(identifier, 'cover', USER_IMAGES.COVER)
  const theme = pickThemeBySeed(seed)
  const randomNum = Math.abs(parseInt(seed, 36)) % 100

  const url = `https://source.unsplash.com/${width}x${height}/?${theme}&${randomNum}&fit=crop&crop=center`

  return {
    url,
    type: IMAGE_SOURCES.UNSPLASH,
    theme,
  }
}

/**
 * Generate beautiful gradient SVG cover (Always reliable fallback)
 * @param identifier The unique identifier for the cover
 * @param config Configuration options for the cover
 * @returns The generated cover image result
 */
export const generateGradientCover = (identifier: string | number, config: ICoverConfig = {}): IImageResult => {
  const { width = 1200, height = 400 } = config
  const seed = generateSeed(identifier, 'gradient', USER_IMAGES.COVER)

  const gradientCombo = pickBySeed(GRADIENT_COMBOS, seed)
  const [color1, color2] = gradientCombo

  // Random gradient directions for variety
  const directions = [
    { x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, // Diagonal
    { x1: '0%', y1: '0%', x2: '100%', y2: '0%' }, // Horizontal
    { x1: '0%', y1: '0%', x2: '0%', y2: '100%' }, // Vertical
    { x1: '0%', y1: '100%', x2: '100%', y2: '0%' }, // Reverse diagonal
  ]
  const direction = pickBySeed(directions, seed)

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad" x1="${direction.x1}" y1="${direction.y1}" x2="${direction.x2}" y2="${direction.y2}">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${color1}99;stop-opacity:0.9" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="noise">
          <feTurbulence baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/>
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0.03"/>
          </feComponentTransfer>
          <feComposite in="SourceGraphic" operator="over"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" filter="url(#noise)"/>
    </svg>
  `.trim()

  const url = `data:image/svg+xml,${encodeURIComponent(svg)}`

  return {
    url,
    type: IMAGE_SOURCES.GRADIENT,
    theme: 'gradient',
  }
}

// ===========================
// VALIDATION SERVICE
// ===========================
/**
 * Validate if image URL is accessible and valid
 * @param url The image URL to validate
 * @param config Configuration options for the validation
 * @returns True if the image URL is valid, false otherwise
 */
export const validateImageUrl = async (url: string, config: IValidationConfig = {}): Promise<boolean> => {
  const { timeout = 8000, retries = 2, validateContentType = true } = config

  // Data URLs (gradients) are always valid
  if (url.startsWith('data:image/')) {
    return true
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; ImageValidator/1.0)',
          Accept: 'image/*,*/*;q=0.8',
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.warn(`Image validation failed: ${response.status} ${response.statusText} for ${url}`)
        continue
      }

      if (validateContentType) {
        const contentType = response.headers.get('content-type')
        const isImage = contentType?.startsWith('image/') || contentType?.includes('svg')

        if (!isImage) {
          console.warn(`Invalid content type: ${contentType} for ${url}`)
          continue
        }
      }

      return true
    } catch {
      console.warn(`Image validation attempt ${attempt + 1} failed for ${url}`)
    }
  }

  return false
}

/**
 * Get first working URL from a list with parallel validation
 */
export const getWorkingImageUrl = async (urls: string[], config: IValidationConfig = {}): Promise<string | null> => {
  if (urls.length === 0) return null

  // Data URLs (gradients) are always valid - prioritize them for reliability
  for (const url of urls) {
    if (url.startsWith('data:image/')) {
      return url
    }
  }

  // Try all URLs in parallel for faster response
  const validationPromises = urls.map(async (url, index) => {
    try {
      const isValid = await validateImageUrl(url, config)
      return { url, index, isValid }
    } catch {
      return { url, index, isValid: false }
    }
  })

  try {
    const results = await Promise.allSettled(validationPromises)

    // Find first valid URL maintaining original order
    for (let i = 0; i < urls.length; i++) {
      const result = results.find((r) => r.status === 'fulfilled' && r.value?.index === i && r.value?.isValid)
      if (result && result.status === 'fulfilled') {
        return result.value.url
      }
    }
  } catch {
    console.error('Error in parallel validation')
  }

  // Fallback: return first URL if none validated successfully
  return urls[0] || null
}

// ===========================
// MAIN USER IMAGE SERVICE
// ===========================
/**
 * Generate complete user images with comprehensive fallback system
 */
export const generateUserImages = async (
  identifier: string | number,
  userName: string,
  config: IUserImageConfig = {},
): Promise<IUserImages> => {
  const {
    avatar: avatarConfig = { size: 512 },
    cover: coverConfig = { width: 1200, height: 400 },
    validation: validationConfig = { timeout: 8000, retries: 2 },
    generateOptions = false,
  } = config

  try {
    // Generate primary images and fallbacks
    const avatarResults = [
      generateDiceBearAvatar(identifier, userName, avatarConfig),
      generateUIAvatar(userName, avatarConfig),
      generateRobohashAvatar(identifier, userName, avatarConfig),
    ]

    const coverResults = [
      generatePicsumCover(identifier, coverConfig),
      generateGradientCover(identifier, coverConfig), // Reliable fallback first
      generateUnsplashCover(identifier, coverConfig),
    ]

    // Extract URLs for validation
    const avatarUrls = avatarResults.map((r) => r.url)
    const coverUrls = coverResults.map((r) => r.url)

    // Validate and get working URLs
    const [workingAvatarUrl, workingCoverUrl] = await Promise.all([
      getWorkingImageUrl(avatarUrls, validationConfig),
      getWorkingImageUrl(coverUrls, validationConfig),
    ])

    const result: IUserImages = {
      avatar: workingAvatarUrl || avatarUrls[1], // Fallback to UI Avatar
      cover: workingCoverUrl || coverUrls[1], // Fallback to gradient
      avatarFallbacks: avatarUrls.slice(1),
      coverFallbacks: coverUrls.slice(1),
    }

    // Generate selection options if requested
    if (generateOptions) {
      result.avatarOptions = generateAvatarOptions(identifier, userName, avatarConfig)
      result.coverOptions = generateCoverOptions(identifier, coverConfig)
    }

    return result
  } catch {
    // Emergency fallback - always works
    return {
      avatar: generateUIAvatar(userName, avatarConfig).url,
      cover: generateGradientCover(identifier, coverConfig).url,
      avatarFallbacks: [],
      coverFallbacks: [],
    }
  }
}

/**
 * Generate multiple avatar options for user selection
 */
export const generateAvatarOptions = (
  identifier: string | number,
  userName: string,
  config: IAvatarConfig = {},
  count: number = 12,
): IAvatarOption[] => {
  const options: IAvatarOption[] = []
  const baseSeed = generateSeed(identifier, userName, USER_IMAGES.AVATAR)

  // Generate diverse DiceBear avatars
  const diceBearCount = Math.floor(count * 0.75) // 75% DiceBear
  for (let i = 0; i < diceBearCount; i++) {
    const style = AVATAR_STYLES[i % AVATAR_STYLES.length]
    const seed = `${baseSeed}-opt${i}`

    // Use existing function with modified config
    const result = generateDiceBearAvatar(seed, userName, {
      ...config,
      style,
    })

    const previewUrl = result.url.replace(`size=${config.size || 512}`, 'size=128')

    options.push({
      url: result.url,
      style: result.style || style,
      type: result.type,
      preview: previewUrl,
    })
  }

  // Add UI Avatar options with different colors
  const uiCount = count - diceBearCount
  const popularColors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD']
  for (let i = 0; i < uiCount; i++) {
    const color = popularColors[i % popularColors.length]

    // Create UI Avatar with custom colors
    const initials = getInitials(userName)
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=ffffff&size=${config.size || 512}&rounded=true&bold=true&font-size=0.5&format=svg`

    const previewUrl = url.replace(`size=${config.size || 512}`, 'size=128')

    options.push({
      url,
      style: `initials-${color}`,
      type: IMAGE_SOURCES.UI_AVATAR,
      preview: previewUrl,
    })
  }

  return options
}

/**
 * Generate multiple cover options for user selection
 */
export const generateCoverOptions = (
  identifier: string | number,
  config: ICoverConfig = {},
  count: number = 9,
): ICoverOption[] => {
  const options: ICoverOption[] = []
  const baseSeed = generateSeed(identifier, 'cover-options', USER_IMAGES.COVER)

  // Generate Picsum options (nature photos)
  const picsumCount = Math.floor(count * 0.6) // 60% nature photos
  for (let i = 0; i < picsumCount; i++) {
    const seed = `${baseSeed}-${i}`

    // Use existing function with modified identifier
    const result = generatePicsumCover(seed, config)

    // Create a smaller preview version
    const previewConfig = { width: 400, height: 150 }
    const previewResult = generatePicsumCover(seed, previewConfig)

    options.push({
      url: result.url,
      theme: result.theme || 'nature',
      type: result.type,
      preview: previewResult.url,
    })
  }

  // Add gradient options
  const gradientCount = count - picsumCount
  for (let i = 0; i < gradientCount; i++) {
    // Use existing function with modified identifier
    const gradientResult = generateGradientCover(`${identifier}-grad${i}`, config)
    const previewResult = generateGradientCover(`${identifier}-grad${i}`, { width: 400, height: 150 })

    options.push({
      url: gradientResult.url,
      theme: gradientResult.theme || 'gradient',
      type: gradientResult.type,
      preview: previewResult.url,
    })
  }

  return options
}

// ===========================
// FRONTEND UTILITIES
// ===========================
/**
 * Create optimized image URLs for different screen sizes
 */
export const getResponsiveImageUrl = (
  originalUrl: string,
  type: ImageSource,
  size: 'sm' | 'md' | 'lg' | 'xl' = 'md',
): string => {
  const sizeMap = {
    sm: { avatar: 64, cover: { width: 400, height: 150 } },
    md: { avatar: 128, cover: { width: 600, height: 200 } },
    lg: { avatar: 256, cover: { width: 900, height: 300 } },
    xl: { avatar: 512, cover: { width: 1200, height: 400 } },
  }

  const targetSize = sizeMap[size]

  switch (type) {
    case IMAGE_SOURCES.DICEBEAR:
      return originalUrl.replace(/size=\d+/, `size=${targetSize.avatar}`)

    case IMAGE_SOURCES.UI_AVATAR:
      return originalUrl.replace(/size=\d+/, `size=${targetSize.avatar}`)

    case IMAGE_SOURCES.PICSUM:
      return originalUrl.replace(/\/\d+\/\d+/, `/${targetSize.cover.width}/${targetSize.cover.height}`)

    case IMAGE_SOURCES.UNSPLASH:
      return originalUrl.replace(/\/\d+x\d+/, `/${targetSize.cover.width}x${targetSize.cover.height}`)

    default:
      return originalUrl
  }
}

/**
 * Generate image with loading states and error fallbacks (React component logic)
 */
export const createImageWithFallback = (
  primaryUrl: string,
  fallbackUrls: string[] = [],
  onError?: (error: Event) => void,
) => {
  return {
    src: primaryUrl,
    onError: (event: Event) => {
      const img = event.target as HTMLImageElement
      const currentIndex = fallbackUrls.indexOf(img.src)
      const nextIndex = currentIndex + 1

      if (nextIndex < fallbackUrls.length) {
        img.src = fallbackUrls[nextIndex]
      } else {
        // All fallbacks failed, call error handler
        onError?.(event)
      }
    },
    loading: 'lazy' as const,
    decoding: 'async' as const,
  }
}
