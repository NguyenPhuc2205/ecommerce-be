# Conventional Commits Setup - NestJS + PNPM

## 🎯 **GOALS & BENEFITS**

### What are Conventional Commits?

**Definition:** A specification for adding human and machine-readable meaning to commit messages, providing a structured format that enables:

### 🎯 **PRIMARY OBJECTIVES**

#### 1. **Automated Release Management**

- **Automatic Changelog Generation**: Transform commit history into readable release notes
- **Semantic Versioning**: Auto-increment version numbers based on commit types
  - `feat:` → Minor version bump (1.0.0 → 1.1.0)
  - `fix:` → Patch version bump (1.0.0 → 1.0.1)
  - `feat!:` or `BREAKING CHANGE` → Major version bump (1.0.0 → 2.0.0)

#### 2. **Enhanced Developer Experience**

- **Consistent Communication**: Every team member writes commits the same way
- **Clear Intent**: Commit type immediately shows the nature of changes
- **Easy Navigation**: Filter commits by type, scope, or breaking changes
- **Reduced Cognitive Load**: No more thinking about "how to write this commit"

#### 3. **Code Quality Assurance**

- **Pre-commit Validation**: Lint, format, and test before code enters history
- **Commit Message Standards**: Enforce meaningful, descriptive commit messages
- **Breaking Change Detection**: Automatically flag potentially dangerous changes
- **Team Accountability**: Clear author attribution and change reasoning

### 📊 **BUSINESS BENEFITS**

#### For Development Teams

- **Faster Code Reviews**: Reviewers understand changes at a glance
- **Reduced Bug Tracking**: Link commits to issues automatically
- **Better Collaboration**: Consistent format reduces miscommunication
- **Onboarding Speed**: New developers learn conventions quickly

#### For Project Management

- **Release Planning**: Predict release scope from commit types
- **Change Impact Analysis**: Identify breaking changes before deployment
- **Feature Tracking**: Monitor feature completion progress
- **Risk Assessment**: Spot potentially risky changes early

#### For DevOps/CI-CD

- **Automated Deployments**: Trigger deployments based on commit types
- **Smart Testing**: Run different test suites based on affected areas
- **Rollback Intelligence**: Understand what to revert when issues occur
- **Documentation Sync**: Auto-update docs when API changes occur

### 🔧 **STANDARD FORMAT**

```text
<type>(<scope>): <short description>

<body - optional>

<footer - optional>
```

#### **Commit Types**

- `feat`: New features for users
- `fix`: Bug fixes for users
- `docs`: Documentation changes only
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks, dependency updates
- `ci`: Changes to CI/CD configuration
- `build`: Changes to build system or external dependencies

#### **Scopes for E-commerce Project**

```bash
# Business Modules
auth, user, admin, product, category, cart, order, payment,
shipping, inventory, review, wishlist, coupon, notification

# Technical Layers
api, database, config, middleware, guard, interceptor,
decorator, pipe, filter, queue, cache, storage, search

# NestJS Architecture
dto, entity, service, controller, module, provider, repository
```

### 💡 **REAL-WORLD EXAMPLES**

#### Simple Commits:

```bash
feat(auth): implement Google OAuth2 login integration
fix(cart): resolve item quantity calculation bug
docs(api): update Swagger documentation for payment endpoints
perf(product): optimize database queries with indexing
refactor(order): simplify order status state machine
```

#### Detailed Commits:

```bash
feat(payment): add Stripe payment gateway integration

Integrate Stripe APIs for credit card processing including:
- Payment intent creation and confirmation
- Webhook handling for payment status updates
- Error handling for failed transactions
- PCI compliance validation

Closes #156
Co-authored-by: John Doe <john@example.com>
```

#### Breaking Changes:

```bash
feat(api)!: restructure user response format

BREAKING CHANGE: User API endpoints now return data in a standardized format:
- User object moved to `data` property
- Pagination info moved to `meta` property
- Error details moved to `errors` array

Migration guide: Update frontend to access user data via response.data.user
instead of response.user

Closes #234
```

---

## 📦 **STEP 1: INSTALLING TOOLS**

### Tool Explanations:

