import { List, Datagrid, TextField, FunctionField } from 'react-admin';
import { ResponsiveFlexBox } from '../../common/commonComponents';
import DateTimeField from '../../common/dateTimeField';

export const UserList = () => (
  <ResponsiveFlexBox>
    <List>
      <Datagrid rowClick="show">
        {/* Основные поля */}
        <TextField source="ID" label="ID" />
        <TextField source="NICKNAME" label="Никнейм" />
        
        {/* Дата регистрации - используем правильное поле REGISTRATION */}
        <DateTimeField source="REGISTRATION" label="Дата регистрации" /> 
        
        {/* Количество покупок - безопасный вариант */}
        <FunctionField
          label="Куплено звезд"
          source="purchasesCount" // Добавьте source для сортировки
          render={(record: any) => record.PURCHASES?.length || 0}
          sortable // Разрешить сортировку
        />
        
      </Datagrid>
    </List>
  </ResponsiveFlexBox>
);