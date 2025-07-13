// src/App.tsx
import { Admin, Resource } from 'react-admin';
import { dataProvider } from './dataProvider';
//import { theme } from './theme';

// Компоненты
import { UserList} from './components/users/UserList';
import { UserShow } from './components/users/UserShow';
/*import { TransactionList } from './components/transactions';
import { ManufactureList } from './components/manufacture';
import { MarketStats } from './components/market';
import { StorageList } from './components/storage';
import { SuspiciousActivity } from './components/suspicious';
import { AppDashboard } from './pages/Dashboard';

// Кастомные поля
import { ObjectField } from './components/shared/ObjectField';
import { CurrencyField } from './components/shared/CurrencyField';
*/
const App = () => (
  <Admin 
    dataProvider={dataProvider}
    //dashboard={AppDashboard}
    //theme={theme}
    defaultTheme="light"
  >
    {/* Основные ресурсы */}
    <Resource
      name="users"
      list={UserList}
      show={UserShow}
     // edit={UserEdit}
      recordRepresentation="NICKNAME"
      options={{ label: 'Пользователи' }}
    />
     
    {/* Кастомные поля для всех ресурсов */}
    <Resource name="object-field" />
    <Resource name="currency-field" />
  </Admin>
);

export default App;