**Husky:** Git hooks automation tool

- **What it does:** Runs scripts automatically on Git actions (commit, push...)
- **Why needed:** Ensures code quality checks before commit/push
- **Why Husky instead of raw `.git/hooks`?**
  - `.git/hooks` are **local-only (.git folder)** → not shared (ignore ) when pushing code, so every teammate must manually configure them.
  - Harder to maintain → scripts live only in `.git/hooks`, outside of version control.
  - Husky puts hooks under `.husky/` (tracked by Git) → everyone in the team gets the same rules automatically.
  - Integrated with `package.json` scripts → easy to run tools like ESLint, Prettier, Commitlint.
  - Auto setup via `prepare` script on `pnpm install` → no need for manual copying.

**Commitlint:** Commit message format validation tool

- **What it does:** Ensures commit messages follow conventional format
- **Why needed:** Enforces team-wide commit message standards

**Lint-staged:** Selective file linting tool

- **What it does:** Only checks files in Git staging area, not entire project
- **Why needed:** Saves time by checking only changed files

**Commitizen:** Interactive commit message tool

- **What it does:** Provides step-by-step wizard for creating commit messages
- **Why needed:** Helps beginners and prevents format mistakes

### Installation Commands:

```bash
# Essential tools
pnpm add -D husky @commitlint/cli @commitlint/config-conventional lint-staged

# Interactive tools (recommended)
pnpm add -D commitizen @commitlint/cz-commitlint

# Code quality tools (if not already installed)
pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-prettier
pnpm add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**Package Explanations:**

- `husky`: Creates Git hooks
- `@commitlint/cli`: Main commit message validation program
- `@commitlint/config-conventional`: Standard conventional commits rule set
- `lint-staged`: Runs linting on staged files only
- `commitizen`: Interactive commit interface
- `@commitlint/cz-commitlint`: Adapter connecting commitizen with commitlint

---

## 🔧 **STEP 2: CONFIGURING HUSKY (GIT HOOKS)**

### Initialize Husky

```bash
pnpm exec husky init
```

**What this command does:**

1. Creates `.husky/` directory
2. Creates sample `.husky/pre-commit` file
3. Adds `"prepare": "husky"` script to package.json
4. Git will automatically run hooks from `.husky/` directory

(When you run pnpm install, the prepare script runs → Husky injects small shim scripts into .git/hooks/\* (bridge files).
Git executes .git/hooks/pre-commit → that shim just calls .husky/pre-commit.)

### Configure Pre-commit Hook

**Formula to create**

```
pnpm husky add .husky/<hook-name> "<command>"
```

pre-commit (lint-staged)

```
pnpm husky add .husky/pre-commit "pnpm exec lint-staged"
```

Commit-msg (commitlint)

```
pnpm husky add .husky/commit-msg "pnpm exec commitlint --edit \$1"
```

Pre-push (test)

```
pnpm husky add .husky/commit-msg "pnpm exec commitlint --edit \$1"
```

**File:** `.husky/pre-commit`

```bash
#!/bin/sh
# Hook runs before commit creation
# Checks code quality of staged files
pnpm exec lint-staged
```

**Explanation:**

- `#!/bin/sh`: Specifies shell script

- Hook runs **BEFORE** commit is created
- If lint-staged fails → commit is aborted
- Only checks files that have been `git add`ed

### Configure Commit-msg Hook

**Create file:** `.husky/commit-msg`

```bash
#!/bin/sh
# Hook validates commit message format
# Ensures commit message follows conventional format
pnpm exec commitlint --edit $1
```

**Explanation:**

- When it runs:
  Hook runs **AFTER** finish writing commit message, but before Git finalizes the commit.
- `$1`:
  - First parameter = path to file containing commit message
  - Git automatically passes the path of a temporary file (usually .git/COMMIT_EDITMSG) that contains your commit message.
- `--edit $1`: Reads commit message from file and validates it
- If format is wrong → commit is rejected

### Configure Pre-push Hook (optional):

**Create file:** `.husky/pre-push`

```bash
#!/bin/sh
# Hook runs before pushing to remote
# Runs tests to ensure code has no errors
pnpm run test
```

