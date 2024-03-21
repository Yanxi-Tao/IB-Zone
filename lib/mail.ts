import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'IBZN - Verify your email',
    html: `<p>Your token is: <strong>${token}</strong></p>`,
  })
}

export const sendPasswordResetTokenEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'IBZN - Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
  })
}
