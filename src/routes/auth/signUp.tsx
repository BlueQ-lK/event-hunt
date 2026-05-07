import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { signUpSchema } from "@/lib/validations/auth";

export const Route = createFileRoute('/auth/signUp')({
  component: RouteComponent,
})

function RouteComponent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            setError(null);
            setSuccess(null);
            try {
                const { error } = await signUp.email({
                    email: value.email,
                    password: value.password,
                    name: value.name,
                    callbackURL: "/",
                });
                if (error) {
                    setError(error.message ?? "Sign up failed. Please try again.");
                    return;
                }
                setSuccess("Account created. Please verify your email before signing in.");
            } catch (err) {
                setError("An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 gap-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                    <CardDescription className="text-center">Join EventHunt and start discovering amazing events</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
                            {success}
                        </div>
                    )}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            form.handleSubmit();
                        }}
                        className="space-y-4"
                    >
                        <form.Field
                            name="name"
                            validators={{
                                onChange: ({ value }) => {
                                    const result = signUpSchema.shape.name.safeParse(value);
                                    return result.success ? undefined : result.error.issues[0].message;
                                }
                            }}
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                                    )}
                                </div>
                            )}
                        />
                        <form.Field
                            name="email"
                            validators={{
                                onChange: ({ value }) => {
                                    const result = signUpSchema.shape.email.safeParse(value);
                                    return result.success ? undefined : result.error.issues[0].message;
                                }
                            }}
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                                    )}
                                </div>
                            )}
                        />
                        <form.Field
                            name="password"
                            validators={{
                                onChange: ({ value }) => {
                                    const result = signUpSchema.shape.password.safeParse(value);
                                    return result.success ? undefined : result.error.issues[0].message;
                                }
                            }}
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                                    )}
                                </div>
                            )}
                        />
                        <form.Field
                            name="confirmPassword"
                            validators={{
                                onChange: ({ value, fieldApi }) => {
                                    if (value !== fieldApi.form.getFieldValue('password')) {
                                        return "Passwords do not match";
                                    }
                                    return undefined;
                                }
                            }}
                            children={(field) => (
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                                        <p className="text-sm text-destructive">{field.state.meta.errors.join(", ")}</p>
                                    )}
                                </div>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sign Up
                        </Button>
                    </form>
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full"
                        onClick={async () => {
                            setLoading(true);
                            setError(null);
                            try {
                                const { error } = await signIn.social({
                                    provider: "google",
                                    callbackURL: "/",
                                });
                                if (error) {
                                    setError(error.message ?? "Google sign-in failed.");
                                }
                            } catch {
                                setError("Google sign-in is not available right now.");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg>
                        Google
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/auth/signIn" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
            <p className="px-8 text-center text-sm text-muted-foreground">
                By registering, you agree to our{" "}
                <Link
                    to="/"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                    to="/"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Privacy Policy
                </Link>
                .
            </p>
        </div>
    )
}

