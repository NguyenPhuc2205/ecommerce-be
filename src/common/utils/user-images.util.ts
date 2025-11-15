import { IMAGE_SOURCES, USER_IMAGES, UserImage } from '@/common/constants'
import { AVATAR_STYLES, TRENDING_COLORS, GRADIENT_COMBOS } from '@/common/constants/color.constant'
import { GradientDirection } from '@/common/interfaces'
import {
  IAvatarConfig,
  IImageResult,
  ICoverConfig,
  IValidationConfig,
  IUserImageConfig,
  IUserImages,
  IAvatarOption,
  ICoverOption,
} from '@/common/interfaces/user.interface'

/**
 * Generates a unique seed based on user information using djb2 hash function.
 * This function uses for DiceBear or Boring Avatars hash input (same input, same output).
 *
 * @param identifier - The user's identifier (e.g., userId, email, phoneNumber).
 * @param userName - The user's name.
 * @param type - The type of user image (avatar or cover).
 * @returns A unique seed string.
 * @reference http://www.cse.yorku.ca/~oz/hash.html
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
 *
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
 * Get the initials from a full name.
 *
 * @param name The full name of the user
 * @returns The initials of the user
 */
export const getInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return 'U'

  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 'U'
  if (words.length === 1) return words[0].charAt(0).toUpperCase()

  // Take first letter of first and last words (Puck Luv Perfume -> PP)
  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase()
}

/**
 * Formats a user's name.
 *
 * @param firstName The first name of the user
 * @param lastName The last name of the user (optional)
 * @returns The formatted full name
 */
export const formatName = (firstName: string, lastName?: string): string => {
  const fullName = lastName ? `${firstName} ${lastName}` : firstName

  // Puck luv perfume -> Puck+luv+perfume
  return fullName.trim().replace(/\s+/g, '+')
}

/**
 * Get a random color from the trending colors list.
 *
 * @param seed Optional seed to get a consistent color
 * @returns A randomly selected color string
 */
export const getRandomColor = (seed?: string): string => {
  if (seed) {
    return pickBySeed(TRENDING_COLORS, seed)
  }
  return TRENDING_COLORS[Math.floor(Math.random() * TRENDING_COLORS.length)]
}

/**
 * Pick an avatar style based on the seed.
 *
 * @param seed The seed string
 * @returns The selected avatar style
 */
export const pickAvatarStyleBySeed = (seed: string): string => {
  return pickBySeed(AVATAR_STYLES, seed)
}

/**
 * Parse full name into components.
 *
 * @param fullName The full name string
 * @returns An object with firstName and optional lastName
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

// ================================================================
// AVATAR GENERATORS
// ================================================================
/**
 * Generate a DiceBear avatar (Primary choice - Most reliable).
 *
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
 * Generate UI Avatars (Text-based fallback).
 *
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

// ================================================================
// COVER GENERATORS
// ================================================================
/**
 * Generate a compact gradient identifier (stores metadata, not full SVG)
 * This approach stores only the gradient config (~100 chars) instead of full SVG (>1000 chars)
 * Frontend will reconstruct the SVG from this metadata
 *
 * @param identifier The unique identifier for the cover
 * @param config Configuration options for the cover
 * @returns Compact gradient metadata string
 */
export const generateGradientCoverId = (identifier: string | number, config: ICoverConfig = {}): IImageResult => {
  const { width = 1200, height = 400 } = config
  const seed = generateSeed(identifier, 'gradient', USER_IMAGES.COVER)

  const gradientCombo = pickBySeed(GRADIENT_COMBOS, seed)
  const [color1, color2] = gradientCombo

  // Gradient direction options
  const directions = ['diagonal', 'horizontal', 'vertical', 'reverse-diagonal'] as const
  const direction = pickBySeed(directions, seed)

  // Compact format: gradient:color1-color2-direction-width-height
  // Example: gradient:#FF6B6B-#4ECDC4-diagonal-1200-400 (~60 chars)
  const compactId = `gradient:${color1}-${color2}-${direction}-${width}-${height}`

  return {
    url: compactId, // Store this in database
    type: IMAGE_SOURCES.GRADIENT,
    theme: 'gradient',
  }
}

/**
 * Reconstruct full gradient SVG from compact ID (use this in frontend)
 * @param compactId The compact gradient identifier
 * @returns Full SVG data URL
 */