**Explanation:**

- Runs **BEFORE** pushing to remote repository
- Ensures all tests pass before pushing
- Prevents pushing broken code to server

```
git commit
   ↓
.git/hooks/pre-commit   (shim auto-created by Husky and 1 link to .husky file)
   ↓
.husky/pre-commit       (Real command in husky file)
   ↓
pnpm exec lint-staged   (command run)
```

---

## ⚙️ **STEP 3: CONFIGURING PACKAGE.JSON**

```json
{
  "name": "nestjs-ecommerce-backend",
  "version": "1.0.0",
  "scripts": {
    // Standard NestJS scripts
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",

    // Code quality scripts
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "lint:check": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "format:check": "prettier --check \"src/**/*.ts\" \"test/**/*.ts\"",

    // Testing scripts
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",

    // Git hooks scripts - IMPORTANT
    "prepare": "husky",
    "commit": "cz"
  },

  // Commitizen configuration
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  },

  // Lint-staged configuration
  "lint-staged": {
    "*.{ts,js}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

**Section Explanations:**

### Important Scripts:

- `"prepare": "husky"`: Runs automatically during `pnpm install` to setup hooks
- `"commit": "cz"`: Shortcut to run commitizen interactive mode
- `"lint:check"`: Check for errors without auto-fixing
- `"format:check"`: Check formatting without auto-fixing

### Commitizen Configuration:

- `"path": "@commitlint/cz-commitlint"`: Uses adapter compatible with commitlint
- Running `pnpm run commit` shows step-by-step interface

### Lint-staged Configuration:

- `"*.{ts,js}"`: For TypeScript/JavaScript files → run ESLint + Prettier
- `"*.{json,md,yml,yaml}"`: For config/docs files → run Prettier only
- Only processes files that have been `git add`ed, saving time

---

## 🎨 **STEP 4: CONFIGURING COMMITLINT**

**File:** `.commitlintrc.js`

```javascript
module.exports = {
  // Inherit standard conventional commits rules
  extends: ['@commitlint/config-conventional'],

  // Customize rules for project
  rules: {
    // Define allowed commit types
    'type-enum': [
      2, // Level: 2 = error (required)
      'always', // Always apply
      [
        'build', // Changes to build system or external dependencies
        'chore', // Maintenance tasks, no src code impact
        'ci', // Changes to CI/CD configuration
        'docs', // Documentation changes only
        'feat', // New features
        'fix', // Bug fixes
        'perf', // Performance improvements
        'refactor', // Code refactoring (not feat/fix)
        'revert', // Revert previous commits
        'style', // Code style changes (formatting, spacing...)
        'test', // Adding/modifying tests
      ],
    ],

    // Define scopes for E-commerce project
    'scope-enum': [
      2, // Required to be one of these scopes
      'always',
      [
        // Business Modules
        'auth', // Authentication & Authorization
        'user', // User management
        'admin', // Admin panel
        'product', // Product catalog
        'category', // Product categories
        'cart', // Shopping cart
        'order', // Order management
        'payment', // Payment processing
        'shipping', // Shipping & delivery
        'inventory', // Stock management
        'review', // Product reviews
        'wishlist', // User wishlists
        'coupon', // Discount coupons
        'notification', // Push notifications
        'email', // Email services
        'analytics', // Analytics & reporting

        // Technical Layers
        'api', // API layer
        'database', // Database operations
        'config', // System configuration
        'middleware', // Express/NestJS middleware
        'guard', // Route guards
        'interceptor', // NestJS interceptors
        'decorator', // Custom decorators
        'pipe', // Validation pipes
        'filter', // Exception filters
        'queue', // Bull/Redis queues
        'cache', // Caching layer
        'storage', // File storage
        'search', // Search functionality

        // NestJS Architecture
        'dto', // Data Transfer Objects
        'entity', // Database entities
        'service', // Business logic services
        'controller', // API controllers
        'module', // NestJS modules
        'provider', // Custom providers
        'repository', // Data access layer

        // Infrastructure
        'docker', // Docker configuration
        'k8s', // Kubernetes
        'deploy', // Deployment scripts
        'monitoring', // APM/logging
        'security', // Security implementations
        'backup', // Data backup

        // Development Tools
        'deps', // Dependencies
        'scripts', // Build/dev scripts
        'testing', // Test configuration
        'ci', // CI/CD pipelines
        'release', // Release management
      ],
    ],

    // Additional rule configurations
    'scope-empty': [0], // Allow empty scope
    'scope-case': [2, 'always', 'lower-case'], // Scope must be lowercase
    'subject-case': [2, 'always', 'lower-case'], // Subject must be lowercase
    'subject-empty': [2, 'never'], // Subject is required
    'subject-max-length': [2, 'always', 100], // Subject max 100 characters
    'subject-min-length': [2, 'always', 10], // Subject min 10 characters
    'header-max-length': [2, 'always', 120], // Header max 120 characters
    'body-leading-blank': [2, 'always'], // Blank line before body
    'body-max-line-length': [2, 'always', 150], // Each body line max 150 chars
    'footer-leading-blank': [2, 'always'], // Blank line before footer
  },
}
```

**Rule Level Explanations:**

- `0`: Disable rule
- `1`: Warning (allowed but shows warning)
- `2`: Error (required, prevents commit if violated)

**E-commerce Project Scope Explanations:**

- **Business Modules**: Core e-commerce system functionalities
- **Technical Layers**: Infrastructure technical components
- **NestJS Architecture**: NestJS-specific components
- **Infrastructure**: DevOps and deployment
- **Development Tools**: Development tooling

---

## 🎨 **STEP 5: CONFIGURING CODE QUALITY TOOLS**

### ESLint Configuration (eslint.config.mjs):

```javascript
// @ts-check
import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    // Files to ignore
    ignores: ['eslint.config.mjs', '.commitlintrc.js', 'dist/', 'node_modules/', 'coverage/', '.husky/'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node, // Node.js environment
        ...globals.jest, // Jest testing support
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Custom rules
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Allow any type
      '@typescript-eslint/no-floating-promises': 'warn', // Warn on unhandled promises
      '@typescript-eslint/no-unsafe-argument': 'warn', // Warn on unsafe arguments
    },
  },
)
```

### Prettier Configuration (.prettierrc):

```json
{
  "singleQuote": true, // Use single quotes instead of double
  "trailingComma": "all", // Add trailing commas everywhere possible
  "tabWidth": 2, // 2 spaces per tab
  "semi": false, // No semicolons
  "printWidth": 120, // Line wrap at 120 characters
  "endOfLine": "auto", // Auto line endings
  "arrowParens": "always" // Always parentheses around arrow function params
}
```

---

## 🎯 **STEP 6: DAILY USAGE PATTERNS**

### Interactive Commit (Recommended for beginners):

```bash
# Add files to staging
git add .

