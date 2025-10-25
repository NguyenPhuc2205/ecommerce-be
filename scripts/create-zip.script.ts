import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

interface PackageJson {
  version: string
  name: string
  [key: string]: unknown
}

/**
 * ZipCreator class handles the creation of ZIP archives from the dist/ directory.
 * Uses archiver library with maximum compression level for optimal file size.
 */
class ZipCreator {
  private readonly rootDir: string
  private readonly distDir: string
  private readonly releasesDir: string
  private readonly version: string
  private readonly zipFilePath: string
  private readonly packageJsonFileName: string = 'package.json'
  private readonly archiverZipLevel: number = 9 // Maximum compression (0-9)

  /**
   * Creates a new ZipCreator instance.
   * @param customVersion - Optional custom version string. If not provided, reads from package.json.
   */
  constructor(customVersion?: string) {
    // Determine root path and directories from scripts/
    // __dirname points to scripts/ directory, rootDir is the project root
    this.rootDir = path.join(__dirname, '..')
    this.distDir = path.join(this.rootDir, 'dist')
    this.releasesDir = path.join(this.rootDir, 'releases')

    // Get version from package.json or use custom version provided via CLI
    const packageJSON = this.getPackageJson()
    this.version = customVersion || packageJSON.version
    this.zipFilePath = path.join(this.releasesDir, `app-v${this.version}.zip`)

    console.log(`📌 Using version: ${this.version}\n`)
  }

  /**
   * Main execution method that orchestrates the entire ZIP creation process.
   *
   * Process flow:
   * 1. Validates dist/ directory exists and is not empty
   * 2. Ensures releases/ directory exists (creates if needed)
   * 3. Creates ZIP file from dist/ contents
   *
   * @throws {Error} If dist/ doesn't exist, is empty, or ZIP creation fails
   */
  public async execute(): Promise<void> {
    console.log('🚀 Starting ZIP creation process...\n')

    try {
      // Validate that dist/ directory exists and contains files
      this.validateDistDirectory()

      // Ensure releases/ directory exists (create if needed)
      this.ensureReleasesDirectory()

      // Create the ZIP file
      await this.createZip()

      console.log('\n🎉 ZIP creation process completed successfully!')
      process.exit(0)
    } catch (error) {
      console.error('\n💥 Error during ZIP creation:', error instanceof Error ? error.message : error)
      process.exit(1)
    }
  }

