// import { base58 } from "@scure/base";
import { fastFetch } from "./fastapi";

export interface AccountInfo {
    email: string;
    session_key: string;
}

export interface AccountType {
    email: string;
    first_name: string;
    last_name: string | null;
    password: string;
}

export async function fetchAccountInfo(session_key: string) {
    try {
        return await fastFetch<AccountInfo>(`http://localhost:8000/auth/user?session_key=${session_key}`);
    } catch (error) {
        console.error("Cannot get account address", error);
        throw error;
    }
}

export async function fetchAccountCreate(account: AccountType) {

    try {
        const requestObject = new Request(`http://localhost:8000/auth/registration`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(account),
        });
        return await fastFetch<null>(requestObject);
    } catch (error) {
        console.error("Cannot post message", error);
        throw error;
    }
}

export async function fetchAccountAuthentication(account: {email: string; password: string;}) {
    try {
        const requestObject = new Request(`http://localhost:8000/auth/authentication`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(account),
        });
        return await fastFetch<null>(requestObject);
    } catch (error) {
        console.error("Cannot post message", error);
        throw error;
    }
}

