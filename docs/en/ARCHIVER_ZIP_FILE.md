# Archiver Library - Complete Guide

## 📚 Table of Contents

1. [Introduction](#-introduction)
2. [Core Concepts](#-core-concepts)
3. [Architecture & Data Flow](#-architecture--data-flow)
4. [Components Breakdown](#-components-breakdown)
5. [API Reference](#-api-reference)
6. [Complete Code Explanation](#-complete-code-explanation)
7. [Best Practices](#-best-practices)
8. [Common Pitfalls](#️-common-pitfalls)

---

## 🎯 Introduction

**Archiver** is a Node.js library for creating archive files (ZIP, TAR, TAR.GZ, etc.) using streaming architecture.

### Key Features

- **Streaming-based**: Doesn't load entire content into memory
- **Multiple formats**: ZIP, TAR, TAR.GZ support
- **Compression**: zlib integration for optimal file size
- **Progress tracking**: Real-time compression progress
- **Memory efficient**: Can handle large files without memory issues

### Official Repository

- **GitHub**: <https://github.com/archiverjs/node-archiver>
- **NPM**: <https://www.npmjs.com/package/archiver>
- **Documentation**: <https://archiverjs.com>

---

## 🧩 Core Concepts

### 1. **Streaming Architecture**

Archiver uses Node.js streams to process data:

```text
Source Files → Archiver (Readable) → Compression → Pipe → Output (Writable) → Disk
```

**Benefits:**

- Memory efficient - processes in chunks
- Handles large files - doesn't need to load all into RAM
- Backpressure handling - automatically adjusts speed
- Real-time processing - starts writing immediately

### 2. **Three Main Components**

| Component             | Type            | Role                        | Example                           |
| --------------------- | --------------- | --------------------------- | --------------------------------- |
| **Archiver Instance** | Readable Stream | Generates compressed data   | `archiver('zip', options)`        |
| **Output Stream**     | Writable Stream | Destination for ZIP data    | `fs.createWriteStream('out.zip')` |
| **Pipe Connection**   | Stream Pipe     | Connects archiver to output | `archive.pipe(output)`            |

### 3. **Event-Driven Model**

Archiver uses events to communicate state:

- `'progress'` - Compression progress updates
- `'warning'` - Non-critical issues
- `'error'` - Critical errors
- `'close'` - Archive complete (on output stream)

---

## 🏗 Architecture & Data Flow

### Complete Data Flow

````text
┌─────────────────────────────────────────────────────────────┐
│                    ARCHIVER DATA FLOW                       │
└─────────────────────────────────────────────────────────────┘

Step 1: INITIALIZATION
├── Create Output Stream (Writable)
│   └── const output = fs.createWriteStream('archive.zip')
│
├── Create Archiver Instance (Readable)
│   └── const archive = archiver('zip', { zlib: { level: 9 } })
│
└── Setup Event Listeners
    ├── output.on('close', ...)
    ├── archive.on('error', ...)
    └── archive.on('progress', ...)

Step 2: CONNECTION
├── Connect streams via pipe
│   └── archive.pipe(output)
│
└── Data flow established: archive → pipe → output

Step 3: QUEUE FILES
├── archive.file('file1.txt', { name: 'file1.txt' })
├── archive.directory('src/', false)
└── archive.append(buffer, { name: 'config.json' })
    └── Files are QUEUED, not processed yet

Step 4: FINALIZE (TRIGGER COMPRESSION)
├── archive.finalize()
│
└── Processing starts:
    ├── Read file 1 → compress → write chunk → pipe → output
    ├── Read file 2 → compress → write chunk → pipe → output
    └── ... (continues for all files)

Step 5: COMPRESSION LOOP
For each file in queue:
┌─────────────────────────────────────────────┐
│ 1. Read file from disk (fs.createReadStream)│
│ 2. Pass through zlib compression           │
│ 3. Generate ZIP headers/metadata            │
│ 4. Write compressed chunks to archive       │
│ 5. Archive pushes chunks via pipe           │
│ 6. Output stream writes to disk             │
│ 7. Emit 'progress' event                    │
└─────────────────────────────────────────────┘

Step 6: FINALIZATION
├── Write ZIP central directory (metadata)
├── Write ZIP end of central directory record
├── Archive signals "no more data"
├── Output stream closes
└── Emit 'close' event → Promise resolves

┌─────────────────────────────────────────────┐
│          MEMORY USAGE (STREAMING)           │
├─────────────────────────────────────────────┤
│  Traditional:  [======== 100% ========]     │
│                Load entire file into RAM    │
│                                             │
│  Streaming:    [==]                         │
│                Only current chunk in RAM    │
│                (e.g., 64KB buffer)          │
└─────────────────────────────────────────────┘
```text

### Internal Mechanism

When you call `archive.finalize()`, archiver:

1. **Closes the queue** - No more files can be added
2. **Starts processing** - Reads files one by one
3. **Compresses data** - Uses zlib (deflate algorithm)
4. **Writes chunks** - Streams compressed data
5. **Adds metadata** - ZIP headers, file list, checksums
6. **Finalizes ZIP** - Central directory, end record
7. **Closes stream** - Signals completion

---

## 🧩 Components Breakdown

### 1. Output Stream (`fs.createWriteStream`)

**Purpose**: The destination where ZIP data is written.

```typescript
const output = fs.createWriteStream('archive.zip')
````

**What it does:**

- Opens file handle for writing
- Receives data chunks from pipe
- Writes chunks to disk
- Handles file system operations
- Emits events when done

**Key Events:**

- `'close'` - File completely written and closed
- `'error'` - File system error (disk full, permissions, etc.)
- `'finish'` - All data written (before close)

**Common Issues:**

```typescript
// ❌ BAD: Path doesn't exist
const output = fs.createWriteStream('/nonexistent/path/file.zip')
// Error: ENOENT: no such file or directory

// ✅ GOOD: Ensure directory exists
const dir = path.dirname(zipPath)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}
const output = fs.createWriteStream(zipPath)
```

---

### 2. Archiver Instance

**Purpose**: The "engine" that generates compressed ZIP data.

```typescript
const archive = archiver('zip', {
  zlib: { level: 9 }, // Maximum compression
})
```

**Available Formats:**

- `'zip'` - ZIP format (most common)
- `'tar'` - TAR format (no compression)
- `'tar'` + gzip option - TAR.GZ format

**Compression Levels (zlib):**

```typescript
{
  level: 0
} // No compression (store only) - Fast, large file
{
  level: 1
} // Minimal compression - Very fast, large file
{
  level: 5
} // Balanced (default) - Good speed & size
{
  level: 9
} // Maximum compression - Slow, small file
```

**Key Methods:**

#### `archive.file(filepath, options)`

Add a single file:

```typescript
archive.file('src/app.js', {
  name: 'app.js', // Name in ZIP
  date: new Date('2024-01-01'), // Custom date
})
```

#### `archive.directory(dirpath, destpath)`

Add entire directory:

```typescript
// Add dist/ contents to ZIP root
archive.directory('dist/', false)

// Add dist/ contents to 'app/' folder in ZIP
archive.directory('dist/', 'app')
```

Result comparison:

```text
With false:       dist/main.js → main.js (in ZIP)
With 'app':       dist/main.js → app/main.js (in ZIP)
With 'dist':      dist/main.js → dist/main.js (in ZIP)
```

#### `archive.append(source, options)`

Add content from buffer/stream/string:

```typescript
// From string
archive.append('Hello World', { name: 'greeting.txt' })

// From buffer
const buffer = Buffer.from('Binary data')
archive.append(buffer, { name: 'data.bin' })

// From stream
const stream = fs.createReadStream('large-file.txt')
archive.append(stream, { name: 'large-file.txt' })
```

#### `archive.glob(pattern, options)`

Add files matching glob pattern:

```typescript
// Add all JavaScript files
archive.glob('**/*.js', {
  cwd: 'src/',
  ignore: ['**/*.test.js'],
})
```

#### `archive.pointer()`

Get total bytes written:

```typescript
const bytes = archive.pointer()
console.log(`${bytes} bytes written`)
console.log(`${(bytes / 1024 / 1024).toFixed(2)} MB`)
```

#### `archive.finalize()`

Start compression (CRITICAL):

```typescript
await archive.finalize()
// Returns Promise in newer versions
```

**What finalize() does:**

1. Closes file queue
2. Processes all queued files
3. Compresses data
4. Writes ZIP structure
5. Emits 'end' event
6. Closes archive

---

### 3. Pipe Connection

**Purpose**: Connects archiver output to destination.

```typescript
archive.pipe(output)
```

**How piping works:**

```text
┌─────────────────────────────────────────────────────────┐
│                    PIPE MECHANISM                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Archiver (Readable)           Output (Writable)       │
│        │                              │                 │
│        │    1. write(chunk1)         │                 │
│        ├─────────────────────────────→│                │
│        │    2. write(chunk2)         │                 │
│        ├─────────────────────────────→│                │
│        │                              │                 │
│        │    3. Output buffer full    │                 │
│        │    (backpressure)           │                 │
│        │←─────────────────────────────┤                │
│        │    4. PAUSE reading          │                 │
│        │                              │                 │
│        │    5. Buffer drained         │                 │
│        │←─────────────────────────────┤                │
│        │    6. RESUME reading         │                 │
│        │                              │                 │
│        │    7. write(chunk3)         │                 │
│        ├─────────────────────────────→│                │
│        │                              │                 │
└─────────────────────────────────────────────────────────┘
```

**Benefits of piping:**

- **Automatic flow control**: Pauses when output is slow
- **Backpressure handling**: Prevents memory overflow
- **Memory efficient**: Only small buffers in memory
- **Error propagation**: Errors bubble up properly

**Without piping (manual approach):**

```typescript
// ❌ BAD: Manual approach (don't do this)
archive.on('data', (chunk) => {
  output.write(chunk)
})
archive.on('end', () => {
  output.end()
})
// Issues: No backpressure, memory leaks, complexity

// ✅ GOOD: Use pipe (automatic)
archive.pipe(output)
```

---

## 📖 API Reference

### Constructor Options

```typescript
const archive = archiver(format, options)
```

#### ZIP Format Options

```typescript
{
  // Compression settings
  zlib: {
    level: 9,              // 0-9, higher = more compression
    memLevel: 8,           // Memory usage (1-9)
    strategy: 0            // Compression strategy
  },

  // ZIP-specific options
  comment: 'Archive created by MyApp',  // ZIP comment
  forceLocalTime: true,                  // Use local time instead of UTC
  forceZip64: false,                     // Force ZIP64 format (for >4GB)
  store: false,                          // Store only (no compression)

  // Advanced
  statConcurrency: 4     // Parallel stat() calls (default: 4)
}
```

#### TAR Format Options

```typescript
{
  gzip: true,            // Create TAR.GZ
  gzipOptions: {
    level: 9
  }
}
```

---

### Events Reference

#### Progress Event

```typescript
archive.on('progress', (progressData) => {
  console.log(`Entries: ${progressData.entries.processed}/${progressData.entries.total}`)
  console.log(`Bytes: ${progressData.fs.processedBytes}/${progressData.fs.totalBytes}`)
})
```

**progressData structure:**

```typescript
{
  entries: {
    total: 10,         // Total number of entries
    processed: 5       // Entries processed so far
  },
  fs: {
    totalBytes: 1024000,      // Total bytes to process
    processedBytes: 512000    // Bytes processed so far
  }
}
```

#### Warning Event

```typescript
archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    // File not found - non-critical
    console.warn('File not found:', err.message)
  } else {
    // Other warning - might be critical
    throw err
  }
})
```

**Common warning codes:**

- `ENOENT` - File not found
- `EACCES` - Permission denied
- `ESTAT` - Cannot stat file

#### Error Event

```typescript
archive.on('error', (err) => {
  console.error('Archive error:', err)
  // Handle error (reject Promise, exit process, etc.)
})
```

**Common errors:**

- Source file not found
- Cannot read source file
- Invalid compression settings
- Archive already finalized

---

## 💻 Complete Code Explanation

Now let's analyze the `create-zip.script.ts` file section by section:

### Part 1: Imports and Interface

```typescript
import path from 'path'
import fs from 'fs'
import archiver from 'archiver'

interface PackageJson {
  version: string
  name: string
  [key: string]: unknown
}
```

**Explanation:**

- `path`: Node.js module for file path operations
- `fs`: Node.js file system module
- `archiver`: The ZIP creation library
- `PackageJson`: TypeScript interface defining package.json structure

---

### Part 2: Class Constructor

```typescript
constructor(customVersion?: string) {
  this.rootDir = path.join(__dirname, '..');
  this.distDir = path.join(this.rootDir, 'dist');
  this.releasesDir = path.join(this.rootDir, 'releases');

  const packageJSON = this.getPackageJson();
  this.version = customVersion || packageJSON.version;
  this.zipFilePath = path.join(this.releasesDir, `app-v${this.version}.zip`);
}
```

**Path Resolution:**

```text
__dirname = /project/scripts
rootDir = /project
distDir = /project/dist
releasesDir = /project/releases
zipFilePath = /project/releases/app-v1.2.3.zip
```

**Version Logic:**

- If `customVersion` provided: Use it
- Otherwise: Read from `package.json`

---

### Part 3: Main Execution Method

```typescript
public async execute(): Promise<void> {
  try {
    this.validateDistDirectory();        // Step 1: Check dist/
    this.ensureReleasesDirectory();      // Step 2: Create releases/
    await this.createZip();              // Step 3: Create ZIP
    process.exit(0);                     // Success
  } catch (error) {
    console.error(error);
    process.exit(1);                     // Failure
  }
}
```

**Flow:**

1. Validate source exists
2. Ensure destination exists
3. Create ZIP file
4. Exit with appropriate code

---

### Part 4: Creating the ZIP (Core Logic)

```typescript
private async createZip(): Promise<void> {
  // 1. Create output stream (destination)
  const output = fs.createWriteStream(this.zipFilePath);

  // 2. Create archiver instance (compression engine)
  const archiverInstance = archiver('zip', {
    zlib: { level: this.archiverZipLevel }
  });

  return new Promise((resolve, reject) => {
    // 3. Setup event handlers
    output.on('close', () => {
      // Archive complete!
      console.log('✅ ZIP created:', archiverInstance.pointer(), 'bytes');
      resolve();
    });

    output.on('error', reject);
    archiverInstance.on('error', reject);
    archiverInstance.on('warning', (warn) => {
      if (warn.code !== 'ENOENT') reject(warn);
    });

    archiverInstance.on('progress', (progress) => {
      // Show progress
      const percent = (progress.fs.processedBytes / progress.fs.totalBytes) * 100;
      process.stdout.write(`\rProgress: ${percent.toFixed(1)}%`);
    });

    // 4. Connect streams
    archiverInstance.pipe(output);

    // 5. Add content
    archiverInstance.directory(this.distDir, false);

    // Optional: Add extra files
    if (fs.existsSync('README.md')) {
      archiverInstance.file('README.md', { name: 'README.md' });
    }

    // 6. Start compression
    archiverInstance.finalize();
  });
}
```

**Step-by-step explanation:**

#### Step 1: Create Output Stream

```typescript
const output = fs.createWriteStream(this.zipFilePath)
```

- Opens file for writing
- Returns Writable stream
- Data written here goes to disk

#### Step 2: Create Archiver

```typescript
const archiverInstance = archiver('zip', {
  zlib: { level: 9 },
})
```

- Creates compression engine
- Returns Readable stream
- Level 9 = maximum compression

#### Step 3: Setup Events

```typescript
output.on('close', () => resolve())
```

- **Why 'close' on output, not archiver?**
  - `archiver` emits 'end' when it's done generating data
  - `output` emits 'close' when file is actually written to disk
  - We want to ensure file is on disk before reporting success

#### Step 4: Connect Streams

```typescript
archiverInstance.pipe(output)
```

- Data flow: `archiver → pipe → output → disk`
- Automatic backpressure handling
- Memory efficient

#### Step 5: Add Content

```typescript
archiverInstance.directory(this.distDir, false)
```

- `false` means: don't create 'dist' folder in ZIP
- Contents of dist/ go to ZIP root

#### Step 6: Finalize

```typescript
archiverInstance.finalize()
```

- Closes queue
- Starts compression
- Returns Promise

---

### Part 5: Helper Methods

#### Get Package.json

```typescript
private getPackageJson(): PackageJson {
  const packageJsonPath = path.join(this.rootDir, 'package.json');
  const packageJsonContent: PackageJson = require(packageJsonPath);
  return packageJsonContent;
}
```

**Why `require()` instead of `fs.readFileSync()`?**

```typescript
// ❌ Longer approach
const content = fs.readFileSync('package.json', 'utf-8')
const json = JSON.parse(content)

// ✅ Simpler
const json = require('./package.json')
```

**Benefits:**

- Automatic parsing
- Built-in caching
- Simpler syntax

---

#### Validate Distribution Directory

```typescript
private validateDistDirectory(): void {
  if (!fs.existsSync(this.distDir)) {
    console.error('❌ Error: dist/ not found');
    process.exit(1);
  }

  const files = fs.readdirSync(this.distDir);
  if (files.length === 0) {
    console.error('❌ Error: dist/ is empty');
    process.exit(1);
  }
}
```

**Checks:**

1. Directory exists
2. Directory not empty

**Why exit(1)?**

- Standard Unix error code
- CI/CD systems detect failure
- Prevents creating empty ZIP

---

#### Ensure Releases Directory

```typescript
private ensureReleasesDirectory(): void {
  if (!fs.existsSync(this.releasesDir)) {
    fs.mkdirSync(this.releasesDir, { recursive: true });
  }
}
```

**recursive: true** means:

- Creates parent directories if needed
- Like `mkdir -p` in Unix
- Won't error if already exists

---

### Part 6: Entry Point

```typescript
if (require.main === module) {
  const customVersion = process.argv[2]
  const zipCreator = new ZipCreator(customVersion)
  zipCreator.execute().catch((error) => {
    console.error('💥 Fatal error:', error)
    process.exit(1)
  })
}

export { ZipCreator }
```

**require.main === module:**

- `true`: File run directly (`node create-zip.js`)
- `false`: File imported (`import { ZipCreator }`)

**process.argv:**

```bash
$ ts-node create-zip.ts 1.2.3

process.argv = [
  '/usr/bin/node',           // [0] Node executable
  '/project/create-zip.ts',  // [1] Script path
  '1.2.3'                    // [2] First argument
]
```

---

## ✅ Best Practices

### 1. Always Setup Event Listeners Before Finalize

```typescript
// ✅ GOOD
archive.on('error', reject);
archive.on('warning', ...);
archive.pipe(output);
archive.directory(...);
archive.finalize();

// ❌ BAD
archive.finalize();
archive.on('error', reject);  // Might miss errors!
```

### 2. Use 'close' Event for Completion

```typescript
// ✅ GOOD: Wait for output to close
output.on('close', () => {
  console.log('File written to disk')
})

// ❌ BAD: 'end' fires too early
archive.on('end', () => {
  console.log('Data generated but might not be on disk yet')
})
```

### 3. Handle Both Error Events

```typescript
// ✅ GOOD: Handle both
output.on('error', handleError)
archive.on('error', handleError)

// ❌ BAD: Only handle one
archive.on('error', handleError)
// Output errors will crash the process
```

### 4. Use Streaming for Large Files

```typescript
// ✅ GOOD: Stream large files
const stream = fs.createReadStream('large.txt')
archive.append(stream, { name: 'large.txt' })

// ❌ BAD: Load into memory
const buffer = fs.readFileSync('large.txt')
archive.append(buffer, { name: 'large.txt' })
// Might cause out-of-memory error
```

### 5. Choose Appropriate Compression Level

```typescript
// Fast compression (CI builds)
{
  zlib: {
    level: 1
  }
} // Fast, larger file

// Balanced (default)
{
  zlib: {
    level: 5
  }
} // Good compromise

// Maximum compression (releases)
{
  zlib: {
    level: 9
  }
} // Slow, smallest file
```

---

## ⚠️ Common Pitfalls

### 1. Forgetting to Call finalize()

```typescript
// ❌ BAD
archive.directory('dist/', false)
// ZIP will be empty!

// ✅ GOOD
archive.directory('dist/', false)
archive.finalize()
```

### 2. Adding Files After finalize()

```typescript
// ❌ BAD
archive.finalize()
archive.file('extra.txt') // ERROR: already finalizing

// ✅ GOOD
archive.file('extra.txt')
archive.finalize()
```

### 3. Not Handling Warnings Properly

```typescript
// ❌ BAD: Ignores all warnings
archive.on('warning', () => {})

// ✅ GOOD: Handle ENOENT but reject others
archive.on('warning', (warn) => {
  if (warn.code === 'ENOENT') {
    console.warn('Optional file not found')
  } else {
    throw warn
  }
})
```

### 4. Not Waiting for 'close' Event

```typescript
// ❌ BAD
archive.finalize()
console.log('Done!') // Too early!

// ✅ GOOD
output.on('close', () => {
  console.log('Done!')
})
archive.finalize()
```

### 5. Incorrect Directory Mapping

```typescript
// Creates 'dist' folder in ZIP
archive.directory('dist/', 'dist')
// Result: dist/main.js → dist/main.js

// Puts contents in ZIP root
archive.directory('dist/', false)
// Result: dist/main.js → main.js ✅
```

---

## 🎓 Summary

### Key Takeaways

1. **Archiver** = Compression engine (Readable stream)
2. **Output** = File destination (Writable stream)
3. **Pipe** = Connects them together
4. **finalize()** = Starts the compression
5. **'close' event** = Compression complete

### Execution Order

```text
1. Create output stream
2. Create archiver instance
3. Setup event listeners
4. Pipe archiver to output
5. Add files/directories
6. Call finalize()
7. Wait for 'close' event
8. Done!
```

### Memory Model

```text
Traditional:  Load entire archive into RAM → Write
Streaming:    Read chunk → Compress → Write → Repeat
```

### Data Flow

```text
dist/
  ├─ main.js (1MB)
  └─ app.js (2MB)
         ↓
    [Archiver]
         ↓
   [Compression]
         ↓
    [ZIP format]
         ↓
      [Pipe]
         ↓
    [Output stream]
         ↓
   archive.zip (1.5MB compressed)
```

---

## 📚 Additional Resources

- **Official Docs**: <https://archiverjs.com>
- **GitHub**: <https://github.com/archiverjs/node-archiver>
- **Node.js Streams**: <https://nodejs.org/api/stream.html>
- **zlib Compression**: <https://nodejs.org/api/zlib.html>

---

**Document Version**: 1.0.0  
**Last Updated**: 2025-01-25