  /**
   * Creates the ZIP archive from dist/ directory using archiver library.
   *
   * Features:
   * - Streaming architecture (doesn't load entire content into memory)
   * - Maximum compression level (9)
   * - Real-time progress tracking
   * - Comprehensive error handling
   *
   * Data flow:
   * dist/ → archiver → compression → pipe → output stream → disk
   *
   * @returns Promise that resolves when ZIP file is completely written to disk
   * @throws {Error} If output stream fails or archiver encounters errors
   */
  private async createZip(): Promise<void> {
    console.log('📦 Creating ZIP file...')
    console.log(`Source: dist/`)
    console.log(`Output: releases/app-v${this.version}.zip`)
    console.log(`Compression: Level ${this.archiverZipLevel} (maximum)\n`)

    // Create a write stream for the ZIP file (destination where ZIP data will be written)
    const output = fs.createWriteStream(this.zipFilePath)

    // Create archiver instance with maximum compression
    // This is the "engine" that generates compressed ZIP data as a Readable stream
    const archiverInstance = archiver('zip', {
      zlib: { level: this.archiverZipLevel }, // Compression level (0-9, 9 = maximum)
    })

    return new Promise((resolve, reject) => {
      // ================================================================
      // EVENT HANDLERS - Must be set up BEFORE calling finalize()
      // ================================================================
      /**
       * Event: 'close' (on output stream)
       *
       * Triggered when the output stream is fully closed, meaning:
       * - All data has been written to disk
       * - File handle is released
       * - ZIP file is complete and ready to use
       *
       * This is the FINAL event indicating successful completion.
       */
      output.on('close', () => {
        // pointer() returns total bytes written by archiver
        const totalBytes = archiverInstance.pointer()
        const sizeInMB = (totalBytes / (1024 * 1024)).toFixed(2)
        const sizeInKB = (totalBytes / 1024).toFixed(2)

        console.log('\n✅ ZIP file created successfully!')
        console.log(`Path: ${this.zipFilePath}`)
        console.log(`File: releases/app-v${this.version}.zip`)
        console.log(`Size: ${sizeInMB} MB (${sizeInKB} KB)`)
        console.log(`Compressed: ${totalBytes.toLocaleString()} bytes`)
        resolve()
      })

      /**
       * Event: 'error' (on output stream)
       *
       * Handles file system errors when writing ZIP file.
       * Common causes:
       * - Disk full / insufficient space
       * - Permission denied (read-only directory)
       * - Invalid file path
       * - Disk I/O errors
       */
      output.on('error', (error) => {
        console.error('❌ Output stream error:', error.message)
        reject(error)
      })

      /**
       * Event: 'error' (on archiver instance)
       *
       * Handles errors during archive creation process.
       * Common causes:
       * - Source file not found
       * - Cannot read source file (permissions)
       * - Invalid compression settings
       * - Corrupted source files
       */
      archiverInstance.on('error', (error) => {
        console.error('❌ Archiver error:', error.message)
        reject(error)
      })

      /**
       * Event: 'warning' (on archiver instance)
       *
       * Handles non-critical warnings during archiving process.
       *
       * Strategy:
       * - ENOENT (file not found): Only logs warning, doesn't fail
       *   → Useful when optional files don't exist
       * - Other warnings: Considered critical, rejects the promise
       *   → Prevents creating incomplete archives
       */
      archiverInstance.on('warning', (warning) => {
        if (warning.code === 'ENOENT') {
          // File not found - log but don't fail
          console.warn('⚠️  Warning (file not found):', warning.message)
        } else {
          // Critical warning - fail the process
          console.error('❌ Critical archiver warning:', warning.message)
          reject(warning)
        }
      })

      /**
       * Event: 'progress' (on archiver instance)
       *
       * Provides real-time progress information during archiving.
       *
       * progress.fs.processedBytes: Bytes processed so far
       * progress.fs.totalBytes: Total bytes to process
       *
       * Uses \r (carriage return) to overwrite the same line,
       * creating a clean, updating progress bar effect.
       */
      archiverInstance.on('progress', (progress) => {
        if (progress.fs.totalBytes > 0) {
          const percent = ((progress.fs.processedBytes / progress.fs.totalBytes) * 100).toFixed(1)
          const processedMB = (progress.fs.processedBytes / (1024 * 1024)).toFixed(2)
          const totalMB = (progress.fs.totalBytes / (1024 * 1024)).toFixed(2)

          // \r overwrites current line for clean progress display
          process.stdout.write(`\r   Progress: ${percent}% (${processedMB}/${totalMB} MB)`)
        }
      })

      // ================================================================
      // PIPE - Connect archiver output to file stream
      // ================================================================
      /**
       * Pipe archiver output to file stream
       *
       * Data flow: archiver (Readable) → pipe → output (Writable) → disk
       *
       * How piping works:
       * 1. archiver generates compressed data chunks
       * 2. pipe automatically transfers chunks to output
       * 3. Handles backpressure (slows reading if writing is slow)
       * 4. Memory efficient - doesn't load entire file into RAM
       */
      archiverInstance.pipe(output)

      // ================================================================
      // ADD CONTENT - Add files/directories to the archive
      // ================================================================
      /**
       * Add entire dist/ directory to the archive
       *
       * Syntax: archive.directory(source, destInZip)
       *
       * @param this.distDir - Source directory path (e.g., /project/dist)
       * @param false - Don't create parent 'dist' folder in ZIP
       *
       * Behavior comparison:
       * - With false: dist/main.js → main.js (in ZIP root)
       * - With 'dist': dist/main.js → dist/main.js (in ZIP)
       * - With 'app': dist/main.js → app/main.js (in ZIP)
       *
       * Using false is common for distribution packages where users
       * extract directly to their desired location.
       */
      archiverInstance.directory(this.distDir, false)

      // ================================================================
      // OPTIONAL: Add additional files to ZIP
      // ================================================================

      /**
       * Add README.md if it exists
       *
       * Purpose: Helps users understand how to use the application
       * after extraction. Common in distribution packages.
       */
      const readmePath = path.join(this.rootDir, 'README.md')
      if (fs.existsSync(readmePath)) {
        archiverInstance.file(readmePath, { name: 'README.md' })
        console.log('📄 Added: README.md')
      }

      /**
       * Add LICENSE if it exists
       *
       * Purpose: Includes project license information in distribution.
       * Important for legal compliance and open source usage.
       */
      const licensePath = path.join(this.rootDir, 'LICENSE')
      if (fs.existsSync(licensePath)) {
        archiverInstance.file(licensePath, { name: 'LICENSE' })
        console.log('📄 Added: LICENSE')
      }

      // Newline before progress bar
      console.log('')

      // ================================================================
      // FINALIZE - Complete the archive and start compression
      // ================================================================
      /**
       * Finalize the archive
       *
       * This is the TRIGGER that starts the actual compression process.
       *
       * Actions performed by finalize():
       * 1. Signals "no more files will be added" (closes entry queue)
       * 2. Starts processing all queued files/directories
       * 3. Reads source files → compresses → writes to output stream
       * 4. Writes ZIP metadata (headers, central directory, etc.)
       * 5. Closes the archive when all data is written
       * 6. Triggers 'close' event on output stream when complete
       *
       * CRITICAL NOTES:
       * - Must be called AFTER all .file() and .directory() calls
       * - Cannot add more files after finalize() is called
       * - Returns a Promise in newer versions (can await)
       * - Without finalize(), ZIP file will be empty/invalid
       *
       * Timeline:
       * Before finalize(): Files are queued but not processed
       * After finalize(): Compression starts → pipe → disk write
       * After completion: 'close' event fires → Promise resolves
       */
      archiverInstance.finalize()
    })
  }

