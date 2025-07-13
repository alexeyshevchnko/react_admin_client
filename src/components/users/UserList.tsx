import { List, Datagrid, TextField, DateField, FunctionField } from 'react-admin';

export const UserList = () => (
  <List>
    <Datagrid rowClick="show">
      {/* Основные поля */}
      <TextField source="ID" label="ID" />
      <TextField source="NICKNAME" label="Никнейм" />
      
      {/* Дата регистрации - используем правильное поле REGISTRATION */}
      <DateField 
        source="REGISTRATION" 
        label="Дата регистрации"
        showTime
        locales="ru-RU"
        options={{
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }}
      />
      
      {/* Количество покупок - безопасный вариант */}
       <FunctionField
        label="Куплено звезд"
        source="purchasesCount" // Добавьте source для сортировки
        render={(record: any) => record.PURCHASES?.length || 0}
        sortable // Разрешить сортировку
      />
      
    </Datagrid>
  </List>
);