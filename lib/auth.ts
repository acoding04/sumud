import { cookies } from "next/headers";

const SESSION_COOKIE = "sumud_session";

type User = {
	id: string;
	name: string;
	email: string;
	password: string;
};

type Session = {
	userId: string;
	createdAt: string;
};

type AuthStore = {
	users: Map<string, User>;
	sessions: Map<string, Session>;
	userCounter: number;
};

function createAuthStore(): AuthStore {
	const store: AuthStore = {
		users: new Map(),
		sessions: new Map(),
		userCounter: 0,
	};
	const demoUser: User = {
		id: "u-1",
		name: "Demo User",
		email: "demo@sumud.com",
		password: "demo123",
	};
	store.users.set(demoUser.id, demoUser);
	store.userCounter = 1;
	return store;
}

const globalForAuth = globalThis as unknown as { __sumudAuth?: AuthStore };
if (!globalForAuth.__sumudAuth) {
	globalForAuth.__sumudAuth = createAuthStore();
}
const store = globalForAuth.__sumudAuth;

export function createUser(name: string, email: string, password: string): User | null {
	const existing = Array.from(store.users.values()).find(
		(u) => u.email.toLowerCase() === email.toLowerCase(),
	);
	if (existing) return null;

	const user: User = {
		id: `u-${++store.userCounter}`,
		name,
		email: email.toLowerCase(),
		password,
	};
	store.users.set(user.id, user);
	return user;
}

export function authenticateUser(email: string, password: string): User | null {
	const user = Array.from(store.users.values()).find(
		(u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
	);
	return user ?? null;
}

export function createSession(userId: string): string {
	const sessionId = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	store.sessions.set(sessionId, { userId, createdAt: new Date().toISOString() });
	return sessionId;
}

export function getSessionData(sessionId: string): Session | null {
	return store.sessions.get(sessionId) ?? null;
}

export function deleteSession(sessionId: string) {
	store.sessions.delete(sessionId);
}

export function getUserById(id: string): Omit<User, "password"> | null {
	const user = store.users.get(id);
	if (!user) return null;
	return { id: user.id, name: user.name, email: user.email };
}

export async function setSessionCookie(sessionId: string) {
	try {
		(await cookies()).set(SESSION_COOKIE, sessionId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7,
		});
	} catch (error) {
		console.error("Failed to set session cookie", error);
	}
}

export async function clearSessionCookie() {
	try {
		(await cookies()).delete(SESSION_COOKIE);
	} catch (error) {
		console.error("Failed to clear session cookie", error);
	}
}

export async function getCurrentUser(): Promise<Omit<User, "password"> | null> {
	const sessionId = (await cookies()).get(SESSION_COOKIE)?.value;
	if (!sessionId) return null;
	const session = getSessionData(sessionId);
	if (!session) return null;
	return getUserById(session.userId);
}

export async function getSessionId(): Promise<string | null> {
	return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}
