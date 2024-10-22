import React, { useState } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import {MessageType} from "../stores/MessageStore";
import {accountStore, messageStore} from "../stores";
import {observer} from "mobx-react-lite";
import {date_converter} from "../modules/utils";

const MailComponent = observer(() =>  {
    const [selectedFolder, setSelectedFolder] = useState('inbox');
    const [selectedMessages, setSelectedMessages] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<MessageType | null>(null);
    const [openMessageForm, setOpenMessageForm] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [messageContent, setMessageContent] = useState('');

    const {account} = accountStore;
    const { inbox, outbox, checkMessage, sendMessage, deleteMessage } = messageStore;

    const handleRowClick = (message: MessageType) => {
        if (selectedFolder === 'inbox' && !message.checked) {
            checkMessage(message.id).then()
        }
        setCurrentMessage(message);
        setOpenDialog(true);
    };

    const handleSelect = (index: number) => {
        // @ts-ignore
        if (selectedMessages.includes(index)) {
            setSelectedMessages(selectedMessages.filter(i => i !== index));
        } else {
            // @ts-ignore
            setSelectedMessages([...selectedMessages, index]);
        }
    };

    const renderMessages = () => {
        const messages = selectedFolder === 'inbox' ? inbox : outbox;
        return messages.map((message, index) => (
            <TableRow key={index} sx={{ cursor: 'pointer' }} >
                <TableCell onClick={() => handleRowClick(message)} style={{ fontWeight: selectedFolder === 'inbox' && !message.checked ? 'bold' : 'normal' }}>
                    {
                        selectedFolder === 'inbox' ? message.companion : message.companion
                    }
                </TableCell>
                <TableCell onClick={() => handleRowClick(message)} style={{ fontWeight: selectedFolder === 'inbox' && !message.checked ? 'bold' : 'normal' }}>
                    {date_converter(message.timestamp)}
                </TableCell>
                <TableCell>
                    <Checkbox
                        checked={
                            // @ts-ignore
                            selectedMessages.includes(index)}
                        onChange={(e) => {
                            e.stopPropagation();
                            handleSelect(index);
                        }}
                    />
                </TableCell>
            </TableRow>
        ));
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentMessage(null);
    };

    const handleOpenMessageForm = (recipientName: string = '') => {
        setRecipient(recipientName);
        setMessageContent('');
        setOpenMessageForm(true);
    };

    const handleCloseMessageForm = () => {
        setOpenMessageForm(false);
        setRecipient('');
        setMessageContent('');
    };

    const handleSendMessage = async () => {
        try {
            await sendMessage(messageContent, recipient);
            handleCloseMessageForm();
            handleCloseDialog();
        } catch (error) {
            alert('Произошла ошибка при отправке сообщения');
        }
    };

    const handleDeleteMessages = () => {
        const messagesToDelete = selectedFolder === 'inbox' ? inbox : outbox;
        const selectedMessageDetails = selectedMessages.map(index => messagesToDelete[index].id);
        deleteMessage(selectedMessageDetails).then()
        setSelectedMessages([]);
    };


    return (
        <Container maxWidth="lg" sx={{ display: 'flex', backgroundColor: '#F1F1E8', padding: 2, border: '1px solid #D3C4B1' }}>
            {/* Sidebar */}
            <Grid container spacing={2} sx={{ width: '200px', backgroundColor: '#E8E1D1', padding: 2, borderRight: '1px solid #D3C4B1' }}>
                <Grid item xs={12}>
                    <Button onClick={() => setSelectedFolder('inbox')} fullWidth>
                        Входящие
                    </Button>
                    <Typography sx={{ float: 'right' }}>{inbox.length}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button onClick={() => {
                            setSelectedFolder('outbox')}} fullWidth>
                        Исходящие
                    </Button>
                    <Typography sx={{ float: 'right' }}>{outbox.length}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" fullWidth onClick={() => handleOpenMessageForm()}>
                        Новое сообщение
                    </Button>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{selectedFolder === 'inbox' ? 'От' : 'Кому'}</TableCell>
                                <TableCell>Дата</TableCell>
                                <TableCell>Выбрать</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderMessages()}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button variant="contained" color="error" onClick={handleDeleteMessages}>Удалить выбранные</Button>
                </Box>

                {/* Dialog for Message Details */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Сообщение</DialogTitle>
                    <DialogContent>
                        {currentMessage && (
                            <>
                                <Typography variant="body1"><strong>Дата:</strong> {date_converter(currentMessage.timestamp)}</Typography>
                                <Typography variant="body1"><strong>От:</strong> {
                                    // @ts-ignore
                                    selectedFolder === 'inbox' ? currentMessage.companion : account.email}</Typography>
                                <Typography variant="body1"><strong>Кому:</strong> {
                                    // @ts-ignore
                                    selectedFolder === 'inbox' ? account.email : currentMessage.companion }</Typography>
                                <Typography variant="body1"><strong>Сообщение:</strong> {currentMessage.content}</Typography>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Назад</Button>
                        <Button variant="contained" onClick={() => handleOpenMessageForm(currentMessage?.companion || '')}>Ответить</Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog for New Message Form */}
                <Dialog open={openMessageForm} onClose={handleCloseMessageForm}>
                    <DialogTitle>{currentMessage ? 'Ответить' : 'Новое сообщение'}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Кому"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Сообщение"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseMessageForm}>Отмена</Button>
                        <Button variant="contained" onClick={handleSendMessage}>Отправить</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
});

export default MailComponent;
