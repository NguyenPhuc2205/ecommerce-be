module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // Build system or external dependencies
        'chore', // Maintain, release tasks
        'ci', // CI/CD configuration
        'docs', // Documentation
        'feat', // New features
        'fix', // Bug fixes
        'perf', // Performance improvements
        'refactor', // Code refactoring
        'revert', // Revert commits
        'style', // Code style (formatting, missing semi colons, etc)
        'test', // Tests
      ],
    ],

    'scope-enum': [
      2,
      'always',
      [
        // Business Modules
        'auth', // Authentication & Authorization
        'configuration', // App configuration module
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
        'shared', // Shared Nest modules

        // Technical Layers
        'api', // API layer
        'database', // Database operations
        'config', // Configuration
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
        'dto', // Data transfer objects
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

        // Other
        'seeder',
        'migration',
        'common',
      ],
    ],

    // Rules configuration
    'scope-empty': [0], // Allow empty scope
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-max-length': [2, 'always', 100],
    'subject-min-length': [2, 'always', 10],
    'header-max-length': [2, 'always', 120],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 150],
    'footer-leading-blank': [2, 'always'],
  },
}
