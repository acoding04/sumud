"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/actions";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
	const [state, action, isPending] = useActionState(loginAction, null);

	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-serif tracking-tight mb-2">Welcome Back</h1>
					<p className="text-muted-foreground">Sign in to your account</p>
				</div>

				<form action={action} className="space-y-4 border border-border rounded-lg p-6">
					<div>
						<label htmlFor="email" className="block text-sm font-medium mb-1.5">
							Email
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							placeholder="you@example.com"
						/>
					</div>

					<div>
						<label htmlFor="password" className="block text-sm font-medium mb-1.5">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							placeholder="Enter your password"
						/>
					</div>

					{state?.error && <p className="text-sm text-destructive">{state.error}</p>}

					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? "Signing in..." : "Sign In"}
					</Button>

					<p className="text-sm text-center text-muted-foreground">
						Don&apos;t have an account?{" "}
						<AppLink href="/register" className="text-foreground hover:underline font-medium">
							Create one
						</AppLink>
					</p>

					<div className="border-t border-border pt-4 mt-4">
						<p className="text-xs text-muted-foreground text-center">
							Demo account: <span className="font-mono">demo@sumud.com</span> /{" "}
							<span className="font-mono">demo123</span>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
