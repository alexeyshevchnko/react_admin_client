import { useGetList, useRecordContext,  FunctionField } from 'react-admin';
import {
    Typography,
    CircularProgress,
    useMediaQuery,
    Theme,
} from '@mui/material'; 
import { NumberField } from 'react-admin';
import { NoCheckboxDatagrid, ResponsiveFlexBox } from '../../../common/commonComponents';
import DateTimeField from '../../../common/dateTimeField';
import RecordList from '../../../common/RecordList'; 
import { StockIdLink } from '../../../common/LinkHelper';

export const UserStocksTable = () => {
    const record = useRecordContext();
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    const { data, isLoading, error } = useGetList('user_stocks', {
        filter: { user_id: record?.ID },
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'created_at', order: 'DESC' },
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Ошибка при загрузке user_stocks</Typography>;
    if (!data || data.length === 0) return <Typography>Нет данных</Typography>;

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}> 
            <Typography variant="h6" gutterBottom>Акции пользователя</Typography>
            <ResponsiveFlexBox>
                {isSmall ? (
                    <NoCheckboxDatagrid 
                        data={data}
                        bulkActionButtons={false}
                    > 
                        <RecordList
                            fields={[
                                {
                                    label: '',
                                    source: '_id',
                                    render: (_val, _rec) => <FunctionField
                                            label="Тип товара"
                                            render={(record: any) => {
                                                const stock = record?.stock_id;
                                                if (!stock) return null;

                                                return <StockIdLink id={stock._id} label={stock.type} />;
                                            }}
                                        />
                                },
                                {
                                    label: 'Amount',
                                    source: 'stock_amount',
                                    render: (_val, _rec) => <NumberField source="stock_amount" label="Количество" />,
                                },
                            ]}
                        />

                        <RecordList
                            fields={[
                                {
                                    label: 'Осталось (MMT)',
                                    source: '_id',
                                    alignRight: true,
                                    render: (_val, _rec) => <NumberField 
                                        source="income_mmt_current"  
                                        options={{ minimumFractionDigits: 2 }} 
                                    />,
                                },
                                {
                                    label: 'Всего (MMT)',
                                    source: 'stock_amount',
                                    alignRight: true,
                                    render: (_val, _rec) =>  <NumberField 
                                        source="income_mmt_all"  
                                        options={{ minimumFractionDigits: 2 }} 
                                    />,
                                },
                            ]}
                        /> 
                    </NoCheckboxDatagrid>    ) : (

                    <NoCheckboxDatagrid 
                        data={data}
                        bulkActionButtons={false}
                    > 
                        <FunctionField
                            label="Тип товара"
                            render={(record: any) => {
                                const stock = record?.stock_id;
                                if (!stock) return null;

                                return <StockIdLink id={stock._id} label={stock.type} />;
                            }}
                        />
                        <NumberField source="stock_amount" label="Количество" />
                     
                        <NumberField 
                            source="income_mmt_current" 
                            label="Не забрано (MMT)" 
                            options={{ minimumFractionDigits: 2 }} 
                        />
                        <NumberField 
                            source="income_mmt_all" 
                            label="Всего (MMT)" 
                            options={{ minimumFractionDigits: 2 }} 
                        />
                        <DateTimeField source="created_at" label="Создан" />
                    </NoCheckboxDatagrid> 
                    )}
                
            </ResponsiveFlexBox>
        </div>
    );
};