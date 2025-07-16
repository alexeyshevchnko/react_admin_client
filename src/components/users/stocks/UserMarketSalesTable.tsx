import {
    Typography,
    CircularProgress,
    useMediaQuery,
    Theme,
} from '@mui/material';
import {
    useGetList,
    useRecordContext,
    NumberField,
    TextField,
    FunctionField,
} from 'react-admin';
import { NoCheckboxDatagrid, ResponsiveFlexBox } from '../../../common/commonComponents';
import DateTimeField from '../../../common/dateTimeField'; 
import { ResourcesTypeWithIcon } from '../../../common/iconComponents';
import { StockIdLink, UserIdLink } from '../../../common/LinkHelper';
import RecordList from '../../../common/RecordList';




export const UserMarketSalesTable = () => {
    const record = useRecordContext();
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

    const { data, isLoading, error } = useGetList('market_salesman', {
        filter: { user_id: record?.ID } 
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Ошибка при загрузке market_buyer</Typography>;
    if (!data || data.length === 0)// return <Typography>Нет продаж</Typography>
        return (
          <div >
                <Typography variant="h6" gutterBottom>Продажи акций на рынке</Typography> 
                <Typography>Нет продаж</Typography>
          </div>);

    return (
        <div style={{ width: '100%', overflowX: 'auto' }}>
            <Typography variant="h6" gutterBottom>Продажи акций на рынке</Typography>
            <ResponsiveFlexBox>
                {isSmall ? (
                    <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
                         <RecordList
                            fields={[
                                {
                                    label: 'Товар',
                                    source: 'user_stock_id.stock_id', 
                                    render: (_val, _rec) =>  <FunctionField
                                        label="Товар"
                                        render={(record: any) => {
                                            const stock = record?.user_stock_id?.stock_id;
                                            if (!stock) return null;

                                            return <StockIdLink id={stock._id} label={stock.type} />;
                                        }}
                                    /> ,
                                },
                                {
                                    label: 'Покупатель',
                                    source: 'buyer_user_id', 
                                    render: (_val, _rec) =>  <FunctionField
                                        label="Покупатель"
                                        render={(record: any) => { 
                                                const user = record?.buyer_user_id;
                                                if (!user) return null;
                                                return <UserIdLink id={user._id} label={user.ID} />; 
                                        }}
                                    /> ,
                                },
                            ]}
                        /> 
                        <RecordList
                            fields={[
                                {
                                    label: 'Start',
                                    source: 'created_at', 
                                    render: (_val, _rec) =>  <DateTimeField source="created_at" label="Start" showTime={false} /> ,
                                },
                                {
                                    label: 'End',
                                    source: 'end_of_bidding_at', 
                                    render: (_val, _rec) =>   <DateTimeField source="end_of_bidding_at" label="End" showTime={false}  /> ,
                                },
                                {
                                    label: 'Цена',
                                    source: 'price.amount', 
                                    render: (_val, _rec) =>   <FunctionField
                                        label="Цена"
                                        render={(record: any) => {
                                            if (!record.price) return "-"; 
                                            const typeRecord = record.price?.type; 

                                            return (
                                            
                                                <span>{`${record.price.amount} ${record.price.type}`}</span>
                                                     
                                                
                                            );
                                        }}
                                    />  ,
                                } ,
                                {
                                    label: 'Статус',
                                    source: 'status', 
                                    render: (_val, _rec) =>   <TextField source="status" label="Статус" />  ,
                                },
                            ]}
                        /> 
                    </NoCheckboxDatagrid>
                ) : (
                    <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
                         <FunctionField
                            label="Товар"
                            render={(record: any) => {
                                const stock = record?.user_stock_id?.stock_id;
                                if (!stock) return null;

                                return <StockIdLink id={stock._id} label={stock.type} />;
                            }}
                        /> 

                        <FunctionField
                            label="Покупатель"
                            render={(record: any) => { 
                                    const user = record?.buyer_user_id;
                                    if (!user) return null;
                                    return <UserIdLink id={user._id} label={user.ID} />; 
                            }}
                        /> 

                        <DateTimeField source="created_at" label="Start" />
                        <DateTimeField source="end_of_bidding_at" label="End" />
                        <NumberField source="amount" label="Количество" />
                        <FunctionField
                            label="Цена"
                            render={(record: any) => {
                                if (!record.price) return "-"; 
                                const typeRecord = record.price?.type; 

                                return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span>{`${record.price.amount} ${record.price.type}`}</span>
                                        <ResourcesTypeWithIcon record={{ TYPE: typeRecord,  }} showLabel={false} />
                                    </div>
                                );
                            }}
                        /> 
                       <TextField source="status" label="Статус" />    
                    </NoCheckboxDatagrid>
                )}
            </ResponsiveFlexBox>
        </div>
    );
};
