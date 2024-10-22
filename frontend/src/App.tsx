import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ResponsiveAppBar from "./components/Navbar";
import {rootStore, accountStore, messageStore} from "./stores";
import { observer } from "mobx-react-lite";
import AccountStatus from "./components/AccountStatus";
import RegistrationPage from "./components/RegistrationPage";
import AuthorizationPage from "./components/AuthorizationPage";
import MailPage from "./components/MailPage";
import {fetchAccountDelete} from "./modules/account";

const App = observer(() => {
    const {account, update} = accountStore
    // update().then()
    useEffect(() => {
        // let isReloading = false;
        //
        // const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        //     if (!isReloading) {
        //         const session = sessionStorage.getItem("session");
        //         if (session) {
        //             fetchAccountDelete(session).then()
        //         }}
        // };
        // const handleReload = () => {
        //     isReloading = true;
        // };
        //
        // window.addEventListener('beforeunload', handleBeforeUnload);
        // window.addEventListener('unload', handleBeforeUnload);
        // window.addEventListener('pagehide', handleReload);
        //

        rootStore.startUpdating();
        return () => {
            rootStore.stopUpdating();
            // window.removeEventListener('beforeunload', handleBeforeUnload);
            // window.removeEventListener('unload', handleBeforeUnload);
            // window.removeEventListener('pagehide', handleReload);
        };
    }, []);

    return (
    <div>
        <Router>
            <ResponsiveAppBar/>
            <AccountStatus />
            <Routes>
                {account?(<Route path="/sign-up" element={<MailPage />} />):(<Route path="/sign-up" element={<RegistrationPage />} />)}
                {account?(<Route path="/sign-in" element={<MailPage />} />):(<Route path="/sign-in" element={<AuthorizationPage />} />)}
                {account?(<Route path="/mail" element={<MailPage />} />):(<Route path="/mail" element={<AuthorizationPage />} />)}
                {account?(<Route path="/" element={<MailPage />} />):(<Route path="/" element={<AuthorizationPage />} />)}
                <Route path="*" element={<Navigate to={account ? "/mail" : "/sign-in"} />} />
            </Routes>
        </Router>
    </div>
  );
})

export default App;
