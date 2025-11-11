// ================================================================
// REGEX PATTERNS
// ================================================================
/**
 * A collection of regular expression patterns for validating various data formats.
 */
export const REGEX_PATTERNS = {
  /**
   * Common validation patterns used across the application
   */
  COMMON: {
    /**
     * Validates email address format (RFC 5322 compliant + practical)
     *
     * Features
     * - No consecutive dots (..)
     * - No leading/trailing dots in local part
     * - No leading/trailing dots in domain
     * - Supports special chars: !#$%&'*+/=?^_`{|}~-
     * - Supports subdomains: user@mail.example.com
     * - Supports internationalized TLDs: .中国, .рф
     * - Local part: max 64 chars, domain: max 253 chars (per RFC)
     *
     * Examples
     * - Valid: user@example.com, user.name+tag@sub.example.co.uk
     * - Invalid: user..name@example.com, .user@example.com, user@domain..com
     */
    EMAIL:
      /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,

    /**
     * Validates international phone numbers (E.164 + real-world flexibility).
     *
     * Features
     * - 7–15 digits total (per ITU-T E.164)
     * - Optional country code (+ / 00 prefix, up to 4 digits)
     * - Supports leading 0 (Vietnam, UK, etc.)
     * - Allows area code in parentheses
     * - Accepts separators: space, dot, dash (hoặc không có)
     * - Supports extensions: ext / x / # + 1–6 digits
     * - Covers hotlines: 1800 / 1900 / etc.
     * - Works with/without separators (liền hoặc có khoảng cách)
     *
     * Examples (all valid)
     * +84901234567, 0901234567, (028) 3822 1234, 84-90-123-4567
     * +1-555-123-4567, (555) 123-4567, +44 20 7946 0958
     * +86 138 0000 0000, +81 90-1234-5678, 1800-1234, 18001234
     * +1 555 123 4567 ext 123, +1 (555) 123-4567 x456
     */
    PHONE:
      /^(?=(?:[^0-9]*[0-9]){7,15}[^0-9]*$)(?:(?:\+|00)?[0-9]{1,4}[\s.-]?)?(?:\(?0?[0-9]{1,5}\)?[\s.-]?)?[0-9]{1,4}(?:[\s.-]?[0-9]{1,4}){0,3}(?:[\s.-]?(?:ext|x|#)[\s.-]?[0-9]{1,6})?$/i,

    /**
     * Validates strong password format
     * Requirements: min 6 chars
     */
    PASSWORD: /^.{6,}$/,

    /**
     * Validates username format
     * Allowed: alphanumeric and underscore, 3-20 characters
     */
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,

    /**
     * Validates full name format (supports Vietnamese characters)
     * Example: Nguyễn Văn A
     */
    FULL_NAME: /^[a-zA-ZÀ-ỹ\s]{2,50}$/,

    /**
     * Validates URL format
     * Supports http and https protocols
     */
    URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/,

    /**
     * Validates URL slug format
     * Example: my-blog-post-title
     */
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

    /**
     * Validates hexadecimal color code
     * Example: #FF5733, #f57
     */
    HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,

    /**
     * Validates expiration time format
     */
    EXPIRE_TIME: /^(\d+)(s|m|h|d|w|M|y)$/,
  } as const,

  /**
   * System-related patterns for infrastructure and technical validation
   */
  SYSTEM: {
    /**
     * Validates UUID v4 format
     * Example: 550e8400-e29b-41d4-a716-446655440000
     */
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

    /**
     * Validates trace ID format (alphanumeric with hyphens, 16-64 chars)
     * Used for distributed tracing
     */
    TRACE_ID: /^[a-zA-Z0-9-]{16,64}$/,

    /**
     * Validates API key format (base64-like, min 32 chars)
     */
    API_KEY: /^[A-Za-z0-9-_]{32,}$/,

    /**
     * Validates semantic versioning format
     * Example: 1.0.0, 2.1.3-beta.1
     */
    SEMVER:
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/,

    /**
     * Validates database connection URL.
     *
     * Features
     * - PostgreSQL, MySQL, MongoDB (+srv), Redis, MSSQL, SQLite
     * - Optional user/password (password có thể chứa special chars)
     * - Multiple hosts (replica sets): host1:port1,host2:port2
     * - Optional database name
     * - Query parameters: ?key=value&key2=value2
     * - Redis database number: /0, /1, etc.
     *
     * Examples
     * postgresql://user:p%40ss@localhost:5432/mydb?sslmode=require
     * mysql://root@localhost/test
     * mongodb+srv://user:pass@cluster.mongodb.net/db
     * mongodb://host1:27017,host2:27017,host3:27017/db?replicaSet=rs0
     * redis://:password@localhost:6379/0
     * mssql://sa:Pass@123@localhost:1433/master
     * sqlite:///path/to/database.db
     */
    DATABASE_URL:
      /^(postgres(ql)?|mysql|mongodb(\+srv)?|redis|mssql|sqlite):\/\/(?:([a-zA-Z0-9_-]+)?(?::([^@\s]+))?@)?((?:[a-zA-Z0-9.-]+(?::\d+)?(?:,)?)+)(?:\/([a-zA-Z0-9_-]+)?)?(?:\?[^\s]*)?$/,

    /**
     * Validates JSON Web Token format
     * Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     */
    JWT: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,

    /**
     * Validates base64 encoded string
     */
    BASE64: /^[A-Za-z0-9+/]*={0,2}$/,
  },

  /**
   * Network-related patterns for IP addresses, domains, etc.
   */
  NETWORK: {
    /**
     * Validates IPv4 address format
     * Example: 192.168.1.1
     */
    IPV4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,

    /**
     * Validates IPv6 address (RFC 4291 compliant)
     *
     * Features
     * - Full form: 2001:0db8:85a3:0000:0000:8a2e:0370:7334
     * - Compressed: 2001:db8:85a3::8a2e:370:7334, ::1, ::
     * - IPv4-mapped: ::ffff:192.0.2.1
     * - Link-local: fe80::1%eth0
     *
     * Examples
     * 2001:db8::1, ::1, fe80::, 2001:db8:85a3::8a2e:370:7334
     */
    IPV6: /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}(?::[0-9a-fA-F]{1,4}){1,2}|(?:[0-9a-fA-F]{1,4}:){1,4}(?::[0-9a-fA-F]{1,4}){1,3}|(?:[0-9a-fA-F]{1,4}:){1,3}(?::[0-9a-fA-F]{1,4}){1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}(?::[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:(?:(?::[0-9a-fA-F]{1,4}){1,6})|:(?:(?::[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(?::[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(?:ffff(?::0{1,4})?:)?(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9])\.){3}(?:25[0-5]|(?:2[0-4]|1?[0-9])?[0-9]))$/,

    /**
     * Validates domain name format
     * Example: example.com, sub.example.co.uk
     */
    DOMAIN: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,

    /**
     * Validates MAC address format
     * Example: 00:1A:2B:3C:4D:5E
     */
    MAC_ADDRESS: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,

    /**
     * Validates port number (1-65535)
     */
    PORT: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  },

  /**
   * File and media related patterns
   */
  FILE: {
    /**
     * Validates image file extensions
     * Allowed: jpg, jpeg, png, gif, webp, svg
     */
    IMAGE_EXT: /\.(jpg|jpeg|png|gif|webp|svg)$/i,

    /**
     * Validates video file extensions
     * Allowed: mp4, avi, mov, wmv, flv, mkv
     */
    VIDEO_EXT: /\.(mp4|avi|mov|wmv|flv|mkv)$/i,

    /**
     * Validates document file extensions
     * Allowed: pdf, doc, docx, xls, xlsx, ppt, pptx
     */
    DOCUMENT_EXT: /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i,

    /**
     * Validates audio file extensions
     * Allowed: mp3, wav, ogg, flac, aac
     */
    AUDIO_EXT: /\.(mp3|wav|ogg|flac|aac)$/i,

    /**
     * Validates image MIME type
     */
    MIME_TYPE_IMAGE: /^image\/(jpeg|png|gif|webp|svg\+xml)$/,

    /**
     * Validates video MIME type
     */
    MIME_TYPE_VIDEO: /^video\/(mp4|mpeg|quicktime|x-msvideo)$/,

    /**
     * Validates file name (cross-platform compatible)
     *
     * Features
     * - Length: 1-255 characters
     * - Allowed: letters, numbers, spaces, dots, hyphens, underscores, parentheses
     * - Forbidden chars (Windows/Unix): \ / : * ? " < > |
     * - Cannot be only dots: ., .., ...
     * - Cannot end with dot or space (Windows requirement)
     * - No control characters (0x00-0x1F)
     *
     * Valid: document.pdf, my file (2024).txt, file_name-v2.docx
     * Invalid: con, file., file , file/name, <script>.txt
     *
     * Note: Reserved names (CON, PRN, AUX, NUL, COM1-9, LPT1-9) should be
     * checked separately as they're Windows-specific
     */
    FILE_NAME: /^(?!\.$|\.\.+$)[^\p{Cc}\\/:*?"<>|]{1,255}(?<![. ])$/u,
  },

  /**
   * Date and time related patterns
   */
  DATETIME: {
    /**
     * Validates ISO date format
     * Example: 2024-01-15
     */
    ISO_DATE: /^\d{4}-\d{2}-\d{2}$/,

    /**
     * Validates ISO 8601 datetime format.
     *
     * Features
     * - Basic: 2024-01-15T10:30:00
     * - With milliseconds: 2024-01-15T10:30:00.123
     * - With microseconds: 2024-01-15T10:30:00.123456
     * - UTC timezone: 2024-01-15T10:30:00Z
     * - Offset timezone: 2024-01-15T10:30:00+07:00, 2024-01-15T10:30:00-05:00
     * - Without seconds: 2024-01-15T10:30Z (optional)
     *
     * Valid: 2024-01-15T10:30:00.123Z, 2024-01-15T10:30:00+07:00
     */
    ISO_DATETIME:
      /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?$/,

    /**
     * Validates 24-hour time format
     * Example: 14:30, 09:00
     */
    TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,

    /**
     * Validates 12-hour time format with AM/PM
     * Example: 2:30 PM, 09:00 AM
     */
    TIME_12H: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i,

    /**
     * Validates date in DD/MM/YYYY format
     * Example: 15/01/2024
     */
    DATE_DDMMYYYY: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,

    /**
     * Validates date in MM/DD/YYYY format
     * Example: 01/15/2024
     */
    DATE_MMDDYYYY: /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/,
  },

  /**
   * Cron expression patterns.
   */
  CRON: {
    /**
     * Validates standard cron expression (5 fields).
     *
     * Supported Features
     * - Wildcards: '*'
     * - Ranges: 1-5, 10-20
     * - Lists: 1,3,5,7
     * - Steps: '*\/5', '10-50\/5'
     * - Combinations: '1,3,5-9,*\/2'
     *
     * Format: minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-6)
     *
     * Examples
     * '* * * * *' (every minute)
     * '0 0 * * *' (daily at midnight)
     * '*\/5 * * * *' (every 5 minutes)
     * '0 9-17 * * 1-5' (9am-5pm on weekdays)
     * '0,30 * * * *' (every 30 minutes)
     * '0-30\/5 9-17 * * *' (every 5 min between :00-:30, 9am-5pm)
     */
    STANDARD:
      /^(\*|(?:\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)|(?:\*\/\d+)|(?:\d+-\d+\/\d+))\s+(\*|(?:\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)|(?:\*\/\d+)|(?:\d+-\d+\/\d+))\s+(\*|(?:\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)|(?:\*\/\d+)|(?:\d+-\d+\/\d+))\s+(\*|(?:\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)|(?:\*\/\d+)|(?:\d+-\d+\/\d+))\s+(\*|(?:\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*)|(?:\*\/\d+)|(?:\d+-\d+\/\d+))$/,

    /**
     * Validates extended cron expression (6 fields with seconds)
     * Format: second minute hour day month weekday
     * Example: 0 0 0 * * * (every day at midnight with seconds)
     */
    EXTENDED:
      /^(\*|([0-5]?\d)) (\*|([0-5]?\d)) (\*|([01]?\d|2[0-3])) (\*|([01]?\d|2\d|3[01])) (\*|([1-9]|1[0-2])) (\*|([0-6]))$/,

    /**
     * Validates AWS cron expression (6 fields)
     * Format: minute hour day month weekday year
     * Example: 0 0 * * ? * (every day at midnight)
     */
    AWS: /^(\*|\?|([0-5]?\d)) (\*|\?|([01]?\d|2[0-3])) (\*|\?|([01]?\d|2\d|3[01])) (\*|\?|([1-9]|1[0-2])) (\*|\?|([0-6])) (\*|\?|\d{4})$/,
  },

  /**
   * Social media platform patterns
   */
  SOCIAL: {
    /**
     * Validates Twitter/X username
     * 1-15 characters, alphanumeric and underscore
     * Example: @username, username
     */
    TWITTER_USERNAME: /^@?[a-zA-Z0-9_]{1,15}$/,

    /**
     * Validates Instagram username
     * 1-30 characters, alphanumeric, period, underscore
     * Example: @username, user.name_123
     */
    INSTAGRAM_USERNAME: /^@?[a-zA-Z0-9_.]{1,30}$/,

    /**
     * Validates Facebook username/page
     * 5-50 characters, alphanumeric and period
     * Example: john.doe, mycompany
     */
    FACEBOOK_USERNAME: /^[a-zA-Z0-9.]{5,50}$/,

    /**
     * Validates LinkedIn profile URL
     * Example: linkedin.com/in/username, linkedin.com/company/company-name
     */
    LINKEDIN_URL: /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?$/,

    /**
     * Validates YouTube channel URL
     * Example: youtube.com/@username, youtube.com/c/channelname
     */
    YOUTUBE_URL: /^https?:\/\/(www\.)?youtube\.com\/(c|channel|user|@)[a-zA-Z0-9_-]+\/?$/,

    /**
     * Validates GitHub username
     * Example: octocat, github-user
     */
    GITHUB_USERNAME: /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,

    /**
     * Validates GitHub repository format
     * Example: username/repo-name
     */
    GITHUB_REPO: /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/,

    /**
     * Validates TikTok username
     * 2-24 characters, alphanumeric, period, underscore
     * Example: @username, user.name_123
     */
    TIKTOK_USERNAME: /^@?[a-zA-Z0-9_.]{2,24}$/,

    /**
     * Validates Discord username
     * 2-32 characters, alphanumeric, underscore, period
     * Example: username#1234, user.name
     */
    DISCORD_USERNAME: /^[a-zA-Z0-9_.]{2,32}(#\d{4})?$/,

    /**
     * Validates Telegram username
     * 5-32 characters, alphanumeric and underscore
     * Example: @username
     */
    TELEGRAM_USERNAME: /^@?[a-zA-Z0-9_]{5,32}$/,
  },

  /**
   * Payment and financial patterns
   */
  PAYMENT: {
    /**
     * Validates credit card number format (NOT Luhn algorithm)
     *
     * Features
     * - Visa: 4xxx xxxx xxxx xxxx (13-19 digits)
     * - MasterCard: 51-55, 2221-2720 (16 digits)
     * - American Express: 34xx, 37xx (15 digits)
     * - Discover: 6011, 622126-622925, 644-649, 65 (16-19 digits)
     * - JCB: 3528-3589 (16-19 digits)
     * - Diners Club: 300-305, 36, 38 (14 digits)
     * - UnionPay: 62 (16-19 digits)
     *
     * WARNING: This only checks FORMAT, not validity via Luhn algorithm
     * For production, combine with Luhn checksum validation
     *
     * Examples: 4111111111111111 (Visa test), 5555555555554444 (MC test)
     */
    CREDIT_CARD:
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9]{2}|7(?:[01][0-9]|20))[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11}|62[0-9]{14,17})$/,

    /**
     * Validates CVV/CVC code
     * 3-4 digits
     */
    CVV: /^[0-9]{3,4}$/,

    /**
     * Validates card expiry date (MM/YY or MM/YYYY)
     * Example: 12/25, 12/2025
     */
    CARD_EXPIRY: /^(0[1-9]|1[0-2])\/?([0-9]{2}|[0-9]{4})$/,

    /**
     * Validates IBAN (International Bank Account Number)
     * Example: GB82 WEST 1234 5698 7654 32
     */
    IBAN: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/,

    /**
     * Validates BIC/SWIFT code
     * Example: DEUTDEFF, DEUTDEFF500
     */
    BIC_SWIFT: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,

    /**
     * Validates cryptocurrency wallet address (Bitcoin)
     * Example: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
     */
    BITCOIN_ADDRESS: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,

    /**
     * Validates Ethereum wallet address
     * Example: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
     */
    ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  },

  /**
   * Business and location patterns
   */
  BUSINESS: {
    /**
     * Validates Vietnam Tax ID (MST)
     * 10 or 13 digits
     * Example: 0123456789, 0123456789-001
     */
    VIETNAM_TAX_ID: /^\d{10}(-\d{3})?$/,

    /**
     * Validates Vietnam Citizen ID (CCCD)
     * 9 or 12 digits
     */
    VIETNAM_CITIZEN_ID: /^\d{9}$|^\d{12}$/,

    /**
     * Validates ZIP/Postal code (US)
     * Example: 12345, 12345-6789
     */
    US_ZIP_CODE: /^\d{5}(-\d{4})?$/,

    /**
     * Validates UK postcode
     * Example: SW1A 1AA, M1 1AE
     */
    UK_POSTCODE: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,

    /**
     * Validates Vietnam postcode
     * 6 digits
     * Example: 100000
     */
    VIETNAM_POSTCODE: /^\d{6}$/,

    /**
     * Validates company registration number (generic)
     * Alphanumeric, 6-20 characters
     */
    COMPANY_REG_NUMBER: /^[A-Z0-9]{6,20}$/,
  },
} as const

/**
 * Type representing all regex pattern categories
 */
export type RegexPatternCategory = keyof typeof REGEX_PATTERNS

/**
 * Type representing pattern names within a specific category
 */
export type RegexPattern<T extends RegexPatternCategory> = keyof (typeof REGEX_PATTERNS)[T]

/**
 * Helper type to get regex pattern by category and name
 * @example RegexPatternType<'COMMON', 'EMAIL'> => RegExp
 */
export type RegexPatternType<
  Category extends RegexPatternCategory,
  Pattern extends RegexPattern<Category>,
> = (typeof REGEX_PATTERNS)[Category][Pattern]
