import { fastFetch } from "./fastapi";

export interface AccountInfo {
    email: string;
    session_key: string;
}

export interface AccountType {
    email: string;
    first_name: string;
    tg_id: string | null;
    password: string;
}

export async function fetchAccountInfo(session_key: string) {
    try {
        const requestObject = new Request(`/api/auth/user?session_key=${session_key}`, {
            method: "GET",
        });
        return await fastFetch<AccountInfo>(requestObject);

    } catch (error) {
        console.error("Cannot get account address", error);
        throw error;
    }
}
export async function fetchAccountCreate(account: AccountType) {
    try {
        const requestObject = new Request('/api/auth/registration', {
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
        const requestObject = new Request('/api/auth/authentication', {
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

export async function fetchAccountDelete(session_key: string) {

    try {
        const requestObject = new Request(`/api/auth/exit?session_key=${session_key}`, {
            method: "DELETE",
        });
        return await fastFetch<AccountInfo>(requestObject);

    } catch (error) {
        console.error("Cannot get account address", error);
        throw error;
    }
}

