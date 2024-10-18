import AccountStore from "./AccountStore";
import MessageStore from "./MessageStore";

/// Корневое хранилище состояний
export default class RootStore {
  public readonly accountStore: AccountStore;
  public readonly messageStore: MessageStore;

  constructor() {
    this.accountStore = new AccountStore();
    this.messageStore = new MessageStore();
  }

  private _sih: any = [];

  startUpdating(): void {
      this._sih.push(setInterval(() => this.accountStore.update(), 5000));
      this._sih.push(setInterval(() => this.messageStore.update(), 1000));
    }

  stopUpdating(): void {
    this._sih.forEach((handler: any) => clearInterval(handler));
    this._sih = [];
  }

}
