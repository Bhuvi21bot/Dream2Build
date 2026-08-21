import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_BETTER_AUTH_URL || "http://localhost:5000",
    fetchOptions: {
        credentials: "include",
    },
});

export const { signIn, signUp, useSession, signOut } = authClient;
