import React, { useState } from 'react';
import {
    Typography,
    CircularProgress,
    useMediaQuery,
    Theme,
    Pagination,
} from '@mui/material';
import {
    FunctionField,
    TextField, 
    useGetList,
    useRecordContext,
} from 'react-admin';

import DateTimeField from '../../../common/dateTimeField'; 
import { ResponsiveFlexBox, NoCheckboxDatagrid } from '../../../common/commonComponents';
import { UserIdLink } from '../../../common/LinkHelper';
import { ResourcesTypeWithIcon } from '../../../common/iconComponents';
import { TrolleyTypeWithIcon } from '../../../common/iconComponents';
import RecordList from '../../../common/RecordList';

export const SalesmanTrolleysHistory = () => {
    const record = useRecordContext();
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const [page, setPage] = useState(1);
    const perPage = 5;

    const { data, total, isLoading, error } = useGetList('salesmanTrolleys', {
        filter: { salesman_user_id: record?.ID },
        pagination: { page, perPage },
        sort: { field: 'created_at', order: 'DESC' },
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Ошибка при загрузке истории продаж</Typography>;

    if (!data || data.length === 0) {
        return (
            <div>
                <Typography variant="h6" gutterBottom>
                    История продаж
                </Typography>
                <Typography>Нет продаж</Typography>
            </div>
        );
    }

    const pageCount = total ? Math.ceil(total / perPage) : 1;

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                История продаж
            </Typography>

            <ResponsiveFlexBox>
                {isSmall ? (
                    <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
                        <RecordList
                            fields={[
                                {
                                    label: 'Тип',
                                    source: 'tool_id',
                                    render: () => (
                                        <FunctionField
                                            label="Тип"
                                            render={record =>
                                                record.user_trolley
                                                    ? <TrolleyTypeWithIcon record={record.user_trolley} />
                                                    : '—'
                                            }
                                        />
                                    ),
                                },
                                {
                                    label: 'Цена',
                                    source: 'price.amount',
                                    render: () => (
                                        <FunctionField
                                            label="Цена"
                                            render={(record: any) => (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span>{record.price?.amount}</span>
                                                    <ResourcesTypeWithIcon record={{ TYPE: record.price?.type }} showLabel={false} />
                                                </div>
                                            )}
                                        />
                                    ),
                                },
                                {
                                    label: 'Покупатель',
                                    source: 'buyer_user_id',
                                    render: (value: any, record: any) => {
                                        const userId = record?.buyer_user_id;
                                        if (!userId) return null;
                                        return <UserIdLink id={record.buyer_user?._id} label={userId} />;
                                    },
                                },
                            ]}
                        />
                        <RecordList
                            fields={[
                                {
                                    label: 'Start',
                                    source: 'created_at',
                                    render: () => <DateTimeField source="created_at" label="Start" showTime={false} />,
                                },
                                {
                                    label: 'End',
                                    source: 'end_of_bidding_at',
                                    render: () => <DateTimeField source="end_of_bidding_at" label="End" showTime={false} />,
                                },
                                {
                                    label: 'Статус',
                                    source: 'status',
                                    render: () => <TextField source="status" label="Статус" />,
                                },
                            ]}
                        />
                    </NoCheckboxDatagrid>
                ) : (
                    <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
                        <FunctionField
                            label="Тип"
                            render={record =>
                                record.user_trolley
                                    ? <TrolleyTypeWithIcon record={record.user_trolley} />
                                    : '—'
                            }
                        />
                        <FunctionField
                            label="Покупатель"
                            render={(record: any) => {
                                const userId = record?.buyer_user_id;
                                if (!userId) return null;
                                return <UserIdLink id={record.buyer_user?._id} label={userId} />;
                            }}
                        />
                        <FunctionField
                            label="Цена"
                            render={(record: any) => (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span>{record.price?.amount}</span>
                                    <ResourcesTypeWithIcon record={{ TYPE: record.price?.type }} showLabel={false} />
                                </div>
                            )}
                        />
                        <DateTimeField source="created_at" label="Start" />
                        <DateTimeField source="end_of_bidding_at" label="End" />
                        <TextField source="status" label="Статус" />
                    </NoCheckboxDatagrid>
                )}
            </ResponsiveFlexBox>

            <Pagination
                count={pageCount}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
        </div>
    );
};
