# User Images Utility

## Table of Contents

- [User Images Utility](#user-images-utility)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Basic Usage](#basic-usage)
    - [Advanced Usage](#advanced-usage)
    - [Available Functions](#available-functions)
      - [Core Functions](#core-functions)
      - [Avatar Generators](#avatar-generators)
      - [Cover Generators](#cover-generators)
      - [Utility Functions](#utility-functions)
  - [Avatar Generators](#avatar-generators-1)
    - [DiceBear Avatars](#dicebear-avatars)
    - [UI Avatars](#ui-avatars)
    - [Robohash Avatars](#robohash-avatars)
  - [Cover Generators](#cover-generators-1)
    - [Picsum Covers](#picsum-covers)
    - [Gradient Covers](#gradient-covers)
    - [Unsplash Covers](#unsplash-covers)
  - [Validation](#validation)
  - [Frontend Utilities](#frontend-utilities)
    - [Responsive Images](#responsive-images)
    - [Image Fallbacks](#image-fallbacks)
  - [Best Practices](#best-practices)
  - [Examples](#examples)
    - [Complete User Registration Flow](#complete-user-registration-flow)
    - [User Profile Customization](#user-profile-customization)

## Overview

The User Images Utility is a comprehensive solution for generating, validating, and managing user avatars and cover images in your e-commerce application. This utility provides reliable generation of avatars and cover images through multiple fallback strategies, ensuring users always have visually appealing profile images even when external services are unavailable.

## Features

- **Multiple Avatar Types**: Generate avatars from DiceBear, UI Avatars, and Robohash
- **Multiple Cover Types**: Generate covers from Picsum Photos, Unsplash, and SVG gradients
- **Consistent Generation**: Same inputs will generate the same images (deterministic)
- **Automatic Fallbacks**: If one service is down, automatically uses the next one
- **Validation**: URL validation to ensure images are accessible
- **Frontend Utilities**: Helpers for responsive images and fallback management

## Installation

No installation required. The utility is already included in your project.

## Usage

### Basic Usage

To generate both avatar and cover images for a user:

```typescript
import { generateUserImages } from 'src/common/utils/user-images.util'

// In your user service or controller
const userId = 123
const userName = 'Nguyen Phuc'

// Generate avatar and cover
const userImages = await generateUserImages(userId, userName)

// Save to user profile
user.avatar = userImages.avatar
user.cover = userImages.cover
```

### Advanced Usage

Generate images with custom configuration:

```typescript
import { generateUserImages } from 'src/common/utils/user-images.util'

const config = {
  avatar: {
    size: 512,
    style: 'avataaars', // Specific DiceBear style
  },
  cover: {
    width: 1200,
    height: 400,
  },
  validation: {
    timeout: 5000,
    retries: 3,
  },
  generateOptions: true, // Generate options for user selection
}

const userImages = await generateUserImages(userId, userName, config)

// Access primary images
console.log(userImages.avatar)
console.log(userImages.cover)

// Access fallbacks
console.log(userImages.avatarFallbacks)
console.log(userImages.coverFallbacks)

// Access options (if generateOptions was true)
console.log(userImages.avatarOptions)
console.log(userImages.coverOptions)
```

### Available Functions

#### Core Functions

1. **`generateUserImages`**: Main function to generate avatar and cover with fallbacks
2. **`generateAvatarOptions`**: Generate multiple avatar options for user selection
3. **`generateCoverOptions`**: Generate multiple cover options for user selection

#### Avatar Generators

1. **`generateDiceBearAvatar`**: Generate avatar from DiceBear service
2. **`generateUIAvatar`**: Generate text-based avatar from UI Avatars
3. **`generateRobohashAvatar`**: Generate robot avatar from Robohash

#### Cover Generators

1. **`generatePicsumCover`**: Generate cover from Picsum Photos
2. **`generateGradientCover`**: Generate SVG gradient cover (works offline)
3. **`generateUnsplashCover`**: Generate cover from Unsplash

#### Utility Functions

1. **`generateSeed`**: Create a deterministic seed based on user information
2. **`pickBySeed`**: Pick an item from array based on seed
3. **`getInitials`**: Extract initials from user's name
4. **`formatName`**: Format user's name for URL use
5. **`getResponsiveImageUrl`**: Create responsive image URLs for different screen sizes
6. **`createImageWithFallback`**: Helper for implementing fallback strategy in frontend

## Avatar Generators

### DiceBear Avatars

[DiceBear](https://dicebear.com/) is the primary avatar source, providing high-quality SVG avatars in multiple styles:

```typescript
import { generateDiceBearAvatar } from 'src/common/utils/user-images.util'

// Generate avatar
const avatar = generateDiceBearAvatar(userId, userName, {
  size: 512,
  style: 'avataaars', // Optional style override
})

console.log(avatar.url) // Use this URL
```

Available styles: 'avataaars', 'big-ears', 'bottts', 'pixel-art', 'identicon', etc.

### UI Avatars

Text-based avatars showing user initials:

```typescript
import { generateUIAvatar } from 'src/common/utils/user-images.util'

// Generate avatar with user's initials
const avatar = generateUIAvatar('Nguyen Phuc', {
  size: 512,
  rounded: true,
  bold: true,
})
```

### Robohash Avatars

Robot-themed avatars:

```typescript
import { generateRobohashAvatar } from 'src/common/utils/user-images.util'

const avatar = generateRobohashAvatar(userId, userName, { size: 512 })
```

## Cover Generators

### Picsum Covers

Nature photos from [Lorem Picsum](https://picsum.photos/):

```typescript
import { generatePicsumCover } from 'src/common/utils/user-images.util'

const cover = generatePicsumCover(userId, { width: 1200, height: 400 })
```

### Gradient Covers

Beautiful SVG gradients that work offline:

```typescript
import { generateGradientCover } from 'src/common/utils/user-images.util'

const cover = generateGradientCover(userId, { width: 1200, height: 400 })
```

### Unsplash Covers

Themed photos from [Unsplash](https://unsplash.com/):

```typescript
import { generateUnsplashCover } from 'src/common/utils/user-images.util'

const cover = generateUnsplashCover(userId, { width: 1200, height: 400 })
```

## Validation

The utility includes validation to ensure generated image URLs are accessible:

```typescript
import { validateImageUrl } from 'src/common/utils/user-images.util'

const isValid = await validateImageUrl(imageUrl, {
  timeout: 5000,
  retries: 2,
  validateContentType: true,
})
```

## Frontend Utilities

### Responsive Images

Create responsive versions of images:

```typescript
import { getResponsiveImageUrl } from 'src/common/utils/user-images.util'

// Original URL -> Small version for mobile
const smallAvatar = getResponsiveImageUrl(user.avatar, IMAGE_SOURCES.DICEBEAR, 'sm')
const mediumCover = getResponsiveImageUrl(user.cover, IMAGE_SOURCES.PICSUM, 'md')
```

### Image Fallbacks

Implement fallback strategy in frontend components:

```typescript
import { createImageWithFallback } from 'src/common/utils/user-images.util';

// In React component
const imgProps = createImageWithFallback(
  user.avatar,
  user.avatarFallbacks,
  (error) => console.error('All fallbacks failed', error)
);

return <img {...imgProps} alt="User avatar" />;
```

## Best Practices

1. **Generate on Registration**: Create images when users register
2. **Store URLs**: Save the generated URLs to your database
3. **Use Fallbacks**: Always implement the fallback mechanism in the frontend
4. **Responsive Images**: Use appropriate sizes for different screen sizes
5. **Provide Options**: Let users choose from multiple generated options
6. **Local Backups**: Consider the SVG-based options as reliable fallbacks

## Examples

### Complete User Registration Flow

```typescript
import { generateUserImages } from 'src/common/utils/user-images.util'

async function registerUser(userData) {
  // Generate images
  const userImages = await generateUserImages(
    userData.email, // Use email as identifier before user has an ID
    userData.name,
    { generateOptions: false },
  )

  // Create user with generated images
  const newUser = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      avatar: userImages.avatar,
      cover: userImages.cover,
      avatarFallbacks: JSON.stringify(userImages.avatarFallbacks),
      coverFallbacks: JSON.stringify(userImages.coverFallbacks),
    },
  })

  return newUser
}
```

### User Profile Customization

```typescript
import { generateAvatarOptions, generateCoverOptions } from 'src/common/utils/user-images.util'

async function getProfileCustomizationOptions(userId, userName) {
  // Generate options in parallel
  const [avatarOptions, coverOptions] = await Promise.all([
    generateAvatarOptions(userId, userName, { size: 512 }, 12),
    generateCoverOptions(userId, { width: 1200, height: 400 }, 9),
  ])

  return {
    avatarOptions,
    coverOptions,
  }
}
```
