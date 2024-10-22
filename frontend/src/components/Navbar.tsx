import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import {Route, useNavigate} from 'react-router-dom';
import {accountStore, messageStore} from "../stores";
import {observer} from "mobx-react-lite";
import MailPage from "./MailPage";
import RegistrationPage from "./RegistrationPage";
import React from "react";

const ResponsiveAppBar = observer(() => {
    const navigate = useNavigate();
    const {inbox} = messageStore
    const { signOff, account } = accountStore

    const handleRegistration = () => {
        navigate('/sign-up')
    };

    const handleAuthorization = () => {
        navigate('/sign-in')
    };

    const handleExit = () => {
        signOff()
    };

    const handleMail = () => {
        navigate('/mail')
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {!account?(
                        <><Button
                            onClick={handleRegistration}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Регистрация
                        </Button><Button
                            onClick={handleAuthorization}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Войти
                        </Button></>
                        ):(
                        <Button
                            onClick={handleExit}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Выход
                        </Button>)}


                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <IconButton size="large" color="inherit" onClick={handleMail}>
                            <Badge badgeContent={inbox.filter(message => !message.checked).length} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
})
export default ResponsiveAppBar;