  /**
   * Reads and parses package.json file.
   *
   * Uses require() for synchronous reading and automatic JSON parsing.
   *
   * Why require() instead of fs.readFileSync()?
   * - Simpler: One line vs read + parse
   * - Automatic parsing: No need for JSON.parse()
   * - Built-in caching: Multiple calls don't re-read file
   * - Type-safe: TypeScript understands the structure
   *
   * @returns Parsed package.json content with version and name
   * @throws {Error} If package.json doesn't exist or is malformed JSON
   */
  private getPackageJson(): PackageJson {
    try {
      // Construct path to package.json in project root
      const packageJsonPath = path.join(this.rootDir, this.packageJsonFileName)

      // require() automatically:
      // - Reads the file from disk
      // - Parses JSON content
      // - Caches the result (subsequent calls don't re-read)
      // - Returns the parsed object
      const packageJsonContent: PackageJson = require(packageJsonPath)

      console.log('✅ Package JSON loaded successfully')
      console.log(`Name: ${packageJsonContent.name}`)
      console.log(`Version: ${packageJsonContent.version}\n`)
      return packageJsonContent
    } catch (error) {
      console.error('❌ Error: Cannot read package.json')
      console.error('Make sure package.json exists in project root')
      console.error(`Expected path: ${path.join(this.rootDir, this.packageJsonFileName)}`)
      throw error
    }
  }

  /**
   * Validates that dist/ directory exists and contains files.
   *
   * This is a critical pre-check before creating ZIP to ensure:
   * 1. The build output exists
   * 2. There's actual content to compress
   *
   * Exits process with code 1 if validation fails (standard error exit code).
   *
   * @throws {ProcessExit} Calls process.exit(1) if validation fails
   */
  private validateDistDirectory(): void {
    if (!fs.existsSync(this.distDir)) {
      console.error(`❌ Error: Distribution directory not found`)
      console.error(`Path: ${this.distDir}`)
      console.error(`Solution: Run "pnpm run build" first\n`)
      process.exit(1)
    }

    const files = fs.readdirSync(this.distDir)
    if (files.length === 0) {
      console.error(`❌ Error: Distribution directory is empty`)
      console.error(`Path: ${this.distDir}`)
      console.error(`Solution: Run "pnpm run build" first\n`)
      process.exit(1)
    }

    console.log('✅ Distribution directory validated')
    console.log(`Path: ${this.distDir}`)
    console.log(`Found: ${files.length} items\n`)
  }

  /**
   * Ensures releases/ directory exists, creating it if necessary.
   *
   * Uses recursive: true to create parent directories if needed.
   * This prevents errors when running the script for the first time.
   *
   * Behavior:
   * - If releases/ exists: Does nothing, just logs
   * - If releases/ missing: Creates it (and any parent dirs)
   */
  private ensureReleasesDirectory(): void {
    if (!fs.existsSync(this.releasesDir)) {
      // Create directory with recursive: true
      // This creates parent directories
      fs.mkdirSync(this.releasesDir, { recursive: true })
      console.log('📁 Created releases/ directory')
      console.log(`Path: ${this.releasesDir}\n`)
    } else {
      console.log('✅ Releases directory exists')
      console.log(`Path: ${this.releasesDir}\n`)
    }
  }

