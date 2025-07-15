import { List, Datagrid, TextField, NumberField} from 'react-admin';
import { ResponsiveFlexBox } from '../../common/commonComponents';

export const StockList = () => (
    <ResponsiveFlexBox>
    <List>
        <Datagrid rowClick="show">
        <TextField source="type" label="Тип" />
        <NumberField source="all_amount" label="Всего" />
        <NumberField source="sold_amount" label="Продано" />
        <NumberField source="sale_amount" label="Осталось" />
        <NumberField source="stock_income_percent" label="Процент дохода" />
        <NumberField source="income_mmt_all" label="Доход MMT" />
        </Datagrid>
    </List>
  </ResponsiveFlexBox>
);
