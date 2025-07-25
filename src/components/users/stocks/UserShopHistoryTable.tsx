import {
    useGetList,
    useRecordContext,
    NumberField,
    TextField,
    FunctionField,
} from 'react-admin';
import {
    Typography,
    CircularProgress,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { NoCheckboxDatagrid, ResponsiveFlexBox } from '../../../common/commonComponents';
import DateTimeField from '../../../common/dateTimeField';
import { ResourcesTypeWithIcon } from '../../../common/iconComponents';
import { StockIdLink, UserIdLink } from '../../../common/LinkHelper';
import RecordList from '../../../common/RecordList';

export const UserShopHistoryTable = () => {
    const record = useRecordContext(); // ожидается, что record.ID - userId
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const { data, isLoading, error } = useGetList('market_shophistory', {
        filter: { user_id: record?.ID }
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Ошибка загрузки истории покупок</Typography>;

    if (!data || data.length === 0)
        return (
            <div>
                <Typography variant="h6" gutterBottom>История покупок в магазине</Typography>
                <Typography>Нет данных</Typography>
            </div>
        );

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>История покупок в магазине</Typography>
            <ResponsiveFlexBox>
                {isSmall ? (
                    <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
                        <FunctionField
                            label="Товар"
                            render={(record: any) => {
                                const stock = record?.sales_id;
                                if (!stock) return null;
                                return <StockIdLink id={stock._id} label={stock.type} />;
                            }}
                        /> 
                        <RecordList
                            fields={[
                                 
                                {
                                    label: 'Цена',
                                    source: 'price.amount',
                                    render: () => (
                                         <FunctionField
                                            label="Цена"
                                            render={(record: any) => {
                                                const typeRecord = record.sales_id?.sale_price?.[0]; 
                                                if (!typeRecord) return "-"; 
                                                return (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span>{`${typeRecord.amount} ${typeRecord.type}`}</span>
                                                        <ResourcesTypeWithIcon record={{ TYPE: typeRecord.type }} showLabel={false} />
                                                    </div>
                                                );
                                            }}
                                        />
                                    ),
                                },
                                {
                                    label: 'Количество',
                                    source: 'amount',
                                    render: () => <NumberField source="amount" label="Количество" />,
                                },
                                {
                                     label: 'Тип',
                                    source: '_id',
                                    render: () =>
                                        <FunctionField
                                            label="Тип"
                                            render={(record: any) => {
                                                const type = record?.sales_id?.sales?.[0]?.type;
                                                return type || "-";
                                            }}
                                        />,
                                }
                            ]}
                        />
                    </NoCheckboxDatagrid>
                ) : (
                    <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
                        <FunctionField
                            label="Товар"
                            render={(record: any) => {
                                const stock = record?.sales_id;
                                if (!stock) return null;
                                return <StockIdLink id={stock._id} label={stock.type} />;
                            }}
                        /> 
                        
                        <NumberField source="amount" label="Количество" />

                        <FunctionField
                            label="Цена"
                            render={(record: any) => {
                                const typeRecord = record.sales_id?.sale_price?.[0]; 
                                if (!typeRecord) return "-"; 
                                return (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span>{`${typeRecord.amount} ${typeRecord.type}`}</span>
                                        <ResourcesTypeWithIcon record={{ TYPE: typeRecord.type }} showLabel={false} />
                                    </div>
                                );
                            }}
                        />
                        <FunctionField
                            label="Тип"
                            render={(record: any) => {
                                const type = record?.sales_id?.sales?.[0]?.type;
                                return type || "-";
                            }}
                        />
                    </NoCheckboxDatagrid>
                )}
            </ResponsiveFlexBox>
        </div>
    );
};
