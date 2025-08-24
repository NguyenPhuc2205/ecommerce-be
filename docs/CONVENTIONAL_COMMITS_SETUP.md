# Setup Conventional Commits CUỐI CÙNG - Husky v9 + PNPM (2025)

> ⚠️ **QUAN TRỌNG**: Đây là setup **CUỐI CÙNG** với Husky v9+ syntax mới nhất (không dùng `husky install` deprecated nữa)

## 🎯 TỔNG QUAN

Dự án đã được setup hoàn chỉnh với:

- ✅ **Husky v9** - Git hooks với syntax mới nhất
- ✅ **Commitlint** - Validate commit message format
- ✅ **Commitizen** - Interactive commit tool
- ✅ **Lint-staged** - Chạy linter/formatter cho staged files
- ✅ **ESLint + Prettier** - Code quality & formatting
- ✅ **GitHub Actions** - CI/CD pipeline với commit validation

## 📋 DEPENDENCIES ĐÃ CÀI ĐẶT

```bash
# Core conventional commits
"husky": "^9.1.7"
"@commitlint/cli": "^19.8.1"
"@commitlint/config-conventional": "^19.8.1"
"lint-staged": "^16.1.5"

# Interactive commit tool
"commitizen": "^4.3.1"
"@commitlint/cz-commitlint": "^19.8.1"

# Code quality
"eslint": "^9.18.0"
"prettier": "^3.4.2"
"typescript-eslint": "^8.20.0"
```

## 🔧 CẤU HÌNH FILES

### 1. Package.json Scripts

```json
{
  "scripts": {
    "prepare": "husky",
    "commit": "cz",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "lint:check": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"test/**/*.ts\""
  },
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  },
  "lint-staged": {
    "*.{ts,js}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

### 2. Commitlint Config (.commitlintrc.js)

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
    ],

    'scope-enum': [
      2,
      'always',
      [
        // Business Modules
        'auth',
        'user',
        'admin',
        'product',
        'category',
        'cart',
        'order',
        'payment',
        'shipping',
        'inventory',
        'review',
        'wishlist',
        'coupon',
        'notification',
        'email',
        'analytics',

        // Technical Layers
        'api',
        'database',
        'config',
        'middleware',
        'guard',
        'interceptor',
        'decorator',
        'pipe',
        'filter',
        'queue',
        'cache',
        'storage',
        'search',

        // NestJS Architecture
        'dto',
        'entity',
        'service',
        'controller',
        'module',
        'provider',
        'repository',

        // Infrastructure & Tools
        'docker',
        'k8s',
        'deploy',
        'monitoring',
        'security',
        'backup',
        'deps',
        'scripts',
        'testing',
        'ci',
        'release',
      ],
    ],

    'subject-case': [2, 'always', 'lower-case'],
    'subject-min-length': [2, 'always', 10],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 120],
  },
}
```

### 3. Husky v9 Git Hooks

#### .husky/pre-commit

```bash
#!/bin/sh
# Husky v9 pre-commit hook
pnpm exec lint-staged
```

#### .husky/commit-msg

```bash
#!/bin/sh
# Husky v9 commit-msg hook
pnpm exec commitlint --edit $1
```

#### .husky/pre-push (Optional)

```bash
#!/bin/sh
# Husky v9 pre-push hook
pnpm run test
```

#### .husky/post-merge (Optional)

```bash
#!/bin/sh
# Husky v9 post-merge hook (Run after git pull)
pnpm install
```

### 4. ESLint Config (eslint.config.mjs)

```javascript
export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', '.commitlintrc.js', 'dist/', 'node_modules/', 'coverage/', '.husky/'],
  },
  // ... other configs
)
```

### 5. Prettier Config (.prettierrc)

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "semi": false,
  "arrowParens": "always",
  "tabWidth": 2,
  "endOfLine": "auto",
  "printWidth": 120
}
```

### 6. VS Code Settings (.vscode/settings.json)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "git.inputValidationLength": 120,
  "git.inputValidationSubjectLength": 50,
  "conventionalCommits.scopes": [
    "auth",
    "user",
    "admin",
    "product",
    "category",
    "cart",
    "order",
    "payment",
    "shipping",
    "inventory",
    "review",
    "wishlist",
    "coupon"
  ]
}
```

## 🚀 CÁCH SỬ DỤNG HÀNG NGÀY

### 1. Commit Interactive (Khuyến nghị cho beginners):

```bash
pnpm run commit
```

### 2. Commit Direct (Khi đã quen):

```bash
# Features
git commit -m "feat(product): implement product search with elasticsearch"
git commit -m "feat(payment): add stripe payment integration"
git commit -m "feat(auth): implement social login with google oauth"

# Bug fixes
git commit -m "fix(auth): resolve jwt token refresh race condition"
git commit -m "fix(cart): prevent negative quantity in cart items"
git commit -m "fix(payment): handle stripe webhook signature validation"

# Refactoring
git commit -m "refactor(database): convert typeorm entities to prisma schema"
git commit -m "refactor(auth): migrate from passport to custom guard"

# Performance
git commit -m "perf(product): optimize product listing with database indexing"
git commit -m "perf(search): implement redis caching for search results"

# Documentation
git commit -m "docs(api): update swagger documentation for v2 endpoints"
git commit -m "docs(readme): add conventional commits usage guide"

# Configuration
git commit -m "chore(deps): upgrade nestjs to v10.3.0"
git commit -m "ci(github): add automated testing workflow"
```

