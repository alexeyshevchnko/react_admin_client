import React, { useState } from 'react';
import {
    Pagination,
    CircularProgress,
    Typography,
} from '@mui/material';
import DateTimeField from '../../../common/dateTimeField';
import { ResponsiveFlexBox, NoCheckboxDatagrid } from '../../../common/commonComponents';
import { 
    NumberField, 
    TextField,  // Импортируем TextField из react-admin
    useGetList, 
    useRecordContext 
} from 'react-admin';

export const UserToolsTable = () => {
    const record = useRecordContext(); // record.ID — это user_id
    const [page, setPage] = useState(1);
    const perPage = 5;

    const { data, total, isLoading, error } = useGetList('tools', {
        filter: { user_id: record?.ID },
        pagination: { page, perPage },
        sort: { field: 'created_at', order: 'DESC' },
    });

    if (!record?.ID) return <Typography>Нет данных</Typography>;
    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Ошибка при загрузке инструментов</Typography>;

    if (!data || data.length === 0) {
        return <Typography>Нет инструментов</Typography>;
    }

    const pageCount = total ? Math.ceil(total / perPage) : 1;

    return (
        <ResponsiveFlexBox>
            <Typography variant="h6" gutterBottom>
                История инструментов
            </Typography>
            
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <NoCheckboxDatagrid 
                    data={data}
                    bulkActionButtons={false}
                >
                    <TextField source="tool_id" label="Инструмент" />
                    <NumberField source="cooldownChange" label="Кулдаун" />
                    <DateTimeField source="created_at" label="Создан" />
                </NoCheckboxDatagrid>

                <Pagination
                    count={pageCount}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    color="primary"
                    sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                />
            </div>
        </ResponsiveFlexBox>
    );
};