# Run interactive commit
pnpm run commit
```

**The process will ask:**

1. **Commit type:** feat, fix, docs, style...
2. **Scope:** auth, user, product...
3. **Short description:** add Google login feature
4. **Long description:** (optional) detailed implementation notes
5. **Breaking changes:** (optional) any API breaking changes
6. **Related issues:** (optional) closes #123

### Direct Commit (when experienced):

```bash
# Feature examples
git commit -m "feat(auth): implement Google OAuth login integration"
git commit -m "feat(payment): add Stripe payment gateway support"
git commit -m "feat(product): implement advanced product filtering"

# Bug fix examples
git commit -m "fix(payment): resolve payment timeout calculation error"
git commit -m "fix(cart): prevent negative quantity in shopping cart"
git commit -m "fix(auth): handle JWT token refresh race condition"

# Refactor examples
git commit -m "refactor(user): optimize user query performance with indexing"
git commit -m "refactor(database): migrate from TypeORM to Prisma schema"

# Documentation examples
git commit -m "docs(api): update Swagger documentation for auth endpoints"
git commit -m "docs(readme): add installation and setup instructions"

# Test examples
git commit -m "test(order): add integration tests for order processing flow"
```

### Breaking Change Commits:

```bash
# Method 1: Using exclamation mark
git commit -m "feat(api)!: restructure user endpoint response format"

