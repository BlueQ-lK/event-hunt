import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '#/db'
import { user, session, account, verification } from '#/db/schema'
import { Resend } from 'resend'
import VerifyEmail from '#/components/verify-email'
import ResetPasswordEmail from '#/components/reset-password-email'

const resend = new Resend(process.env.RESEND_API_KEY)
const hasGoogleOAuth =
	!!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
    }
  }),
  emailVerification: {
    sendVerificationEmail: async ({user, url}) => {
      resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: 'Verify your email address',
        react: VerifyEmail({ verifyUrl: url })
      })
    },
    sendOnSignUp: true 
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true,
    sendResetPassword: async({user, url}) => {
      resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: 'Reset your password',
        react: ResetPasswordEmail({ resetUrl: url })
      });
    }
  },
  ...(hasGoogleOAuth
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          },
        },
      }
    : {}),
  advanced: {
    cookiePrefix: "eventhunt"
  },
  plugins: [tanstackStartCookies()],
})
