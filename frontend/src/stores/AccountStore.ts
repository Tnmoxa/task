import { action, makeObservable, observable, runInAction } from "mobx";

import {
  AccountInfo,
  fetchAccountInfo,
  fetchAccountCreate,
  fetchAccountAuthentication,
  fetchAccountDelete
} from "../modules/account";

export type { AccountInfo };

/// Интерфейс хранилища акаунта
export interface AccountStore {
  account?: AccountInfo;
  error?: unknown;

  /// Регистрация
  signUp(email: string, first_name: string, tg_id: string | '', password: string): Promise<void>;


  /// Логин
  signIn(email:string, password: string): Promise<void>;

  /// Разлогин
  signOff(): void;

  //Проверка сессии
  checkAccount():void
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
      checkAccount:action.bound
    });
  }

  async signUp(email: string, first_name: string, tg_id: string | '', password: string) {
    try {
      fetchAccountCreate({email, first_name, tg_id, password}).then(() => {
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
        this.update().then();
      });
    } catch (error) {
      console.error("Cannot signin account", error);
      throw error;
    }
    this.update().then();
  }

  signOff() {
    try {
      const session = sessionStorage.getItem("session");
      if (session) {
        const { email, session_key } = JSON.parse(session);
        fetchAccountDelete(session_key).then((res: any) => {
          sessionStorage.removeItem("session");
          this.update().then();
        });
      } else {
        console.warn("No session found during signOff");
      }
    } catch (error) {
      console.error("Cannot sign off account", error);
      throw error;
    }
    this.update().then();
  }

  checkAccount(){
    try {
      const session = sessionStorage.getItem("session");
      if (session) {
        const { email, session_key } = JSON.parse(session);
        fetchAccountInfo(session_key).then()
      } else {
        console.warn("No session found during signOff");
      }
    } catch (error) {
      console.error("Cannot sign off account", error);
      this.signOff()
      throw error;
    }
    this.update().then();
  }

  async update() {
    const session = sessionStorage.getItem("session");
    if (session) {
      try {
        const account = JSON.parse(session)
        runInAction(() => {
          this.account = account;
        })
      } catch (error) {
        // @ts-ignore
        if (error.status != 404)
          this.signOff()
          runInAction(() => {
            this.error = error;
          });
      }
    } else {
      this.account = undefined
    }
    runInAction(() => {
      this.error = undefined;
    });
  }
}

export default _AccountStore;
