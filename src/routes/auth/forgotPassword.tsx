import { Button } from '#/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card';
import { Input } from '#/components/ui/input';
import { Label } from '#/components/ui/label';
import { requestPasswordReset } from '#/lib/auth-client';
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { useState } from "react";
import { forgotPasswordSchema } from "#/lib/validations/auth";
import { useForm } from '@tanstack/react-form';

export const Route = createFileRoute('/auth/forgotPassword')({
  component: RouteComponent,
})

function RouteComponent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const form = useForm({
        defaultValues: {
            email: "",
        },
        onSubmit: async ({ value }) => {
            setLoading(true);
            setError(null);
            try {
                const { error } = await requestPasswordReset({
                    email: value.email,
                    redirectTo: "/auth/resetPassword",
                });
                
                if (error) {
                    setError("Failed to send reset link. Please try again.");
                } else {
                    setSuccess(true);
                }
            } catch (err) {
                setError("An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        },
    });

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 gap-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-primary/10 rounded-full">
                                <MailCheck className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
                        <CardDescription>
                            We've sent a password reset link to your email address.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            If you don't see it, please check your spam folder.
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button variant="outline" asChild className="w-full">
                            <Link to="/auth/signIn">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 gap-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
                            {error}
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
                            name="email"
                            validators={{
                                onChange: ({ value }) => {
                                    const result = forgotPasswordSchema.shape.email.safeParse(value);
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
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Send Reset Link
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Link to="/auth/signIn" className="text-sm text-primary hover:underline flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Sign In
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