# Method 2: Using footer
git commit -m "feat(api): restructure user endpoint response format

BREAKING CHANGE: User API response now returns 'userId' instead of 'id'"
```

---

## 🚀 **STEP 7: DETAILED GITHUB ACTIONS CI/CD**

**File:** `.github/workflows/ci.yml`

```yaml
# Workflow name
name: CI/CD Pipeline

# When to run this workflow
on:
  push:
    branches: [main, develop] # Run on push to main or develop
  pull_request:
    branches: [main] # Run on PR to main

# Define jobs
jobs:
  # Job 1: Code quality and testing
  lint-and-test:
    runs-on: ubuntu-latest # Run on latest Ubuntu

    steps:
      # Step 1: Get source code
      - name: Checkout code
        uses: actions/checkout@v4 # Official action to clone repo

      # Step 2: Setup PNPM
      - name: Setup pnpm
        uses: pnpm/action-setup@v2 # Official PNPM action
        with:
          version: 8 # PNPM version

      # Step 3: Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4 # Official Node action
        with:
          node-version: '20' # Node.js 20 LTS
          cache: 'pnpm' # Cache PNPM dependencies

      # Step 4: Install dependencies
      - name: Install dependencies
        run: pnpm install --frozen-lockfile # Install from exact lock file

      # Step 5: Lint check
      - name: Lint check
        run: pnpm run lint:check # Check only, don't auto-fix

      # Step 6: Format check
      - name: Format check
        run: pnpm run format:check # Check Prettier formatting

      # Step 7: Type check
      - name: Type check
        run: pnpm run build # Build to check TypeScript

      # Step 8: Unit tests with coverage
      - name: Unit tests
        run: pnpm run test:cov # Run tests + create coverage report

      # Step 9: E2E tests
      - name: E2E tests
        run: pnpm run test:e2e # End-to-end testing

  # Job 2: Validate commit message format
  commitlint:
    runs-on: ubuntu-latest
    # Only run for pull requests
    if: github.event_name == 'pull_request'

    steps:
      # Get complete Git history
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Get full history instead of just latest commit

      # Check all commits in PR
      - name: Lint commit messages
        uses: wagoid/commitlint-github-action@v5
        with:
          configFile: '.commitlintrc.js' # Config file path

  # Job 3: Build and deploy (only when merging to main)
  build-and-deploy:
    runs-on: ubuntu-latest
    # Only run when pushing to main and previous jobs pass
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [lint-and-test, commitlint] # Depends on previous 2 jobs

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      # Build for production
      - name: Build application
        run: pnpm run build

      # Build Docker image
      - name: Build Docker image
        run: docker build -t nestjs-ecommerce:${{ github.sha }} .

    # Deploy step can be added here
    # - name: Deploy to staging
    #   run: echo "Deploy to staging server"
```

**Detailed GitHub Actions Explanations:**

### Trigger Events:

- `on.push`: Runs when code is pushed to main/develop branches
- `on.pull_request`: Runs when PR is created/updated targeting main

### Job Dependencies:

- `needs: [lint-and-test, commitlint]`: Deploy job only runs when previous 2 jobs succeed
- Ensures code quality before deployment

### Cache Strategy:

- `cache: 'pnpm'`: GitHub caches PNPM dependencies between runs
- Makes workflow runs faster

### Security:

- `--frozen-lockfile`: Ensures installation matches exact versions in pnpm-lock.yaml
- `fetch-depth: 0`: Needed for commitlint to check all commits in PR

---

## 🛠️ **STEP 8: VS CODE INTEGRATION**

**File:** `.vscode/settings.json`

```json
{
  // Auto-format on save
  "editor.formatOnSave": true,

  // Default to Prettier formatter
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // Auto-fix ESLint on save
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },

  // Git commit message validation
  "git.inputValidationLength": 120, // Max 120 characters
  "git.inputValidationSubjectLength": 50, // Subject max 50 characters

  // Conventional Commits extension support
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
    "coupon",
    "notification",
    "email",
    "analytics",
    "api",
    "database",
    "config",
    "middleware",
    "guard",
    "dto",
    "entity",
    "service",
    "controller",
    "module"
  ],

  // File-specific formatters
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // TypeScript settings
  "typescript.preferences.quoteStyle": "single",
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