### 3. Commit với Body và Footer:

```bash
git commit -m "feat(payment): add stripe payment integration

Add comprehensive stripe payment processing including:
- Credit card payments
- Subscription handling
- Webhook event processing

Closes #123
BREAKING CHANGE: Payment API response format changed"
```

## 🎯 EXAMPLES CHO ECOMMERCE PROJECT

### Business Features:

```bash
feat(auth): implement social login with google and facebook oauth
feat(product): add advanced filtering with price range and attributes
feat(cart): implement persistent cart with redis caching
feat(order): add order tracking with real-time status updates
feat(payment): integrate paypal and stripe payment gateways
feat(inventory): implement low stock alerts and auto-reorder
feat(review): add photo upload functionality for product reviews
feat(coupon): implement dynamic coupon codes with usage limits
feat(shipping): add multiple shipping provider integration
feat(analytics): implement user behavior tracking with mixpanel
```

### Technical Improvements:

```bash
refactor(auth): migrate from passport-jwt to custom guard
refactor(database): convert typeorm entities to prisma schema
refactor(payment): extract payment processing to separate microservice
refactor(order): simplify order state machine logic
refactor(api): standardize error response format across endpoints

perf(product): optimize product listing query with database indexing
perf(search): implement redis caching for search results
perf(cart): lazy load cart items to reduce initial load time
perf(order): optimize order history query with pagination
perf(api): implement response compression for large datasets
```

## 🔍 WORKFLOW KHI DEVELOP

### 1. Trước khi commit:

```bash
# Kiểm tra code style
pnpm run lint:check
pnpm run format:check

# Chạy tests
pnpm run test
pnpm run test:e2e
```

### 2. Commit changes:

```bash
# Add files
git add .

# Interactive commit (khuyến nghị)
pnpm run commit

# Hoặc commit trực tiếp
git commit -m "feat(user): implement user profile management"
```

### 3. Push code:

```bash
git push origin feature-branch
```

## ⚠️ TROUBLESHOOTING

### 1. Husky hooks không chạy:

```bash
# Kiểm tra quyền thực thi (trên Linux/Mac)
chmod +x .husky/*

# Trên Windows, đảm bảo Git Bash có thể chạy
git config core.autocrlf false
```

### 2. PNPM không được nhận diện:

```bash
# Đảm bảo dùng pnpm exec thay vì npx
pnpm exec lint-staged
pnpm exec commitlint --edit $1
```

### 3. ESLint lỗi với config files:

```javascript
// Trong eslint.config.mjs, thêm vào ignores:
{
  ignores: ['.commitlintrc.js', '.husky/', 'dist/', 'node_modules/']
}
```

### 4. Commitlint không tìm thấy config:

```bash
# Kiểm tra file .commitlintrc.js ở root project
# Hoặc thêm vào package.json:
{
  "commitlint": {
    "extends": ["@commitlint/config-conventional"]
  }
}
```

### 5. Interactive commit không hoạt động:

```bash
# Nếu pnpm run commit bị lỗi, dùng commit trực tiếp:
git commit -m "feat(scope): description"

# Hoặc check terminal compatibility:
winpty pnpm run commit  # Trên Git Bash Windows
```

## 📊 GITHUB ACTIONS CI/CD

File `.github/workflows/ci.yml` đã được setup để:

- ✅ Lint check code style
- ✅ Format check code formatting
- ✅ Type check TypeScript
- ✅ Run unit tests với coverage
- ✅ Run E2E tests
- ✅ Validate commit messages trong PR

## ✅ CHECKLIST KIỂM TRA CUỐI

- [x] `pnpm exec husky init` đã chạy thành công
- [x] File `.husky/pre-commit` có executable permission
- [x] File `.husky/commit-msg` có executable permission
- [x] File `.commitlintrc.js` có ở root project
- [x] Lint-staged config có trong package.json
- [x] ESLint và Prettier đã cấu hình đúng
- [x] VS Code settings hỗ trợ conventional commits
- [x] GitHub Actions workflow hoạt động
- [x] Test commit: `git commit -m "test: sample commit"` ✅
- [x] Interactive commit: `pnpm run commit` (có thể cần terminal khác)
- [x] Pre-commit hooks chạy lint và format ✅
- [x] Commit-msg hook validate conventional format ✅

## 🎉 KẾT LUẬN

Setup này đã được test trên dự án thực tế và hoàn toàn tương thích với:

- ✅ **Husky v9** - Syntax mới nhất
- ✅ **PNPM** - Package manager
- ✅ **NestJS** - Backend framework
- ✅ **TypeScript** - Language
- ✅ **Windows** - Development environment

**Commit đầu tiên đã thành công:**

```
[master ded5c77] feat(config): setup conventional commits with husky v9 and commitizen
25 files changed, 5306 insertions(+), 1357 deletions(-)
```

Giờ đây team có thể:

- 🎯 Commit với format chuẩn conventional
- 🔧 Auto format code trước khi commit
- ✨ Interactive commit với scope suggestions
- 🚀 CI/CD validate commits trong PR
- 📖 Clear commit history cho changelog generation

**Happy coding! 🚀**
