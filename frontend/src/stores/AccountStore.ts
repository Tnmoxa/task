import { action, makeObservable, observable, runInAction } from "mobx";

import {AccountInfo, fetchAccountInfo, fetchAccountCreate, fetchAccountAuthentication} from "../modules/account";

export type { AccountInfo };

/// Интерфейс хранилища акаунта
export interface AccountStore {
  account?: AccountInfo;
  error?: unknown;

  /// Регистрация
  signUp(email: string, first_name: string, last_name: string | '', password: string): Promise<void>;


  /// Логин
  signIn(email:string, password: string): Promise<void>;

  /// Разлогин
  signOff(): void;
}

/// Реализация хранилища акаунта
class _AccountStore implements AccountStore {
  account: AccountInfo | undefined = undefined;
  error: unknown = undefined;

  constructor() {
    makeObservable(this, {
      account: observable,
      error: observable,
      update: action.bound,
      signOff: action.bound,
      signUp: action.bound,
      signIn: action.bound,
    });
  }

  async signUp(email: string, first_name: string, last_name: string | '', password: string) {
    try {
      fetchAccountCreate({email, first_name, last_name, password}).then(() => {
        this.signIn(email, password);
      });
    } catch (error) {
      console.error("Cannot signup account", error);
      throw error;
    }
    this.update().then();
  }

  async signIn(email:string, password: string) {
    try {
      fetchAccountAuthentication({email, password}).then((res: any) => {
        sessionStorage.setItem("session", JSON.stringify({ email: email, session_key: res.session_key }));
      });
    } catch (error) {
      console.error("Cannot signin account", error);
      throw error;
    }
    this.update().then();
  }

  signOff() {
    sessionStorage.removeItem("session");
    this.update().then();
  }

  async update() {
    let account: AccountInfo | undefined = undefined;
    const session = sessionStorage.getItem("session");
    if (session) {
      try {
        const { email, session_key } = JSON.parse(session);
        account = { email, session_key };
        await fetchAccountInfo(session_key);
      } catch (error) {
        // @ts-ignore
        if (error.status != 404)
          runInAction(() => {
            this.error = error;
          });
      }
    }
    runInAction(() => {
      this.account = account;
      this.error = undefined;
    });
  }
}

export default _AccountStore;
