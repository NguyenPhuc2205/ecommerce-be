/**
 * A curated collection of trending color hex codes for modern UI design.
 * This palette includes 70 carefully selected colors organized into thematic groups
 * to provide designers and developers with ready-to-use color options that align
 * with current design trends. Each group represents a specific mood or aesthetic.
 *
 * Color Groups
 * - Warm & Cozy (indices 0-9): Peachy, coral, and tan tones
 * - Cool & Fresh (indices 10-19): Aqua, teal, and ocean blues
 * - Nature & Earth (indices 20-29): Forest greens and earth tones
 * - Vibrant & Bold (indices 30-39): Hot pinks, purples, and reds
 * - Sunset & Golden (indices 40-49): Yellows, golds, and warm neutrals
 * - Professional & Modern (indices 50-59): Navy, gray, and neutral tones
 *
 * @type {ReadonlyArray<string>}
 */
export const TRENDING_COLORS = [
  // Warm & Cozy
  '#FFBE98',
  '#F0686C',
  '#FF8360',
  '#E2725B',
  '#D2B48C',
  '#CB997E',
  '#D0AD94',
  '#C67F66',
  '#B0A8BD',
  '#D0B5AD',

  // Cool & Fresh
  '#5DC7B7',
  '#71ADBA',
  '#99B6B3',
  '#70959E',
  '#ACD8E6',
  '#A2DFF7',
  '#08A8E4',
  '#0D6EFD',
  '#39BEB1',
  '#79CBB8',

  // Nature & Earth
  '#4C5578',
  '#4B856E',
  '#699A1E',
  '#4CBB17',
  '#90BE6D',
  '#B9FBC0',
  '#C7D8C6',
  '#A5A58D',
  '#304233',
  '#173020',

  // Vibrant & Bold
  '#FF6B6B',
  '#F3722C',
  '#D72631',
  '#E52165',
  '#D9138A',
  '#6D3D91',
  '#B565A7',
  '#D902EE',
  '#FF69B4',
  '#CF1578',

  // Sunset & Golden
  '#FEE440',
  '#F9C74F',
  '#FFE156',
  '#F3CA20',
  '#E8D21D',
  '#FFC13B',
  '#F7D794',
  '#FFCA5C',
  '#EDEAB1',
  '#D9BF77',

  // Professional & Modern
  '#5B6D92',
  '#034F84',
  '#1B365D',
  '#282828',
  '#464646',
  '#778DA9',
  '#B2C2BF',
  '#CCCBC6',
  '#BFB5B2',
  '#AAAFB2',
] as const

/**
 * A collection of pre-designed gradient color combinations.
 * Contains 15 professionally curated two-color gradient combinations
 * that work harmoniously together. Each combination is represented as
 * a tuple of two hex color codes [startColor, endColor].
 *
 * These gradients are optimized for:
 * - Background designs
 * - Button effects
 * - Header banners
 * - Card overlays
 * - Loading animations
 *
 * @type {ReadonlyArray<readonly [string, string]>}
 */
export const GRADIENT_COMBOS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3'],
  ['#ffecd2', '#fcb69f'],
  ['#ff8a80', '#ffab91'],
  ['#81c784', '#aed581'],
  ['#64b5f6', '#90caf9'],
  ['#f8bbd9', '#e1bee7'],
  ['#dce775', '#fff176'],
  ['#ff9a9e', '#fecfef'],
  ['#a18cd1', '#fbc2eb'],
  ['#fad0c4', '#ffd1ff'],
] as const

/**
 * Predefined thematic keywords for generating cover images.
 * Each theme consists of comma-separated keywords that can be used
 * with image generation APIs (like Unsplash, Pexels) to fetch or
 * generate contextually appropriate cover images. Themes are designed
 * to cover various aesthetics and use cases.
 *
 * @type {ReadonlyArray<string>}
 */
export const COVER_THEMES = [
  'abstract,minimal',
  'nature,landscape',
  'sunset,gradient',
  'ocean,blue',
  'forest,green',
  'mountain,peaceful',
  'sky,clouds',
  'geometric,pattern',
  'texture,soft',
  'cityscape,modern',
  'flowers,spring',
  'autumn,colors',
  'space,galaxy',
  'beach,tropical',
  'desert,minimal',
  'architecture,building',
  'technology,digital',
  'art,creative',
] as const

/**
 * Available avatar styles for programmatic avatar generation.
 * Compatible with DiceBear API and similar avatar generation services.
 * Each style produces a distinct visual aesthetic ranging from realistic
 * human avatars to abstract geometric patterns.
 *
 * **Style Categories:**
 * - Human-like: avataaars, big-ears, lorelei, micah, personas
 * - Cartoon/Fun: big-smile, croodles, fun-emoji, open-peeps
 * - Abstract: bottts, identicon, pixel-art, rings, shapes
 * - Adventure: adventurer, adventurer-neutral, thumbs
 * - Minimalist: initials, miniavs
 *
 * @type {ReadonlyArray<string>}
 *
 * @see {@link https://dicebear.com/styles | DiceBear Styles Documentation}
 */
export const AVATAR_STYLES = [
  'avataaars',
  'big-ears',
  'big-ears-neutral',
  'big-smile',
  'bottts',
  'croodles',
  'identicon',
  'initials',
  'lorelei',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'pixel-art',
  'thumbs',
  'adventurer',
  'adventurer-neutral',
  'fun-emoji',
  'rings',
  'shapes',
] as const
