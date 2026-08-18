import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:5000" // Backend port
});

export const { signIn, signUp, useSession } = authClient;
