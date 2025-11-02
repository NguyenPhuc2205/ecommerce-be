/**
 * Color-related constants.
 *
 * @module ColorConstants
 */
/**
 * A collection of trending color hex codes.
 * These colors are selected based on current design trendss and popular palettes.
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
 * A collection of gradient color combinations.
 * Each combination consists of two hex color codes that blend well together.
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
 * Predefined themes for generating cover images.
 * These themes can be used with image generation services to create visually appealing covers.
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
 * Available avatar styles for generating user avatars.
 * These styles can be used with avatar generation services to create unique user profile images.
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