  /**
   * Cleans up old ZIP files in releases/ directory.
   *
   * Reasons for keeping old versions:
   * 1. Version comparison - Compare different builds
   * 2. Easy rollback - Revert if new version has issues
   * 3. CI/CD compatibility - Semantic-release uploads correct version
   * 4. Disk space is cheap - Storage cost < risk of data loss
   * 5. Historical reference - Track build artifacts over time
   */
  private cleanOldZipFiles(): void {
    try {
      // Find all .zip files in releases/ directory
      const oldZipFiles = fs.readdirSync(this.releasesDir).filter((file) => file.endsWith('.zip'))

      if (oldZipFiles.length > 0) {
        console.log('🗑️  Cleaning old ZIP files...')
        oldZipFiles.forEach((file) => {
          const filePath = path.join(this.releasesDir, file)
          fs.unlinkSync(filePath) // Synchronous file deletion
          console.log(`Removed: ${file}`)
        })
        console.log('')
      }
    } catch (error) {
      console.warn('⚠️  Warning: Cannot clean old ZIP files')
      console.warn(`Error: ${error instanceof Error ? error.message : error}`)
    }
  }
}

// ================================================================
// MAIN EXECUTION - Script entry point
// ================================================================
/**
 * Main execution block - only runs when file is executed directly.
 * Does NOT run when file is imported as a module.
 *
 * Pattern: require.main === module
 *
 * This evaluates to:
 * - true: When running `node scripts/create-zip.js` or `ts-node scripts/create-zip.ts`
 * - false: When using `import ZipCreator from './create-zip'` in another file
 *
 * Benefits of this pattern:
 * 1. Dual-purpose file: Can be both script and module
 * 2. Testable: Import in tests without executing main logic
 * 3. Reusable: Other scripts can import and use ZipCreator class
 * 4. Standard practice: Common pattern in Node.js ecosystem
 *
 * @example
 * $ ts-node scripts/create-zip.ts
 * $ ts-node scripts/create-zip.ts 1.2.3
 *
 * import { ZipCreator } from './scripts/create-zip'
 * const creator = new ZipCreator('2.0.0')
 * await creator.execute()
 */
if (require.main === module) {
  /**
   * Parse command line arguments
   *
   * process.argv is an array containing:
   * [0] = Node.js executable path
   *       Example: /usr/bin/node or C:\Program Files\nodejs\node.exe
   *
   * [1] = Script file path
   *       Example: /project/scripts/create-zip.js
   *
   * [2] = First user argument (our custom version)
   *       Example: "1.2.3" or undefined if not provided
   *
   * [3+] = Additional arguments (not used in this script)
   *
   * Usage examples:
   *
   * 1. Use version from package.json:
   *    $ ts-node scripts/create-zip.ts
   *    → customVersion = undefined
   *    → Uses packageJson.version
   *
   * 2. Use custom version:
   *    $ ts-node scripts/create-zip.ts 1.2.3
   *    → customVersion = "1.2.3"
   *    → Overrides packageJson.version
   *
   * 3. After TypeScript compilation:
   *    $ node dist/scripts/create-zip.js
   *    $ node dist/scripts/create-zip.js 2.0.0
   */
  const customVersion = process.argv[2]

  // Create ZipCreator instance with optional custom version
  // If customVersion is undefined, constructor uses package.json version
  const zipCreator = new ZipCreator(customVersion)

  /**
   * Execute with proper error handling
   *
   * Flow:
   * 1. zipCreator.execute() returns a Promise
   * 2. If success: Process exits with code 0 (in execute() method)
   * 3. If error: .catch() handles it and exits with code 1
   *
   * Error handling strategy:
   * - Expected errors: Caught in execute() method (e.g., missing dist/)
   * - Unexpected errors: Caught here (e.g., unhandled exceptions)
   *
   * Exit codes:
   * - 0: Success (standard Unix convention)
   * - 1: Error (standard Unix error code)
   *
   * These exit codes are important for:
   * - CI/CD pipelines (detect build failures)
   * - Shell scripts (check success with $?)
   * - Automation tools (trigger rollback on failure)
   */
  zipCreator.execute().catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
}

export { ZipCreator }
