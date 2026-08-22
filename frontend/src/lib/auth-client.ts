import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL || "https://d2b-auth-backend.vercel.app",
    fetchOptions: {
        credentials: "include",
    },
});

export const { signIn, signUp, useSession, signOut } = authClient;
