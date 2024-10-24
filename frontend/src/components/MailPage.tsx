import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import { observer } from "mobx-react-lite";
import { messageStore, accountStore } from "../stores";
import { date_converter } from "../modules/utils";
import { fetchAccounts } from "../modules/account";

const ChatComponent = observer(() => {
    const { inbox, sendMessage, changeCompanion, companion } = messageStore;
    const { account } = accountStore;
    const [messageContent, setMessageContent] = useState('');
    const [users, setUsers] = useState([]);

    const handleSendMessage = async () => {
        try {
            await sendMessage(messageContent, companion);
            setMessageContent('');
        } catch (error) {
            alert('Произошла ошибка при отправке сообщения');
        }
    };

    const renderMessages = () => {
        return inbox.map((message, index) => {
            // @ts-ignore
            const isCurrentUser = message.sender === account.email;
            return (
                <Paper key={index} sx={{
                    padding: 2,
                    margin: '10px 0',
                    position: 'relative',
                    alignSelf: isCurrentUser ? 'flex-start' : 'flex-end',
                    backgroundColor: isCurrentUser ? '#D1E8FF' : '#FFFFFF'
                }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {message.sender}
                    </Typography>
                    <Typography variant="body1" sx={{ margin: '10px 0' }}>
                        {message.content}
                    </Typography>
                    <Typography variant="caption" sx={{ position: 'absolute', bottom: 5, right: 5 }}>
                        {date_converter(message.timestamp)}
                    </Typography>
                </Paper>
            );
        });
    };

    useEffect(() => {
        // @ts-ignore
        fetchAccounts().then(data => setUsers(data)).catch(error => console.error('Ошибка при получении списка пользователей:', error));
    }, []);

    return (
        <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', paddingTop: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={3} sx={{ backgroundColor: '#E8E1D1', padding: 2 }}>
                    <Typography variant="h6">Пользователи:</Typography>
                    <List>
                        {users.map((user, index) => (
                            // @ts-ignore
                            <ListItem key={index} button onClick={() => {
                                // @ts-ignore
                                changeCompanion(user.email)
                            }}>
                                {// @ts-ignore
                                    <ListItemText primary={user.email} />}
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {renderMessages()}
                        </Box>

                        <Box sx={{ display: 'flex', padding: 2 }}>
                            <TextField
                                label={`Сообщение для ${companion || '...'}`}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                            />
                            <Button variant="contained" sx={{ marginLeft: 2 }} onClick={handleSendMessage} disabled={!companion}>
                                Отправить
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
});

export default ChatComponent;
