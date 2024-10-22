import { action, makeObservable, observable, runInAction } from "mobx";

import {
    fetchCheckMessage,
    fetchMessage, fetchMessageDelete,
    fetchMessageSend,
} from "../modules/message";

export interface MessageType {
    id: number;
    content: string;
    timestamp: string;
    companion: string;
    checked:boolean
}

/// Интерфейс хранилища акаунта
export interface MessageStore {
    inbox?: MessageType[];
    outbox?: MessageType[];
    error?: unknown;

    sendMessage(recipient: string, messageContent: string): Promise<void>;

    checkMessage(id: number):Promise<void>;

    deleteMessage(arr: number[]):Promise<void>;
}

/// Реализация хранилища акаунта
class _MessageStore implements MessageStore {
    inbox: MessageType[]  = [];
    outbox: MessageType[] = [];
    error: unknown = undefined;

    constructor() {
        makeObservable(this, {
            inbox: observable,
            outbox: observable,
            error: observable,
            update: action.bound,
            deleteMessage: action.bound,
            sendMessage: action.bound,
            checkMessage: action.bound,
        });
    }


    async deleteMessage(arr: number[]) {
        try {
            const session = localStorage.getItem("session");
            if (session) {
                const { email, session_key } = JSON.parse(session);
                await fetchMessageDelete(arr, session_key)
                this.update().then();
            }

        } catch (error) {
            console.error("Cannot send message", error);
            throw error;
        }
        this.update().then();
    }


    async sendMessage(content: string, recipient: string) {
        try {
            const session = localStorage.getItem("session");
            if (session) {
                const { email, session_key } = JSON.parse(session);
                await fetchMessageSend({content, recipient}, session_key)
                this.update().then();
            }

        } catch (error) {
            console.error("Cannot send message", error);
            throw error;
        }
        this.update().then();
    }

    async checkMessage(id: number) {
        try {
            const session = localStorage.getItem("session");
            if (session) {
                const { email, session_key } = JSON.parse(session);
                await fetchCheckMessage(id, session_key);
                this.update().then();
            }
        } catch (error) {
            console.error("Cannot check message", error);
            throw error;
        }
        this.update().then()

    }

    async update() {
        let inbox: MessageType[] = [];
        let outbox: MessageType[] = [];
        const session = localStorage.getItem("session");
        if (session) {
            try {
                const { email, session_key } = JSON.parse(session);
                const res = await fetchMessage(session_key);
                inbox = res.inbox
                outbox = res.outbox

            } catch (error) {
                // @ts-ignore
                if (error.status !== 404)
                    runInAction(() => {
                        this.error = error;
                    });
            }
        }
        runInAction(() => {
            this.inbox = inbox;
            this.outbox = outbox;
            this.error = undefined;
        });
    }
}

export default _MessageStore;
