"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/(auth)/actions";
import { AppLink } from "@/components/app-link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
	const [state, action, isPending] = useActionState(registerAction, null);

	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-serif tracking-tight mb-2">Create Account</h1>
					<p className="text-muted-foreground">Join Sumud Scents</p>
				</div>

				<form action={action} className="space-y-4 border border-border rounded-lg p-6">
					<div>
						<label htmlFor="name" className="block text-sm font-medium mb-1.5">
							Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							required
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							placeholder="Your name"
						/>
					</div>

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
							minLength={6}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							placeholder="At least 6 characters"
						/>
					</div>

					<div>
						<label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
							Confirm Password
						</label>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type="password"
							required
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							placeholder="Confirm your password"
						/>
					</div>

					{state?.error && <p className="text-sm text-destructive">{state.error}</p>}

					<Button type="submit" disabled={isPending} className="w-full">
						{isPending ? "Creating account..." : "Create Account"}
					</Button>

					<p className="text-sm text-center text-muted-foreground">
						Already have an account?{" "}
						<AppLink href="/login" className="text-foreground hover:underline font-medium">
							Sign in
						</AppLink>
					</p>
				</form>
			</div>
		</div>
	);
}
