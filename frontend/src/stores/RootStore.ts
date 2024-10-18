import AccountStore from "./AccountStore";

/// Корневое хранилище состояний
export default class RootStore {
  public readonly accountStore: AccountStore;

  constructor() {
    this.accountStore = new AccountStore();
  }

  private _sih: any = [];

  startUpdating(): void {
    this.accountStore.update().then(() => this._sih.push(setInterval(() => this.accountStore.update(), 5000)));
  }

  stopUpdating(): void {
    this._sih.map((handler: string | number | NodeJS.Timeout | undefined) => clearInterval(handler));
    this._sih = [];
  }
}
