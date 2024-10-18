import { observer } from "mobx-react-lite";

import {accountStore} from "../stores";
import AccountInfo from "./AccountInfo";

const AccountStatus = observer(() => {

  const { account, error } = accountStore;

    if (account) {
        return (
        <AccountInfo account={account}>
            <p>Учетная запись пользователя активирована.</p>
        </AccountInfo>
        );
    }

    if (error) {
        return <p>Ошибка: не удалось загрузить данные учетной записи.</p>
    }

    return <p>Для того чтобы использовать это приложение, вам необходимо зарегистрироваться.</p>;
});

export default AccountStatus;

