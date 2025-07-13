import React, { useState } from 'react';
import { useRecordContext, useGetList } from 'react-admin';
import {
    Box,
    Stack,
    Button,
    Collapse,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    CircularProgress
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const TonTransactionsSection = () => {
    const record = useRecordContext();
    const wallet = record?.WALLET;
    const userId = record?.ID?.toString();

    const { data: deposits, isLoading: depositsLoading } = useGetList('transactions', {
        filter: {
            status: 'complete',
            'in_msg.source': wallet
        },
        sort: { field: 'created_at', order: 'DESC' },
        pagination: { page: 1, perPage: 1000 }
    });

    const { data: withdrawals, isLoading: withdrawalsLoading } = useGetList('ton_withdraw', {
        filter: { user_id: userId },
        sort: { field: 'created_at', order: 'DESC' },
        pagination: { page: 1, perPage: 1000 }
    });

    const [openTable, setOpenTable] = useState<'deposits' | 'withdrawals' | null>(null);

    if (depositsLoading || withdrawalsLoading) return <CircularProgress />;

    const formatTonValue = (nanoTon: string) => {
        return (parseInt(nanoTon || '0') / 1000000000).toFixed(2);
    };

    const formatDate = (dateInput: any) => {
        if (!dateInput) return 'Дата не определена';

        if (typeof dateInput === 'string' && /^\d+$/.test(dateInput)) {
            if (dateInput.length > 13) {
                return `Logical Time: ${dateInput}`;
            }
        }

        const timestamp = Number(dateInput);
        if (!isNaN(timestamp) && timestamp > 1000000000) {
            return new Date(timestamp * 1000).toLocaleString('ru-RU');
        }

        return 'Дата не определена';
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'CONFIRMED': return '#4caf50';
            case 'SENDED': return '#2196f3';
            case 'RETURNED': return '#f44336';
            case 'CANCELED_ADMIN': return '#f44336';
            case 'FROZEN': return '#2196f3';
            case 'PENDING': return '#ff9800';
            default: return '#9e9e9e';
        }
    };

    const totalDeposits = deposits?.reduce((sum, tx) => {
        return sum + parseInt(tx.in_msg?.value || '0') / 1000000000;
    }, 0) || 0;

    const totalWithdrawals = withdrawals?.reduce((sum, wd) => {
        return wd.status === 'CONFIRMED' ? sum + wd.amount : sum;
    }, 0) || 0;

    const renderSecondaryText = (items: React.ReactNode[]) => (
        <Box component="span" sx={{ display: 'block' }}>
            {items.map((item, index) => (
                <Box component="span" key={index} sx={{ display: 'block' }}>
                    {item}
                </Box>
            ))}
        </Box>
    );

    return (
        <Box sx={{ mt: 2, mb: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button 
                    startIcon={<ArrowDownwardIcon color="success" />}
                    onClick={() => setOpenTable(openTable === 'deposits' ? null : 'deposits')}
                    variant="outlined"
                >
                    Завел: {totalDeposits.toFixed(2)} TON
                </Button>

                <Button 
                    startIcon={<ArrowUpwardIcon color="error" />}
                    onClick={() => setOpenTable(openTable === 'withdrawals' ? null : 'withdrawals')}
                    variant="outlined"
                >
                    Вывел: {totalWithdrawals.toFixed(2)} TON
                </Button>
            </Stack>

            <Collapse in={openTable === 'deposits'}>
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        История вводов TON
                    </Typography>
                    <List>
                        {deposits?.map((tx) => (
                            <ListItem key={tx._id || tx.txHash} divider>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ArrowDownwardIcon color="success" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${formatTonValue(tx.in_msg?.value)} TON`}
                                    secondary={renderSecondaryText([
                                        `source: ${tx.in_msg?.source}`,
                                        `destination: ${tx.in_msg?.destination}`,
                                        `Хэш: ${tx.txHash}`,
                                        `message: ${tx.in_msg?.message}`,
                                        `status: ${tx.status}`,
                                        `${formatDate(tx.in_msg?.created_lt)}`
                                    ])}
                                />
                            </ListItem>
                        ))}
                        {(!deposits || deposits.length === 0) && (
                            <ListItem>
                                <ListItemText primary="Нет данных о вводах" />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Collapse>

            <Collapse in={openTable === 'withdrawals'}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom component="div">
                        История выводов TON
                    </Typography>
                    <List>
                        {withdrawals?.map((wd) => (
                            <ListItem 
                                key={wd._id} 
                                divider 
                                sx={{ 
                                    borderLeft: `4px solid ${getStatusColor(wd.status)}`,
                                    opacity: wd.status === 'CONFIRMED' ? 1 : 0.7
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ 
                                        bgcolor: getStatusColor(wd.status),
                                        color: 'white'
                                    }}>
                                        <ArrowUpwardIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`${wd.amount.toFixed(2)} TON (${wd.status})`}
                                    secondary={renderSecondaryText([
                                        `Запрошен: ${formatDate(wd.created_at)}`,
                                        wd.send_at && `Отправлен: ${formatDate(wd.send_at)}`,
                                        wd.commission && `Комиссия: ${wd.commission} TON`,
                                        wd.wallet_address && `Кошелёк: ${wd.wallet_address}`
                                    ].filter(Boolean))}
                                />
                            </ListItem>
                        ))}
                        {(!withdrawals || withdrawals.length === 0) && (
                            <ListItem>
                                <ListItemText primary="Нет данных о выводах" />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            </Collapse>
        </Box>
    );
};

export default TonTransactionsSection;
