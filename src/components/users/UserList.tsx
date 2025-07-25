// src/components/users/UserList.tsx
import { List, Datagrid, TextField, FunctionField, TextInput } from 'react-admin';
import { ResponsiveFlexBox } from '../../common/commonComponents';
import DateTimeField from '../../common/dateTimeField';

const filters = [
  <TextInput label="Поиск по ID" source="ID" alwaysOn />,
  <TextInput label="Поиск по нику" source="NICKNAME" alwaysOn />,
];

export const UserList = () => (
  <ResponsiveFlexBox>
    <List filters={filters}>
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <TextField source="ID" label="ID" />
        <TextField source="NICKNAME" label="Никнейм" />
        <DateTimeField source="REGISTRATION" label="Дата регистрации" /> 
        <FunctionField
          label="Куплено звезд"
          source="purchasesCount"
          render={(record: any) => record.PURCHASES?.length || 0}
          sortable
        />
      </Datagrid>
    </List>
  </ResponsiveFlexBox>
);