export const reconstructGradientSvg = (compactId: string): string => {
  // Parse: gradient:#FF6B6B-#4ECDC4-diagonal-1200-400
  const parts = compactId.replace('gradient:', '').split('-')
  const [color1, color2, direction, width, height] = parts

  const directionMap: Record<string, GradientDirection> = {
    diagonal: { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
    horizontal: { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
    vertical: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    'reverse-diagonal': { x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
  }

  const dir = directionMap[direction] || directionMap['diagonal']

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad" x1="${dir.x1}" y1="${dir.y1}" x2="${dir.x2}" y2="${dir.y2}">
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

  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Get actual Picsum photo URL by fetching the redirect target
 * Picsum uses redirects to Fastly CDN, so we need to get the final URL
 * Example: https://picsum.photos/id/237/1200/400 -> https://fastly.picsum.photos/id/237/1200/400.jpg?hmac=...
 *
 * Note: In browser environments, this will get the Fastly URL. In Node.js, we store the Picsum URL
 * and let the browser handle the redirect for better performance.
 *
 * @param identifier The unique identifier
 * @param config Configuration options
 * @returns The Picsum image URL (will redirect to Fastly CDN in browser)
 */
export const generatePicsumCover = async (
  identifier: string | number,
  config: ICoverConfig = {},
): Promise<IImageResult> => {
  const { width = 1200, height = 400 } = config
  const seed = generateSeed(identifier, 'picsum', USER_IMAGES.COVER)

  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash = hash & hash
  }
  const imageId = Math.abs(hash) % 100

  try {
    // Use the /id/{id} endpoint for consistent images
    const picsumUrl = `https://picsum.photos/id/${imageId}/${width}/${height}`

    // Try to validate the URL is accessible (use GET since HEAD returns 405)
    const response = await fetch(picsumUrl, {
      method: 'GET',
      redirect: 'follow',
    })

    console.log('Picsum URL:', picsumUrl)
    console.log('Picsum Response Status:', response)

    // Fetch successful, return the final URL
    if (response.ok) {
      return {
        url: response.url, // This will be the Fastly CDN URL in browser
        type: IMAGE_SOURCES.PICSUM,
        theme: 'nature',
      }
    }

    // If status is not OK, throw error to trigger fallback
    throw new Error(`Picsum returned status ${response.status}`)
  } catch (err) {
    console.warn(`Failed to fetch Picsum URL (ID: ${imageId}):`, err instanceof Error ? err.message : err)
    // Fallback to gradient
    return generateGradientCoverId(identifier, config)
  }
}

/**
 * Generate placeholder.com cover (Always reliable, customizable)
 * Good fallback option with custom colors
 *
 * @param identifier The unique identifier
 * @param config Configuration options
 * @returns The placeholder.com image URL
 */
export const generatePlaceholderCover = (identifier: string | number, config: ICoverConfig = {}): IImageResult => {
  const { width = 1200, height = 400 } = config
  const seed = generateSeed(identifier, 'placeholder', USER_IMAGES.COVER)

  const gradientCombo = pickBySeed(GRADIENT_COMBOS, seed)
  const [color1, color2] = gradientCombo

  // Remove # from colors
  const bg = color1.replace('#', '')
  const text = color2.replace('#', '')

  // via.placeholder.com supports custom colors and text
  const url = `https://placehold.co/${width}x${height}/${bg}/${text}?text=Cover+Image`

  return {
    url,
    type: IMAGE_SOURCES.PLACEHOLDER,
    theme: 'solid',
  }
}

// ================================================================
// VALIDATION SERVICE
// ================================================================
/**
 * Validate if image URL is accessible and valid
 * @param url The image URL to validate
 * @param config Configuration options for the validation
 * @returns True if the image URL is valid, false otherwise
 */
export const validateImageUrl = async (url: string, config: IValidationConfig = {}): Promise<boolean> => {
  const { timeout = 8000, retries = 2, validateContentType = true } = config

  // Compact gradient IDs need reconstruction first
  if (url.startsWith('gradient:')) {
    return true // Always valid, will be reconstructed on frontend
  }

  // Data URLs are always valid
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
        console.warn(`Image validation failed: ${response.status} for ${url}`)
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
    } catch (err) {
      console.warn(`Image validation attempt ${attempt + 1} failed for ${url}`, err)
    }
  }

  return false
}

/**
 * Get first working URL from a list with parallel validation.
 *
 * @param urls The list of image URLs to validate
 * @param config Configuration options for validation
 * @returns The first valid image URL or null if none are valid
 */
export const getWorkingImageUrl = async (urls: string[], config: IValidationConfig = {}): Promise<string | null> => {
  if (urls.length === 0) return null

  // Try all URLs in parallel
  const validationPromises = urls.map(async (url, index) => {
    try {
      // Prioritize gradient IDs and data URLs (always valid)
      if (url.startsWith('gradient:') || url.startsWith('data:image/')) {
        return { url, index, isValid: true }
      }

      const isValid = await validateImageUrl(url, config)
      return { url, index, isValid }
    } catch {
      return { url, index, isValid: false }
    }
  })

  try {
    const results = await Promise.allSettled(validationPromises)

    // Find first valid URL maintaining order
    for (let i = 0; i < urls.length; i++) {
      const result = results.find((r) => r.status === 'fulfilled' && r.value?.index === i && r.value?.isValid)
      if (result && result.status === 'fulfilled') {
        return result.value.url
      }
    }
  } catch (error) {
    console.error('Error in parallel validation:', error)
  }

  // Fallback to first URL
  return urls[0] || null
}

// ================================================================
// MAIN USER IMAGE SERVICE
// ================================================================
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
    // Generate avatar options
    const avatarResults = [
      generateDiceBearAvatar(identifier, userName, avatarConfig),
      generateUIAvatar(userName, avatarConfig),
    ]

    // Generate cover options with multiple sources
    const coverResults = await Promise.allSettled([
      generatePicsumCover(identifier, coverConfig),
      Promise.resolve(generateGradientCoverId(identifier, coverConfig)),
      generatePlaceholderCover(identifier, coverConfig),
    ])

    // Extract successful cover results
    const coverUrls = coverResults
      .filter((r): r is PromiseFulfilledResult<IImageResult> => r.status === 'fulfilled')
      .map((r) => r.value.url)

    // Avatar URLs
    const avatarUrls = avatarResults.map((r) => r.url)

    // Validate and get working URLs
    const [workingAvatarUrl, workingCoverUrl] = await Promise.all([
      getWorkingImageUrl(avatarUrls, validationConfig),
      getWorkingImageUrl(coverUrls, validationConfig),
    ])

    const result: IUserImages = {
      avatar: workingAvatarUrl || avatarUrls[1], // Fallback to UI Avatar
      cover: workingCoverUrl || coverUrls[coverUrls.length - 1], // Fallback to gradient
      avatarFallbacks: avatarUrls.slice(1),
      coverFallbacks: coverUrls.slice(1),
    }

    // Generate selection options if requested
    if (generateOptions) {
      result.avatarOptions = generateAvatarOptions(identifier, userName, avatarConfig)
      result.coverOptions = await generateCoverOptions(identifier, coverConfig)
    }

    return result
  } catch (error) {
    console.error('Error generating user images:', error)
    // Emergency fallback
    return {
      avatar: generateUIAvatar(userName, avatarConfig).url,
      cover: generateGradientCoverId(identifier, coverConfig).url,
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

  // Generate DiceBear avatars (75%)
  const diceBearCount = Math.floor(count * 0.75)
  for (let i = 0; i < diceBearCount; i++) {
    const style = AVATAR_STYLES[i % AVATAR_STYLES.length]
    const seed = `${baseSeed}-opt${i}`

    const result = generateDiceBearAvatar(seed, userName, { ...config, style })
    const previewUrl = result.url.replace(`size=${config.size || 512}`, 'size=128')

    options.push({
      url: result.url,
      style: result.style || style,
      type: result.type,
      preview: previewUrl,
    })
  }

  // Generate UI Avatar options (25%)
  const uiCount = count - diceBearCount
  const popularColors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD']
  for (let i = 0; i < uiCount; i++) {
    const color = popularColors[i % popularColors.length]
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
export const generateCoverOptions = async (
  identifier: string | number,
  config: ICoverConfig = {},
  count: number = 9,
): Promise<ICoverOption[]> => {
  const options: ICoverOption[] = []
  const baseSeed = generateSeed(identifier, 'cover-options', USER_IMAGES.COVER)

  // Generate Picsum options (40%)
  const picsumCount = Math.floor(count * 0.4)
  const picsumPromises: Promise<IImageResult>[] = []
  for (let i = 0; i < picsumCount; i++) {
    const seed = `${baseSeed}-pic${i}`
    picsumPromises.push(generatePicsumCover(seed, config))
  }

  const picsumResults = await Promise.allSettled(picsumPromises)
  picsumResults.forEach((result) => {
    if (result.status === 'fulfilled') {
      const previewConfig = { width: 400, height: 150 }
      // Replace dimensions in Fastly URL or original Picsum URL
      const previewUrl = result.value.url.replace(
        `/${config.width || 1200}/${config.height || 400}`,
        `/${previewConfig.width}/${previewConfig.height}`,
      )

      options.push({
        url: result.value.url,
        theme: result.value.theme || 'nature',
        type: result.value.type,
        preview: previewUrl,
      })
    }
  })

  // Generate gradient options
  const gradientCount = count - options.length // Fill remaining slots
  for (let i = 0; i < gradientCount; i++) {
    const seed = `${baseSeed}-grad${i}`
    const result = generateGradientCoverId(seed, config)
    const previewResult = generateGradientCoverId(seed, { width: 400, height: 150 })

    options.push({
      url: result.url,
      theme: result.theme || 'gradient',
      type: result.type,
      preview: previewResult.url,
    })
  }

  return options
}
