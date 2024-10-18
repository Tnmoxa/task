import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import {accountStore} from "../stores";

function ResponsiveAppBar() {
    const navigate = useNavigate();
    const { signOff } = accountStore

    const handleRegistration = () => {
        console.log('Регистрация')
        navigate('/sign-up')
    };

    const handleAuthorization = () => {
        console.log('Авторизация')
        navigate('/sign-in')
    };

    const handleExit = () => {
        signOff()
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            onClick={handleRegistration}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Регистрация
                        </Button>
                        <Button
                            onClick={handleAuthorization}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Войти
                        </Button>
                        <Button
                            onClick={handleExit}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            Выход
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;
