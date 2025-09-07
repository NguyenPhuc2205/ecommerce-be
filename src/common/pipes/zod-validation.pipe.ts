import { UnprocessableEntityException } from '@nestjs/common'
import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod'
import { $ZodIssue, $ZodError } from 'zod/v4/core'

export const CustomZodValidationPipe: typeof ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: $ZodError) => {
    const formattedZodErrors = error.issues.map((issue: $ZodIssue) => ({
      ...issue,
      path: issue.path.join('.'),
    }))

    console.log('Errors: ', error)
    return new UnprocessableEntityException(formattedZodErrors)
  },
})
