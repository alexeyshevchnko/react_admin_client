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
    CircularProgress,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const TonTransactionsSection = () => {
    const record = useRecordContext();
    const wallet = record?.WALLET;
    const userId = record?.ID?.toString();
    const hasWallet = Boolean(wallet);

    const { data: deposits, isLoading: loadingDeposits } = useGetList(
        'ton_deposit',
        {
            filter: { user_id: record?._id, hasWallet },
        }
    );

    const { data: withdrawals, isLoading: loadingWithdrawals } = useGetList(
        'ton_withdraw',
        {
            filter: { user_id: userId, hasWallet },
            sort: { field: 'created_at', order: 'DESC' },
            pagination: { page: 1, perPage: 1000 },
        }
    );

    const [openSection, setOpenSection] = useState<'deposits' | 'withdrawals' | null>(null);

    if (loadingDeposits || loadingWithdrawals) return <CircularProgress />;

    const formatTon = (nano: string) => (parseInt(nano || '0') / 1e9).toFixed(2);

    const formatDate = (value: any) => {
        if (!value) return 'Дата не определена';
        if (typeof value === 'string' && /^\d+$/.test(value) && value.length > 13) {
            return `Logical Time: ${value}`;
        }
        const ts = Number(value);
        return ts > 1e9 ? new Date(ts * 1000).toLocaleString('ru-RU') : 'Дата не определена';
    };

    const getStatusColor = (status: string) => {
        const map: Record<string, string> = {
            CONFIRMED: '#4caf50',
            SENDED: '#2196f3',
            RETURNED: '#f44336',
            CANCELED_ADMIN: '#f44336',
            FROZEN: '#2196f3',
            PENDING: '#ff9800',
        };
        return map[status] || '#9e9e9e';
    };

    const renderLines = (lines: React.ReactNode[]) => (
        <Box component="span" sx={{ display: 'block', wordBreak: 'break-word' }}>
            {lines.map((line, i) => (
                <Box component="span" key={i} sx={{ display: 'block' }}>
                    {line}
                </Box>
            ))}
        </Box>
    );

    const totalDeposits = hasWallet
        ? deposits?.reduce((acc, tx) => acc + parseInt(tx.in_msg?.value || '0') / 1e9, 0) ?? 0
        : 0;

    const totalWithdrawals = hasWallet
        ? withdrawals?.reduce((acc, wd) => (wd.status === 'CONFIRMED' ? acc + wd.amount : acc), 0) ?? 0
        : 0;

    return (
        <Box sx={{ mt: 2, mb: 2, overflowX: 'auto' }}>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 2, width: '100%' }}
            >
                <Button
                    startIcon={<ArrowDownwardIcon color="success" />}
                    variant="outlined"
                    fullWidth
                    onClick={() => setOpenSection(openSection === 'deposits' ? null : 'deposits')}
                    disabled={!hasWallet}
                >
                    Завел: {totalDeposits.toFixed(2)} TON
                </Button>
                <Button
                    startIcon={<ArrowUpwardIcon color="error" />}
                    variant="outlined"
                    fullWidth
                    onClick={() => setOpenSection(openSection === 'withdrawals' ? null : 'withdrawals')}
                    disabled={!hasWallet}
                >
                    Вывел: {totalWithdrawals.toFixed(2)} TON
                </Button>
            </Stack>

            {!hasWallet && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    У пользователя не привязан TON кошелек
                </Typography>
            )}

            {hasWallet && (
                <Collapse in={openSection === 'deposits'}>
                    <Paper elevation={3} sx={{ p: 2, mb: 2, width: '100%', overflowX: 'auto' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            История вводов TON
                        </Typography>
                        <List>
                            {deposits?.length ? (
                                deposits.map((tx) => (
                                    <ListItem key={tx._id || tx.txHash} divider>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <ArrowDownwardIcon color="success" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${formatTon(tx.in_msg?.value)} TON`}
                                            secondary={renderLines([
                                                `source: ${tx.in_msg?.source}`,
                                                `destination: ${tx.in_msg?.destination}`,
                                                `Хэш: ${tx.txHash}`,
                                                `message: ${tx.in_msg?.message}`,
                                                `status: ${tx.status}`,
                                                formatDate(tx.in_msg?.created_lt),
                                            ])}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="Нет данных о вводах" />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Collapse>
            )}

            {hasWallet && (
                <Collapse in={openSection === 'withdrawals'}>
                    <Paper elevation={3} sx={{ p: 2, width: '100%', overflowX: 'auto' }}>
                        <Typography variant="subtitle1" gutterBottom>
                            История выводов TON
                        </Typography>
                        <List>
                            {withdrawals?.length ? (
                                withdrawals.map((wd) => (
                                    <ListItem
                                        key={wd._id}
                                        divider
                                        sx={{
                                            borderLeft: `4px solid ${getStatusColor(wd.status)}`,
                                            opacity: wd.status === 'CONFIRMED' ? 1 : 0.7,
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: getStatusColor(wd.status),
                                                    color: 'white',
                                                }}
                                            >
                                                <ArrowUpwardIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${wd.amount.toFixed(2)} TON (${wd.status})`}
                                            secondary={renderLines(
                                                [
                                                    `Запрошен: ${formatDate(wd.created_at)}`,
                                                    wd.send_at && `Отправлен: ${formatDate(wd.send_at)}`,
                                                    wd.commission && `Комиссия: ${wd.commission} TON`,
                                                    wd.wallet_address && `Кошелёк: ${wd.wallet_address}`,
                                                ].filter(Boolean)
                                            )}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="Нет данных о выводах" />
                                </ListItem>
                            )}
                        </List>
                    </Paper>
                </Collapse>
            )}
        </Box>
    );
};

export default TonTransactionsSection;
