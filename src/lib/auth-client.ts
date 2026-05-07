import { createAuthClient } from "better-auth/react"

const runtimeOrigin =
	typeof window !== "undefined" ? window.location.origin : undefined;

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_APP_URL ?? runtimeOrigin,
})

export const { signIn, signUp, requestPasswordReset, resetPassword, changePassword, sendVerificationEmail, signOut } = authClient;