**Recommended Extensions:** `.vscode/extensions.json`

```json
{
  "recommendations": [
    "esbenp.prettier-vscode", // Prettier formatter
    "dbaeumer.vscode-eslint", // ESLint linter
    "vivaxy.vscode-conventional-commits", // Conventional Commits helper
    "eamodio.gitlens", // Git visualization
    "ms-vscode.vscode-typescript-next", // TypeScript support
    "bradlc.vscode-tailwindcss", // Tailwind CSS (if used)
    "ms-vscode.vscode-json", // JSON support
    "ms-vscode.vscode-yaml", // YAML support
    "redhat.vscode-xml" // XML support
  ]
}
```

---

## 📋 **REAL-WORLD E-COMMERCE EXAMPLES**

### Typical Commits:

```bash
# New Features
feat(auth): implement 2FA authentication with SMS verification
feat(product): add product comparison functionality for similar items
feat(cart): implement persistent shopping cart with Redis caching
feat(order): add real-time order tracking with WebSocket integration
feat(payment): integrate MoMo and ZaloPay payment gateways
feat(inventory): implement automatic low stock alerts and reorder points

# Bug Fixes
fix(auth): resolve JWT token premature expiration issue
fix(product): correct price display bug when discount is applied
fix(cart): resolve issue preventing item removal from shopping cart
fix(order): handle race condition during order status updates
fix(payment): handle Stripe webhook timeout errors gracefully
fix(email): repair broken email confirmation templates

# Performance Improvements
perf(product): optimize product search queries with Elasticsearch indexing
perf(cart): implement cart information caching to reduce database calls
perf(order): add pagination to order history for better performance
perf(api): implement response compression for large API responses

# Code Refactoring
refactor(auth): migrate from Passport.js to custom JWT guard implementation
refactor(database): convert TypeORM entities to Prisma schema
refactor(payment): extract payment processing into separate microservice
refactor(order): simplify order status state machine logic

# Documentation Updates
docs(api): update Swagger documentation for v2.0 API endpoints
docs(setup): create AWS ECS deployment guide
docs(contributing): add coding standards and PR template guidelines
```

### Breaking Changes Examples:

```bash
# Breaking change with exclamation mark
feat(api)!: restructure user response format for consistency

# Breaking change with footer
feat(api): restructure user response format for consistency

BREAKING CHANGE:
- User API response now returns data in `data` property instead of directly
- Pagination information moved to `meta` object
- Error details moved to `errors` array
- Status code 200 used for all successful responses, business errors in `error` object

Migration Guide: Update frontend to access user data via response.data.user
instead of response.user. Update error handling to check response.errors array.

Closes #456
Co-authored-by: Jane Doe <jane@example.com>
```

---

## 🔍 **STEP 9: TESTING & TROUBLESHOOTING**

### Complete Setup Testing:

```bash
# 1. Verify Husky is working
ls -la .husky/
# Expected: pre-commit, commit-msg files with execute permissions (rwxr-xr-x)

# 2. Test pre-commit hook
echo "console.log('poorly formatted code')" > test-file.js
git add test-file.js
git commit -m "test commit"
# Expected: ESLint/Prettier will run and fix formatting

# 3. Test commit-msg hook with invalid format
git commit -m "invalid commit message format"
# Expected: Commitlint will reject and show error

# 4. Test commit-msg hook with valid format
git commit -m "test: validate conventional commits setup"
# Expected: Commit succeeds

# 5. Test interactive commit
pnpm run commit
# Expected: Shows step-by-step wizard
```

### Common Issues and Solutions:

#### Issue 1: Husky hooks not running

```bash
# Symptom: Commits bypass lint/format checks
# Cause: Hooks lack execute permissions
# Solution:
chmod +x .husky/*
ls -la .husky/  # Verify permissions
```

#### Issue 2: PNPM not recognized in hooks

```bash
# Symptom: "pnpm: command not found" in Git hooks
# Cause: PATH doesn't include PNPM
# Solution: Add to .husky/_/husky.sh:
export PATH="$HOME/.local/share/pnpm:$PATH"
export PATH="$PWD/node_modules/.bin:$PATH"
```

