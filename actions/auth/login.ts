'use server'

import { z } from 'zod'
import { signIn } from '@/auth'
import { LoginSchema } from '@/schemas'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { getUserByEmail } from '@/db/user'

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data)

  if (!validatedData.success) {
    return { type: 'error', message: 'Invalid data' }
  }

  const { email, password } = validatedData.data

  const checkUser = await getUserByEmail(email)

  if (!checkUser || !checkUser.email || !checkUser.password) {
    return { type: 'error', message: 'Invalid credentials' }
  }

  if (!checkUser.emailVerified) {
    return { type: 'error', message: 'Email not verified' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { type: 'error', message: 'Invalid credentials' }
        case 'AuthorizedCallbackError':
          return { type: 'error', message: 'Authorization failed' }
        default:
          return { type: 'error', message: 'An error occurred' }
      }
    }

    throw error
  }
}
