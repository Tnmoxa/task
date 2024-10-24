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
        const requestObject = new Request(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL  + `/api/auth/user?session_key=${session_key}` : `/api/auth/user?session_key=${session_key}`, {
            method: "GET",
        });
        return await fastFetch<AccountInfo>(requestObject);

    } catch (error) {
        console.error("Cannot get account address", error);
        throw error;
    }
}

export async function fetchAccounts(){
    try {
        return await fastFetch<{email:string}[]>(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL  + `/api/auth/get_users` :  `/api/auth/get_users`);
    } catch (error) {
        console.error("Cannot get account list", error);
        throw error;
    }
}

export async function fetchAccountCreate(account: AccountType) {
    try {
        const requestObject = new Request(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL  + `/api/auth/registration` : '/api/auth/registration', {
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
        const requestObject = new Request(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL  + `/api/auth/authentication` : '/api/auth/authentication', {
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
        const requestObject = new Request(process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL  + `/api/auth/exit?session_key=${session_key}` : `/api/auth/exit?session_key=${session_key}`, {
            method: "DELETE",
        });
        return await fastFetch<AccountInfo>(requestObject);

    } catch (error) {
        console.error("Cannot get account address", error);
        throw error;
    }
}