#### Issue 3: Commitlint config not found

```bash
# Symptom: "No commitlint configuration found"
# Solution: Ensure .commitlintrc.js exists at project root
pwd  # Check current directory
ls .commitlintrc.js  # File must exist at root
```

#### Issue 4: Scope not accepted

```bash
# Symptom: "scope must be one of [...]"
# Cause: Using scope not in enum
# Solution: Add scope to .commitlintrc.js or use existing scope
```

#### Issue 5: Windows Git Bash issues

```bash
# Symptom: Line ending problems
# Solution:
git config --global core.autocrlf false
git config --global core.eol lf
```

---

## 🎯 **STEP 10: TEAM WORKFLOW PROCESSES**

### Developer Workflow:

```bash
# 1. Create new feature branch
git checkout -b feat/product-search-enhancement
git checkout -b fix/payment-validation-bug

# 2. Code and commit using conventional format
# Use interactive mode (recommended for beginners)
git add .
pnpm run commit

# Or direct commit (when experienced)
git commit -m "feat(product): implement advanced search filtering"
git commit -m "test(product): add unit tests for search service"
git commit -m "docs(api): update swagger for search endpoints"

# 3. Push branch
git push origin feat/product-search-enhancement

# 4. Create Pull Request on GitHub
# GitHub Actions will automatically:
# - Run lint and format checks
# - Execute test suite
# - Validate commit message format
# - Build application
```

### Code Review Process:

**Reviewers should check:**

1. **Code Quality**: Logic, performance, security considerations
2. **Test Coverage**: Adequate unit tests and integration tests
3. **Commit Messages**: Proper conventional format and clear descriptions
4. **Breaking Changes**: Documented with migration guides
5. **Documentation**: API docs and README updates

**Merge Strategies:**

```bash
# Squash and merge (recommended for features)
# - Combines all commits into one
# - Keeps history clean
# - Final commit message follows conventional format

# Merge commit (for release branches)
# - Preserves all individual commits
# - Creates merge commit
# - Used for develop -> main merges

# Rebase and merge (for small hotfixes)
# - Replays commits onto main
# - No merge commit created
# - Linear history
```

---

## 📊 **STEP 11: MONITORING & METRICS**

### GitHub Repository Insights:

- **Pulse**: View weekly/monthly activity summaries
- **Contributors**: See who commits most and what types
- **Traffic**: Monitor views, clones, popular content
- **Dependency Graph**: Security alerts and dependency tracking

### Commit Analytics:

```bash
# Statistics by commit type
git log --oneline --grep="^feat" | wc -l    # Count feat commits
git log --oneline --grep="^fix" | wc -l     # Count fix commits
git log --oneline --grep="^docs" | wc -l    # Count docs commits

# Statistics by author
git shortlog -sn                             # Commits per person
git log --author="John" --oneline | wc -l   # John's commits

# Statistics by time period
git log --since="1 month ago" --oneline | wc -l  # Last month's commits
git log --until="1 week ago" --oneline | wc -l   # Previous week's commits
```

### Quality Metrics:

```bash
# Test coverage (from Jest)
pnpm run test:cov
# Target: >90% statement coverage

# Code quality (from ESLint)
pnpm run lint:check
# Target: 0 errors, <10 warnings

# Build time tracking
time pnpm run build
# Target: <2 minutes

# Security audit
pnpm audit
# Target: 0 high/critical vulnerabilities
```

---

## 🚀 **STEP 12: ADVANCED SETUP (OPTIONAL)**

### Automatic Semantic Release:

```bash
# Install semantic-release
pnpm add -D semantic-release @semantic-release/changelog @semantic-release/git

# Configure .releaserc.json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",     # Analyze commits to determine version
    "@semantic-release/release-notes-generator", # Generate release notes
    "@semantic-release/changelog",           # Update CHANGELOG.md
    "@semantic-release/npm",                 # Publish to NPM (if package)
    "@semantic-release/git"                  # Commit changelog back to repo
  ]
}
```

**How it works:**

