"use server";

import { redirect } from "next/navigation";
import {
	authenticateUser,
	clearSessionCookie,
	createSession,
	createUser,
	deleteSession,
	getSessionId,
	setSessionCookie,
} from "@/lib/auth";

type AuthState = {
	success: boolean;
	error?: string;
} | null;

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
	const email = formData.get("email");
	const password = formData.get("password");

	if (!email || typeof email !== "string" || !email.trim()) {
		return { success: false, error: "Please enter your email." };
	}
	if (!password || typeof password !== "string") {
		return { success: false, error: "Please enter your password." };
	}

	const user = authenticateUser(email.trim(), password);
	if (!user) {
		return { success: false, error: "Invalid email or password." };
	}

	const sessionId = createSession(user.id);
	await setSessionCookie(sessionId);
	redirect("/account");
}

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
	const name = formData.get("name");
	const email = formData.get("email");
	const password = formData.get("password");
	const confirmPassword = formData.get("confirmPassword");

	if (!name || typeof name !== "string" || !name.trim()) {
		return { success: false, error: "Please enter your name." };
	}
	if (!email || typeof email !== "string" || !email.trim()) {
		return { success: false, error: "Please enter your email." };
	}
	if (!password || typeof password !== "string" || password.length < 6) {
		return { success: false, error: "Password must be at least 6 characters." };
	}
	if (password !== confirmPassword) {
		return { success: false, error: "Passwords do not match." };
	}

	const user = createUser(name.trim(), email.trim(), password);
	if (!user) {
		return { success: false, error: "An account with this email already exists." };
	}

	const sessionId = createSession(user.id);
	await setSessionCookie(sessionId);
	redirect("/account");
}

export async function logoutAction() {
	const sessionId = await getSessionId();
	if (sessionId) {
		deleteSession(sessionId);
		await clearSessionCookie();
	}
	redirect("/");
}
