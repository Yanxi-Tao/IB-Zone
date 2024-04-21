import { PostType } from '@prisma/client'
import { z } from 'zod'

export const SettingsSchema = z
  .object({
    name: z.optional(
      z
        .string()
        .min(1, { message: 'Name is required' })
        .max(15, { message: 'Name is too long' })
    ),
    email: z.optional(z.string().email({ message: 'Email is required' })),
    oldPassword: z.optional(z.string()),
    newPassword: z.optional(z.string()),
  })
  .refine(
    (data) => {
      if (data.oldPassword && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.oldPassword) {
        return false
      }

      return true
    },
    {
      message: 'Password is required!',
      path: ['password'],
    }
  )

export const ResetSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
})

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(3, { message: 'Password is required' }),
    confirmPassword: z.string().min(3, { message: 'Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(3, { message: 'Password is required' }),
})

export const RegisterSchema = z
  .object({
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(3, { message: 'Password is required' }),
    confirmPassword: z.string().min(3, { message: 'Password is required' }),
    name: z
      .string()
      .min(1, { message: 'Name is required' })
      .max(15, { message: 'Name is too long' }),
    code: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const CreatePostSchema = z.object({
  title: z.string().min(1).max(255),
  type: z.nativeEnum(PostType),
  content: z.string().min(1, { message: 'Required' }),
  parentId: z.optional(z.string()),
  communitySlug: z.optional(z.string()),
})

export const UpdatePostSchema = z.object({
  postId: z.string().cuid(),
  title: z.string().min(1).max(255),
  content: z.string().min(1, { message: 'Required' }),
  pathname: z.string(),
})

export const CreateCommentSchema = z.object({
  content: z.string().min(1, { message: 'Required' }),
  postId: z.optional(z.string()),
  parentId: z.optional(z.string()),
  repliesToId: z.optional(z.string()),
  repliesToName: z.optional(z.string()),
  repliesToSlug: z.optional(z.string()),
})

export const CreateCommunitySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(255),
  isPublic: z.boolean(),
})

export const UpdateCommunitySchema = z.object({
  id: z.string().cuid(),
  name: z.optional(z.string().min(1).max(100)),
  description: z.optional(z.string().min(1).max(255)),
  isPublic: z.optional(z.boolean()),
})

export const UpdateProfileSchema = z.object({
  bio: z.optional(z.string().max(100)),
})
