// src/App.tsx
import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
import authProvider from './authProvider'; 
import { UserList } from './components/users/UserList';
import { UserShow } from './components/users/UserShow';
import { StockList } from './components/stocks/StockList';
import { StockShow } from './components/stocks/StockShow';

const App = () => (
  <Admin 
    dataProvider={dataProvider}
    authProvider={authProvider}  
    defaultTheme="light"
  >
    <Resource
      name="users"
      list={UserList}
      show={UserShow}
      recordRepresentation="NICKNAME"
      options={{ label: 'Пользователи' }}
    />

    <Resource
      name="stocks"
      list={StockList}
      show={StockShow}
      recordRepresentation="type"
      options={{ label: 'Акции' }}
    />

    <Resource name="object-field" />
    <Resource name="currency-field" />
  </Admin>
);

export default App;
