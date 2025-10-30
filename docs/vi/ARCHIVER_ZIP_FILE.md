# Thư viện Archiver - Hướng dẫn Chi tiết

## 📚 Mục lục

1. [Giới thiệu](#-giới-thiệu)
2. [Khái niệm Cốt lõi](#-khái-niệm-cốt-lõi)
3. [Kiến trúc và Luồng Dữ liệu](#-kiến-trúc-và-luồng-dữ-liệu)
4. [Phân tích Thành phần](#-phân-tích-thành-phần)
5. [Tài liệu API](#-tài-liệu-api)
6. [Giải thích Code Chi tiết](#-giải-thích-code-chi-tiết---create-zipscriptts)
7. [Best Practices](#-best-practices)
8. [Lỗi Thường gặp](#️-lỗi-thường-gặp)

---

## 🎯 Giới thiệu

**Archiver** là thư viện Node.js để tạo file nén (ZIP, TAR, TAR.GZ, v.v.) sử dụng kiến trúc streaming.

### Tính năng Chính

- **Dựa trên streaming**: Không tải toàn bộ nội dung vào bộ nhớ
- **Nhiều định dạng**: Hỗ trợ ZIP, TAR, TAR.GZ
- **Nén**: Tích hợp zlib để tối ưu kích thước file
- **Theo dõi tiến độ**: Tiến độ nén real-time
- **Hiệu quả bộ nhớ**: Xử lý file lớn mà không tràn RAM

### Repository Chính thức

- GitHub: <https://github.com/archiverjs/node-archiver>
- NPM: <https://www.npmjs.com/package/archiver>
- Documentation: <https://archiverjs.com>

---

## 🧩 Khái niệm Cốt lõi

### 1. **Kiến trúc Streaming**

Archiver sử dụng Node.js streams để xử lý dữ liệu:

```text
File nguồn → Archiver (Readable) → Nén → Pipe → Output (Writable) → Ổ đĩa
```

**Lợi ích:**

- Hiệu quả bộ nhớ - xử lý từng chunk
- Xử lý file lớn - không cần load hết vào RAM
- Xử lý backpressure - tự động điều chỉnh tốc độ
- Xử lý real-time - bắt đầu ghi ngay lập tức

### 2. **Ba Thành phần Chính**

| Thành phần            | Loại            | Vai trò                     | Ví dụ                             |
| --------------------- | --------------- | --------------------------- | --------------------------------- |
| **Archiver Instance** | Readable Stream | Tạo dữ liệu nén             | `archiver('zip', options)`        |
| **Output Stream**     | Writable Stream | Đích đến cho dữ liệu ZIP    | `fs.createWriteStream('out.zip')` |
| **Pipe Connection**   | Stream Pipe     | Kết nối archiver với output | `archive.pipe(output)`            |

### 3. **Mô hình Event-Driven**

Archiver sử dụng events để giao tiếp trạng thái:

- `'progress'` - Cập nhật tiến độ nén
- `'warning'` - Vấn đề không nghiêm trọng
- `'error'` - Lỗi nghiêm trọng
- `'close'` - Nén hoàn tất (trên output stream)

---

## 🏗 Kiến trúc và Luồng Dữ liệu

### Luồng Dữ liệu Hoàn chỉnh

```text
┌─────────────────────────────────────────────────────────────┐
│                 LUỒNG DỮ LIỆU ARCHIVER                      │
└─────────────────────────────────────────────────────────────┘

Bước 1: KHỞI TẠO
├── Tạo Output Stream (Writable)
│   └── const output = fs.createWriteStream('archive.zip')
│
├── Tạo Archiver Instance (Readable)
│   └── const archive = archiver('zip', { zlib: { level: 9 } })
│
└── Thiết lập Event Listeners
    ├── output.on('close', ...)
    ├── archive.on('error', ...)
    └── archive.on('progress', ...)

Bước 2: KẾT NỐI
├── Kết nối streams qua pipe
│   └── archive.pipe(output)
│
└── Luồng dữ liệu được thiết lập: archive → pipe → output

Bước 3: XẾP HÀNG FILE
├── archive.file('file1.txt', { name: 'file1.txt' })
├── archive.directory('src/', false)
└── archive.append(buffer, { name: 'config.json' })
    └── File được XẾP HÀNG, chưa xử lý

Bước 4: FINALIZE (KÍCH HOẠT NÉN)
├── archive.finalize()
│
└── Bắt đầu xử lý:
    ├── Đọc file 1 → nén → ghi chunk → pipe → output
    ├── Đọc file 2 → nén → ghi chunk → pipe → output
    └── ... (tiếp tục cho tất cả file)

Bước 5: VÒNG LẶP NÉN
Với mỗi file trong hàng đợi:
┌─────────────────────────────────────────────┐
│ 1. Đọc file từ ổ đĩa (fs.createReadStream) │
│ 2. Qua nén zlib                            │
│ 3. Tạo ZIP headers/metadata                │
│ 4. Ghi chunks nén vào archive              │
│ 5. Archive đẩy chunks qua pipe             │
│ 6. Output stream ghi vào ổ đĩa            │
│ 7. Phát sự kiện 'progress'                │
└─────────────────────────────────────────────┘

Bước 6: HOÀN TẤT
├── Ghi ZIP central directory (metadata)
├── Ghi ZIP end of central directory record
├── Archive báo hiệu "không còn dữ liệu"
├── Output stream đóng
└── Phát sự kiện 'close' → Promise resolve

┌─────────────────────────────────────────────┐
│       SỬ DỤNG BỘ NHỚ (STREAMING)           │
├─────────────────────────────────────────────┤
│  Truyền thống:  [======== 100% ========]    │
│                 Load toàn bộ file vào RAM   │
│                                             │
│  Streaming:     [==]                        │
│                 Chỉ chunk hiện tại trong RAM│
│                 (ví dụ: buffer 64KB)       │
└─────────────────────────────────────────────┘
```

---

## � Phân tích Thành phần

Để hiểu rõ cách Archiver hoạt động, chúng ta cần phân tích từng thành phần chính.

### 1. Output Stream (`fs.createWriteStream`)

**Mục đích**: Đích đến nơi dữ liệu ZIP được ghi.

```typescript
const output = fs.createWriteStream('archive.zip')
```

**Chức năng:**

- Mở handle file để ghi
- Nhận các chunk dữ liệu từ pipe
- Ghi chunks vào đĩa
- Xử lý các thao tác file system
- Phát sự kiện khi hoàn thành

**Sự kiện Quan trọng:**

- `'close'` - File được ghi hoàn toàn và đóng
- `'error'` - Lỗi file system (đĩa đầy, quyền truy cập, v.v.)
- `'finish'` - Tất cả dữ liệu đã được ghi (trước close)

**Các Vấn đề Thường gặp:**

```typescript
// ❌ SAI: Đường dẫn không tồn tại
const output = fs.createWriteStream('/nonexistent/path/file.zip')
// Lỗi: ENOENT: no such file or directory

// ✅ ĐÚNG: Đảm bảo thư mục tồn tại
const dir = path.dirname(zipPath)
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true })
}
const output = fs.createWriteStream(zipPath)
```

---

### 2. Archiver Instance

**Mục đích**: "Engine" tạo ra dữ liệu ZIP đã nén.

```typescript
const archive = archiver('zip', {
  zlib: { level: 9 }, // Nén tối đa
})
```

**Các Format Có sẵn:**

- `'zip'` - Format ZIP (phổ biến nhất)
- `'tar'` - Format TAR (không nén)
- `'tar'` + gzip option - Format TAR.GZ

**Mức Nén (zlib):**

```typescript
{
  level: 0
} // Không nén (chỉ lưu trữ) - Nhanh, file lớn
{
  level: 1
} // Nén tối thiểu - Rất nhanh, file lớn
{
  level: 5
} // Cân bằng (mặc định) - Tốc độ & kích thước hợp lý
{
  level: 9
} // Nén tối đa - Chậm, file nhỏ
```

---

### 3. Pipe Connection

**Mục đích**: Kết nối output của archiver với đích đến.

```typescript
archive.pipe(output)
```

**Cách hoạt động của piping:**

```text
┌─────────────────────────────────────────────────────────┐
│                    CƠ CHẾ PIPE                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Archiver (Readable)           Output (Writable)       │
│        │                              │                 │
│        │    1. write(chunk1)         │                 │
│        ├─────────────────────────────→│                │
│        │    2. write(chunk2)         │                 │
│        ├─────────────────────────────→│                │
│        │                              │                 │
│        │    3. Buffer output đầy     │                 │
│        │    (backpressure)           │                 │
│        │←─────────────────────────────┤                │
│        │    4. TẠM DỪNG đọc          │                 │
│        │                              │                 │
│        │    5. Buffer được xả        │                 │
│        │←─────────────────────────────┤                │
│        │    6. TIẾP TỤC đọc          │                 │
│        │                              │                 │
│        │    7. write(chunk3)         │                 │
│        ├─────────────────────────────→│                │
│        │                              │                 │
└─────────────────────────────────────────────────────────┘
```

**Lợi ích của piping:**

- **Điều khiển luồng tự động**: Tạm dừng khi output chậm
- **Xử lý backpressure**: Ngăn overflow bộ nhớ
- **Hiệu quả bộ nhớ**: Chỉ buffer nhỏ trong RAM
- **Lan truyền lỗi**: Lỗi được bubble up đúng cách

---

## 📖 Tài liệu API

### Constructor Options

```typescript
const archive = archiver(format, options)
```

#### Tùy chọn ZIP Format

```typescript
{
  // Cài đặt nén
  zlib: {
    level: 9,              // 0-9, cao hơn = nén nhiều hơn
    memLevel: 8,           // Sử dụng bộ nhớ (1-9)
    strategy: 0            // Chiến lược nén
  },

  // Tùy chọn riêng ZIP
  comment: 'Archive được tạo bởi MyApp',  // Comment ZIP
  forceLocalTime: true,                   // Dùng thời gian local thay UTC
  forceZip64: false,                      // Force format ZIP64 (cho >4GB)
  store: false,                           // Chỉ lưu trữ (không nén)

  // Nâng cao
  statConcurrency: 4     // Parallel stat() calls (mặc định: 4)
}
```

---

## �💻 Giải thích Code Chi tiết - create-zip.script.ts

Dưới đây là phân tích chi tiết từng phần của file TypeScript:

### ⭐ PHẦN 1: Constructor - Khởi tạo

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

**Giải thích:**

1. **Xác định đường dẫn thư mục:**
   - `__dirname` = `/project/scripts` (vị trí file script)
   - `rootDir` = `/project` (thư mục gốc dự án)
   - `distDir` = `/project/dist` (thư mục build output)
   - `releasesDir` = `/project/releases` (thư mục chứa ZIP)

2. **Lấy version:**
   - Nếu có `customVersion` từ CLI → dùng nó
   - Nếu không → đọc từ `package.json`

3. **Tạo đường dẫn ZIP:**
   - Format: `app-v{version}.zip`
   - Ví dụ: `app-v1.2.3.zip`

---

### ⭐ PHẦN 2: execute() - Điều phối toàn bộ quy trình

```typescript
public async execute(): Promise<void> {
  try {
    this.validateDistDirectory();        // Bước 1
    this.ensureReleasesDirectory();      // Bước 2
    await this.createZip();              // Bước 3
    process.exit(0);                     // Thành công
  } catch (error) {
    console.error(error);
    process.exit(1);                     // Thất bại
  }
}
```

**Quy trình 3 bước:**

1. **Validate** - Kiểm tra `dist/` tồn tại và có nội dung
2. **Ensure** - Đảm bảo `releases/` tồn tại (tạo nếu cần)
3. **Create** - Tạo file ZIP

**Exit codes:**

- `0` = Thành công (chuẩn Unix)
- `1` = Lỗi (chuẩn Unix)

---

### ⭐ PHẦN 3: createZip() - Logic nén file (CỐT LÕI)

```typescript
private async createZip(): Promise<void> {
  // 1. TẠO OUTPUT STREAM
  const output = fs.createWriteStream(this.zipFilePath);

  // 2. TẠO ARCHIVER INSTANCE
  const archiverInstance = archiver('zip', {
    zlib: { level: 9 }  // Nén tối đa
  });

  return new Promise((resolve, reject) => {
    // 3. THIẾT LẬP EVENT HANDLERS

    // 3a. Sự kiện 'close' trên OUTPUT
    output.on('close', () => {
      const totalBytes = archiverInstance.pointer();
      console.log('✅ ZIP hoàn tất:', totalBytes, 'bytes');
      resolve();
    });

    // 3b. Sự kiện 'error' trên OUTPUT
    output.on('error', (error) => {
      console.error('❌ Lỗi output stream:', error);
      reject(error);
    });

    // 3c. Sự kiện 'error' trên ARCHIVER
    archiverInstance.on('error', (error) => {
      console.error('❌ Lỗi archiver:', error);
      reject(error);
    });

    // 3d. Sự kiện 'warning' trên ARCHIVER
    archiverInstance.on('warning', (warning) => {
      if (warning.code === 'ENOENT') {
        console.warn('⚠️ File không tìm thấy:', warning.message);
      } else {
        reject(warning);
      }
    });

    // 3e. Sự kiện 'progress' trên ARCHIVER
    archiverInstance.on('progress', (progress) => {
      const percent = (progress.fs.processedBytes / progress.fs.totalBytes) * 100;
      process.stdout.write(`\rTiến độ: ${percent.toFixed(1)}%`);
    });

    // 4. KẾT NỐI STREAMS QUA PIPE
    archiverInstance.pipe(output);

    // 5. THÊM NỘI DUNG VÀO ARCHIVE
    archiverInstance.directory(this.distDir, false);

    // Thêm file tùy chọn
    if (fs.existsSync('README.md')) {
      archiverInstance.file('README.md', { name: 'README.md' });
    }

    // 6. BẮT ĐẦU NÉN
    archiverInstance.finalize();
  });
}
```

**Giải thích Chi tiết:**

#### Bước 1: Tạo Output Stream

```typescript
const output = fs.createWriteStream(this.zipFilePath)
```

- **Là gì?** Writable Stream - nơi dữ liệu ZIP được ghi vào
- **Làm gì?** Mở file handle, nhận chunks, ghi vào đĩa
- **Vai trò:** ĐÍ CH ĐẾN cuối cùng của dữ liệu nén

#### Bước 2: Tạo Archiver Instance

```typescript
const archiverInstance = archiver('zip', {
  zlib: { level: 9 },
})
```

- **Là gì?** Readable Stream - engine tạo dữ liệu nén
- **Làm gì?** Đọc file, nén, tạo ZIP format
- **Vai trò:** NGUỒN dữ liệu nén

**Mức nén zlib:**

```typescript
level: 0 // Không nén - Nhanh nhất, file lớn nhất
level: 1 // Nén tối thiểu - Rất nhanh, file lớn
level: 5 // Cân bằng (mặc định) - Tốc độ & kích thước vừa
level: 9 // Nén tối đa - Chậm nhất, file nhỏ nhất
```

#### Bước 3: Thiết lập Events

##### 3a. Event 'close' trên OUTPUT

```typescript
output.on('close', () => {
  resolve() // Hoàn tất Promise
})
```

**Tại sao 'close' chứ không phải 'end'?**

```text
Timeline:
1. archiver.finalize() → bắt đầu nén
2. archiver gửi chunks qua pipe
3. output nhận chunks và ghi
4. archiver phát 'end' → hết dữ liệu
5. output tiếp tục ghi chunks còn lại
6. output phát 'close' → file hoàn tất trên đĩa ✅
```

**Kết luận:** `'close'` đảm bảo file thực sự đã trên đĩa!

##### 3b-3c. Events 'error'

```typescript
output.on('error', reject) // Lỗi ghi file
archiverInstance.on('error', reject) // Lỗi nén
```

**Lỗi output thường gặp:**

- Đĩa đầy (ENOSPC)
- Quyền bị từ chối (EACCES)
- Đường dẫn không hợp lệ

**Lỗi archiver thường gặp:**

- File nguồn không tồn tại
- Không thể đọc file nguồn
- Thiết lập nén không hợp lệ

##### 3d. Event 'warning'

```typescript
archiverInstance.on('warning', (warning) => {
  if (warning.code === 'ENOENT') {
    // File không tìm thấy - không nghiêm trọng
    console.warn('⚠️ File không tìm thấy')
  } else {
    // Cảnh báo khác - nghiêm trọng
    reject(warning)
  }
})
```

**Chiến lược xử lý:**

- `ENOENT` (file không tìm thấy) → Log cảnh báo, tiếp tục
- Cảnh báo khác → Coi là lỗi nghiêm trọng, reject Promise

##### 3e. Event 'progress'

```typescript
archiverInstance.on('progress', (progress) => {
  const percent = (progress.fs.processedBytes / progress.fs.totalBytes) * 100
  process.stdout.write(`\rTiến độ: ${percent.toFixed(1)}%`)
})
```

**Cấu trúc progressData:**

```typescript
{
  entries: {
    total: 10,        // Tổng số entries
    processed: 5      // Đã xử lý
  },
  fs: {
    totalBytes: 1024000,      // Tổng bytes
    processedBytes: 512000    // Đã xử lý
  }
}
```

**Kỹ thuật `\r`:**

```text
\r = Carriage return = Về đầu dòng
→ Ghi đè lên dòng hiện tại
→ Tạo hiệu ứng progress bar cập nhật liên tục

Output:
Tiến độ: 25.3%    (ghi đè)
Tiến độ: 50.7%    (ghi đè)
Tiến độ: 100.0%   (ghi đè)
```

#### Bước 4: Kết nối Streams qua Pipe

```typescript
archiverInstance.pipe(output)
```

**Cơ chế Pipe:**

```text
┌─────────────────────────────────────────────┐
│           LUỒNG DỮ LIỆU PIPE                │
├─────────────────────────────────────────────┤
│                                             │
│  archiver.read() → chunk                    │
│       │                                     │
│       ├─→ pipe() → output.write(chunk)     │
│       │                                     │
│       ├─→ output buffer full?              │
│       │      YES → pause reading            │
│       │      NO  → continue                 │
│       │                                     │
│       └─→ output buffer drained            │
│              → resume reading               │
│                                             │
└─────────────────────────────────────────────┘
```

**Backpressure là gì?**

Khi output stream ghi chậm hơn archiver đọc:

1. Output buffer đầy
2. Pipe tự động **tạm dừng** archiver
3. Đợi output ghi xong
4. Pipe **tiếp tục** archiver

→ **Ngăn tràn bộ nhớ!**

#### Bước 5: Thêm Nội dung

```typescript
archiverInstance.directory(this.distDir, false)
```

**Tham số `false` có ý nghĩa gì?**

```typescript
// Với false:
archive.directory('dist/', false)
// Kết quả trong ZIP:
// dist/main.js    → main.js
// dist/app.js     → app.js
// dist/utils/x.js → utils/x.js

// Với 'dist':
archive.directory('dist/', 'dist')
// Kết quả trong ZIP:
// dist/main.js    → dist/main.js
// dist/app.js     → dist/app.js

// Với 'app':
archive.directory('dist/', 'app')
// Kết quả trong ZIP:
// dist/main.js    → app/main.js
// dist/app.js     → app/app.js
```

**Thêm file tùy chọn:**

```typescript
if (fs.existsSync('README.md')) {
  archiverInstance.file('README.md', { name: 'README.md' })
}
```

- Kiểm tra tồn tại trước
- Không lỗi nếu không có
- Hữu ích cho file documentation

#### Bước 6: Finalize - BẮT ĐẦU NÉN

```typescript
archiverInstance.finalize()
```

**finalize() làm gì?**

```text
┌─────────────────────────────────────────────┐
│        QUY TRÌNH FINALIZE                   │
├─────────────────────────────────────────────┤
│                                             │
│ 1. Đóng hàng đợi file                      │
│    → Không thể thêm file nữa               │
│                                             │
│ 2. Bắt đầu xử lý hàng đợi                  │
│    → Đọc từng file                         │
│                                             │
│ 3. Với mỗi file:                           │
│    a. fs.createReadStream(file)            │
│    b. Qua zlib compression                 │
│    c. Tạo ZIP headers                      │
│    d. Ghi chunks qua pipe                  │
│                                             │
│ 4. Tạo ZIP metadata:                       │
│    - Central directory                     │
│    - End of central directory record       │
│                                             │
│ 5. Kết thúc stream                         │
│    → Phát 'end' event                      │
│                                             │
│ 6. Output stream đóng                      │
│    → Phát 'close' event                    │
│                                             │
└─────────────────────────────────────────────┘
```

**❗ QUAN TRỌNG:**

- Phải gọi `finalize()` nếu không ZIP sẽ **TRỐNG**
- Không thể thêm file sau `finalize()`
- `finalize()` trả về Promise (có thể `await`)

---

### ⭐ PHẦN 4: Helper Methods

#### getPackageJson() - Đọc package.json

```typescript
private getPackageJson(): PackageJson {
  const packageJsonPath = path.join(this.rootDir, 'package.json');
  const packageJsonContent: PackageJson = require(packageJsonPath);
  return packageJsonContent;
}
```

**Tại sao dùng `require()` thay vì `fs.readFileSync()`?**

```typescript
// ❌ Cách dài:
const content = fs.readFileSync('package.json', 'utf-8')
const json = JSON.parse(content)

// ✅ Cách ngắn:
const json = require('./package.json')
```

**Lợi ích `require()`:**

1. **Tự động parse** - Không cần `JSON.parse()`
2. **Cache tích hợp** - Lần sau không đọc lại
3. **Đơn giản** - 1 dòng thay vì 2
4. **Type-safe** - TypeScript hiểu cấu trúc

#### validateDistDirectory() - Kiểm tra dist/

```typescript
private validateDistDirectory(): void {
  // Kiểm tra 1: dist/ có tồn tại?
  if (!fs.existsSync(this.distDir)) {
    console.error('❌ Lỗi: Không tìm thấy dist/');
    process.exit(1);
  }

  // Kiểm tra 2: dist/ có nội dung?
  const files = fs.readdirSync(this.distDir);
  if (files.length === 0) {
    console.error('❌ Lỗi: dist/ trống');
    process.exit(1);
  }
}
```

**Tại sao `process.exit(1)`?**

- `1` = Mã lỗi chuẩn Unix
- CI/CD detect lỗi → dừng pipeline
- Shell script có thể check: `if [ $? -eq 1 ]; then ...`

#### ensureReleasesDirectory() - Đảm bảo releases/

```typescript
private ensureReleasesDirectory(): void {
  if (!fs.existsSync(this.releasesDir)) {
    fs.mkdirSync(this.releasesDir, { recursive: true });
  }
}
```

**`recursive: true` nghĩa là gì?**

```typescript
// Với recursive: true
fs.mkdirSync('/a/b/c', { recursive: true })
// Tạo: /a, /a/b, /a/b/c (cả chuỗi)

// Không recursive (mặc định)
fs.mkdirSync('/a/b/c')
// Lỗi nếu /a hoặc /a/b chưa tồn tại
```

Tương đương: `mkdir -p` trong Unix/Linux

---

### ⭐ PHẦN 5: Entry Point - Điểm vào chương trình

```typescript
if (require.main === module) {
  const customVersion = process.argv[2]
  const zipCreator = new ZipCreator(customVersion)
  zipCreator.execute().catch((error) => {
    console.error('💥 Lỗi nghiêm trọng:', error)
    process.exit(1)
  })
}

export { ZipCreator }
```

#### `require.main === module` là gì?

```typescript
// File: create-zip.ts

// Trường hợp 1: Chạy trực tiếp
$ node create-zip.js
→ require.main === module → TRUE
→ Code trong if{} được thực thi

// Trường hợp 2: Import vào file khác
import { ZipCreator } from './create-zip';
→ require.main === module → FALSE
→ Code trong if{} KHÔNG chạy
→ Chỉ export class
```

**Lợi ích:**

- File vừa là **script** vừa là **module**
- Có thể test dễ dàng (import không chạy code)
- Có thể tái sử dụng (import class)

#### `process.argv` - Command line arguments

```bash
$ ts-node create-zip.ts 1.2.3

# process.argv structure:
[
  '/usr/bin/node',              # [0] Node executable
  '/project/create-zip.ts',     # [1] Script path
  '1.2.3'                       # [2] Tham số 1 (custom version)
]
```

**Ví dụ sử dụng:**

```bash
# Dùng version từ package.json
$ ts-node scripts/create-zip.ts

# Dùng version tùy chỉnh
$ ts-node scripts/create-zip.ts 2.0.0
```

---

## ✅ Best Practices

### 1. Luôn thiết lập Event Listeners TRƯỚC finalize()

```typescript
// ✅ TỐT
archive.on('error', reject)
archive.on('warning', handleWarning)
archive.pipe(output)
archive.directory('dist/', false)
archive.finalize() // Cuối cùng

// ❌ TỆ
archive.finalize()
archive.on('error', reject) // Có thể bỏ lỡ lỗi!
```

### 2. Dùng 'close' event để biết hoàn tất

```typescript
// ✅ TỐT
output.on('close', () => {
  console.log('File đã ghi xong vào đĩa')
})

// ❌ TỆ
archive.on('end', () => {
  console.log('Dữ liệu tạo xong nhưng có thể chưa ghi xong')
})
```

### 3. Xử lý CẢ HAI error events

```typescript
// ✅ TỐT
output.on('error', handleError)
archive.on('error', handleError)

// ❌ TỆ
archive.on('error', handleError)
// Lỗi output sẽ crash process!
```

### 4. Dùng Streaming cho file lớn

```typescript
// ✅ TỐT
const stream = fs.createReadStream('huge.txt')
archive.append(stream, { name: 'huge.txt' })

// ❌ TỆ
const buffer = fs.readFileSync('huge.txt')
archive.append(buffer, { name: 'huge.txt' })
// Có thể out-of-memory!
```

---

## ⚠️ Lỗi Thường gặp

### 1. Quên gọi finalize()

```typescript
// ❌ TỆ
archive.directory('dist/', false)
// ZIP sẽ trống!

// ✅ TỐT
archive.directory('dist/', false)
archive.finalize()
```

### 2. Thêm file sau finalize()

```typescript
// ❌ TỆ
archive.finalize()
archive.file('extra.txt') // LỖI!

// ✅ TỐT
archive.file('extra.txt')
archive.finalize()
```

### 3. Không xử lý warnings đúng

```typescript
// ❌ TỆ: Bỏ qua tất cả
archive.on('warning', () => {})

// ✅ TỐT: Phân biệt loại warning
archive.on('warning', (warn) => {
  if (warn.code === 'ENOENT') {
    console.warn('File không tìm thấy')
  } else {
    throw warn // Lỗi nghiêm trọng
  }
})
```

---

## 🎓 Tóm tắt

### Điểm Chính Cần Nhớ

1. **Archiver** = Engine nén (Readable stream)
2. **Output** = Đích đến (Writable stream)
3. **Pipe** = Kết nối tự động
4. **finalize()** = Trigger nén
5. **'close'** = Hoàn tất thực sự

### Thứ tự Thực thi Chuẩn

```text
1. Tạo output stream
2. Tạo archiver instance
3. Setup event listeners
4. Pipe archiver → output
5. Thêm files/directories
6. Gọi finalize()
7. Đợi 'close' event
8. DONE!
```

---

**Phiên bản**: 1.0.0  
**Cập nhật**: 25-01-2025
