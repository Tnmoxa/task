import React, {useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResponsiveAppBar from "./components/Navbar";
import {rootStore, accountStore} from "./stores";
import { observer } from "mobx-react-lite";
import AccountStatus from "./components/AccountStatus";
import RegistrationPage from "./components/RegistrationPage";
import AuthorizationPage from "./components/AuthorizationPage";

const App = observer(() => {
    const {account} = accountStore
    console.log(account)

    useEffect(() => {
        rootStore.startUpdating();
        return () => rootStore.stopUpdating();
    }, []);

  return (
    <div>
        <Router>
            <ResponsiveAppBar/>
            <AccountStatus />
            <Routes>
                <Route path="/sign-up" element={<RegistrationPage />} />
                <Route path="/sign-in" element={<AuthorizationPage />} />
            </Routes>
        </Router>
    </div>
  );
})

export default App;
