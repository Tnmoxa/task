import { fastFetch } from "./fastapi";
import {MessageType} from "../stores/MessageStore";

interface Messages {
    inbox: MessageType[];
    outbox: MessageType[];
}

export interface MessageSendType {
    content: string;
    recipient: string;
}

export async function fetchMessage(session_key: string){
    try {
        return await fastFetch<Messages>( `/api/message/?session_key=${session_key}`);
    } catch (error) {
        console.error("Cannot get account address", error);
        throw error;
    }
}

export async function fetchCheckMessage(message_id: number, session_key: string){
    try {
        return await fastFetch<MessageType[]>(`/api/message/change_check?message_id=${message_id}&session_key=${session_key}`);
    } catch (error) {
        console.error("Cannot get account address", error);
        throw error;
    }
}


export async function fetchMessageSend(message: MessageSendType, session_key: string) {

    try {
        const requestObject = new Request(`/api/message/?session_key=${session_key}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });
        return await fastFetch<null>(requestObject);
    } catch (error) {
        console.error("Cannot send message", error);
        throw error;
    }
}

export async function fetchMessageDelete(arr: number[], session_key: string) {

    try {
        const requestObject = new Request(`/api/message/?session_key=${session_key}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(arr),
        });
        return await fastFetch<null>(requestObject);
    } catch (error) {
        console.error("Cannot delete message", error);
        throw error;
    }
}


