import {
    Show,
    SimpleShowLayout,
    NumberField,
    TextField,
    ArrayField, 
    useRecordContext,
    FunctionField
} from 'react-admin';
import {  Typography, Divider, useMediaQuery, Theme } from '@mui/material';
import { NoCheckboxDatagrid, ResponsiveFlexBox } from '../../common/commonComponents';
import DateTimeField from '../../common/dateTimeField';
import RecordList from '../../common/RecordList';
import { IconWithLabel } from '../../common/iconComponents';


const Title = () => {
    const record = useRecordContext();
    return <span>Акции: {record ? `${record.type} (ID: ${record._id})` : ''}</span>;
};

const SalePriceList = () => ( 
     <ResponsiveFlexBox>
            <ArrayField source="sale_price">
                <NoCheckboxDatagrid sx={{ minWidth: 300 }}>
                     <FunctionField
                        label="Тип"
                        render={(record) => (
                            <IconWithLabel record={record} fieldName="type" />
                        )}
                    /> 
                   <NumberField source="amount" label="Сумма" />
                </NoCheckboxDatagrid>
            </ArrayField>
     </ResponsiveFlexBox>
);

const SalesList = () => {
    const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
    
    return (
        <ResponsiveFlexBox>
            <ArrayField source="sales">
                <NoCheckboxDatagrid sx={{ minWidth: 300 }}>
                    <RecordList
                        fields={[
                            { label: 'ID', source: 'salesId' },
                            { label: 'Тип', source: 'type' },
                        ]}
                    /> 

                    <RecordList
                        fields={[
                            {
                                label: 'Начало',
                                source: 'start_sale',
                                render: (_val, _rec) => (
                                    <DateTimeField 
                                        source="start_sale" 
                                        showTime={!isSmall} 
                                    />
                                ),
                            },
                            {
                                label: 'Конец',
                                source: 'end_sale',
                                render: (_val, _rec) => (
                                    <DateTimeField 
                                        source="end_sale" 
                                        showTime={!isSmall}  
                                    />
                                ),
                            },
                        ]}
                    />
                    
                    <NumberField source="limitForUser" label="Лимит" />
                </NoCheckboxDatagrid>
            </ArrayField>
        </ResponsiveFlexBox>  
    );
};

export const StockShow = () => (
    <Show title={<Title />}>
        
        <SimpleShowLayout>
            
 
            <TextField source="type" label="Тип" />
            <NumberField source="all_amount" label="Всего единиц" />
            <NumberField source="sold_amount" label="Продано" />
            <NumberField source="sale_amount" label="Осталось в продаже" />
            <NumberField source="stock_income_percent" label="% дохода от продажи" />
            <NumberField source="income_mmt_all" label="Доход в MMT всего" />
          
            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Цены</Typography>
            <SalePriceList />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>Продажи</Typography>
            <SalesList />
        </SimpleShowLayout>
    </Show>
);