- `feat`: Increments minor version (1.0.0 → 1.1.0)
- `fix`: Increments patch version (1.0.0 → 1.0.1)
- `feat!` or `BREAKING CHANGE`: Increments major version (1.0.0 → 2.0.0)

### Custom Commitizen Prompts:

```javascript
// .czrc.js - Customize prompts for team
module.exports = {
  types: {
    feat: {
      description: 'New feature',
      title: 'Features',
    },
    fix: {
      description: 'Bug fix',
      title: 'Bug Fixes',
    },
    docs: {
      description: 'Documentation update',
      title: 'Documentation',
    },
  },

  // Custom messages
  messages: {
    type: 'Select the type of change:',
    scope: 'What is the scope of this change (optional):',
    subject: 'Write a short description:',
    body: 'Provide a longer description (optional):',
    breaking: 'List any breaking changes (optional):',
    footer: 'List any issues closed (optional):',
  },
}
```

### Pre-push Quality Gate:

```bash
# .husky/pre-push - Ensure quality before push
#!/bin/sh
echo "🧪 Running tests..."
pnpm run test || exit 1

echo "🔍 Checking coverage..."
pnpm run test:cov --passWithNoTests || exit 1

echo "🏗️  Building application..."
pnpm run build || exit 1

echo "🔒 Security audit..."
pnpm audit --audit-level high || exit 1

echo "✅ All checks passed!"
```

---

## 📚 **REFERENCE DOCUMENTATION**

### Official Documentation:

- **Conventional Commits**: https://conventionalcommits.org/
- **Commitlint**: https://commitlint.js.org/
- **Husky**: https://typicode.github.io/husky/
- **Semantic Release**: https://semantic-release.gitbook.io/

### Best Practices:

- **Angular Commit Guidelines**: https://github.com/angular/angular/blob/main/CONTRIBUTING.md
- **Google Style Guides**: https://google.github.io/styleguide/
- **Airbnb JavaScript Style Guide**: https://github.com/airbnb/javascript

### Tools & Extensions:

- **VS Code Conventional Commits**: https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits
- **GitLens**: https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens
- **GitHub CLI**: https://cli.github.com/

---

## ✅ **COMPLETION CHECKLIST**

### Basic Setup:

- [ ] Install dependencies: husky, commitlint, lint-staged
- [ ] Run `pnpm exec husky init` successfully
- [ ] Create `.husky/pre-commit` and `.husky/commit-msg` files
- [ ] Configure `.commitlintrc.js` with project-appropriate scopes
- [ ] Setup lint-staged configuration in package.json
- [ ] Configure ESLint and Prettier

### Testing:

- [ ] Test pre-commit hook runs lint/format
- [ ] Test commit-msg hook rejects invalid format
- [ ] Test commit-msg hook accepts valid format
- [ ] Test interactive commit: `pnpm run commit`
- [ ] Test push with pre-push hook (if configured)

### Team Setup:

- [ ] VS Code settings and recommended extensions
- [ ] GitHub Actions workflow configuration
- [ ] Branch protection rules
- [ ] PR template with conventional commits guidelines
- [ ] Documentation for new team members

### Advanced (Optional):

- [ ] Semantic release automation
- [ ] Custom commitizen prompts
- [ ] Quality gates in pre-push
- [ ] Monitoring and metrics tracking
- [ ] Integration with project management tools

---

## 🎉 **CONCLUSION**

This setup provides:

**✅ Immediate Benefits:**

- Consistent code quality across the team
- Readable and trackable commit history
- Automation of repetitive tasks (lint, format, test)
- Prevention of broken code entering the repository

**🚀 Long-term Benefits:**

- Automatic changelog generation from commit history
- Automated semantic versioning
- Easy debugging and rollback capabilities
- Fast onboarding for new team members
- Scalable foundation for team and project growth

**📈 Suitable For:**

- Teams of 2-20 developers
- NestJS/TypeScript projects
- Projects requiring high code quality
- Teams wanting CI/CD automation
- Long-term, maintainable projects

**Setup Time:** 30-60 minutes once, used for the lifetime of the project!

---

_🔥 This setup has been tested in real production projects and optimized for the best developer experience!_
