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
import { ResourcesTypeWithIcon } from '../../../common/iconComponents';
import { ResponsiveFlexBox, NoCheckboxDatagrid } from '../../../common/commonComponents';
import RecordList from '../../../common/RecordList';
import { UserIdLink } from '../../../common/LinkHelper';

export const BuyerToolsHistory = () => {
    const record = useRecordContext();
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const [page, setPage] = useState(1);
    const perPage = 5;

    const { data, total, isLoading, error } = useGetList('tools_buyer', {
        filter: { user_id: record?.ID },
        pagination: { page, perPage },
        sort: { field: 'created_at', order: 'DESC' },
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Ошибка при загрузке покупок инструментов</Typography>;

    if (!data || data.length === 0) {
        return (
            <div>
                <Typography variant="h6" gutterBottom>
                    История покупок
                </Typography>
                <Typography>Нет покупок</Typography>
            </div>
        );
    }

    const pageCount = total ? Math.ceil(total / perPage) : 1;


    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>
                История покупок
            </Typography>

            <ResponsiveFlexBox>
                {isSmall ? (
                    <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
                        <RecordList
                            fields={[
                                {
                                    label: 'Инструмент',
                                    source: 'tool_id',
                                    render: () =>  <TextField source="tool_id" label="Инструмент" />
                                },
                                {
                                    label: 'Цена',
                                    source: 'price.amount',
                                                    render: () =><FunctionField
                                        label="Цена"
                                        render={(record: any) => (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span>{record.price?.amount}</span>
                                            <ResourcesTypeWithIcon record={{ TYPE: record.price?.type }} showLabel={false} />
                                        </div>
                                        )}
                                    />
                                },
                                {
                                    label: 'Продавец',
                                    source: 'salesman_user_id',
                                    render: (value: any, record: any) => {
                                        const userId = record?.salesman_user_id;
                                        if (!userId) return null;
                                        return <UserIdLink id={record.salesman_user?._id} label={userId} />;
                                    },
                                },
                            ]}
                        />
                        <RecordList
                            fields={[
                                {
                                    label: 'Start',
                                    source: 'created_at',
                                    render: () => <DateTimeField source="created_at" label="Создан" showTime={false} />,
                                },
                                {
                                    label: 'End',
                                    source: 'end_of_bidding_at',
                                    render: () => <DateTimeField source="end_of_bidding_at" label="Конец торгов" showTime={false} />,
                                },
                                {
                                    label: 'Статус',
                                    source: 'status',
                                    render: () => <TextField source="status" label="Статус" />
                                },
                            ]}
                        />
                    </NoCheckboxDatagrid>
                ) : (
                   <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
                    <TextField source="tool_id" label="Инструмент" />
                    <FunctionField
                        label="Продавец"
                        render={(record: any) => {
                        const userId = record?.salesman_user_id;
                        if (!userId) return null;
                        // Предполагаю, что UserIdLink - это твой кастомный компонент для ссылки на пользователя
                        return <UserIdLink id={record.salesman_user?._id} label={userId} />;
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
