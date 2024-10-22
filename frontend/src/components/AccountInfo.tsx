import { AccountInfo } from "../modules/account";
import { PropsWithChildren } from "react";
import {observer} from "mobx-react-lite";

type Props = PropsWithChildren<{ account: AccountInfo }>;
///
const _AccountInfo = observer(({ account, children }: Props) => {
  return (
    <div className="flex flex-col gap-y-1">
      {children && (
        <>
          <div>{children}</div>
          <hr />
        </>
      )}
      <div className="grid grid-cols-[auto_1fr_auto] py-2 gap-x-2 text-sm">
        <div>Имя</div>
        <div className="col-span-2 text-right">{account.email}</div>
      </div>
    </div>
  );
});

export default _AccountInfo;
