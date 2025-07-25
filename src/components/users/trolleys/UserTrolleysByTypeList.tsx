import React, { useState } from 'react';
import {
  List,
  TextField,
  NumberField,
  useGetList,
} from 'react-admin';
import { useMediaQuery, Theme, Typography, CircularProgress, Pagination } from '@mui/material';
import DateTimeField from '../../../common/dateTimeField';
import { NoCheckboxDatagrid, ResponsiveFlexBox } from '../../../common/commonComponents';
import RecordList from '../../../common/RecordList';

interface UserTrolleysByTypeListProps {
    user_id: string;
    type_id: string;
}

export const UserTrolleysByTypeList: React.FC<UserTrolleysByTypeListProps> = ({ user_id, type_id }) => {
  const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));

  // Добавим пагинацию для большого экрана
  const [page, setPage] = useState(1);
  const perPage = 10;

  // Получаем данные напрямую, чтобы кастомно рендерить
  const { data, total, isLoading, error } = useGetList('user_trolleys_by_type', {
    filter: { user_id, type_id },
    pagination: { page, perPage },
    sort: { field: 'created_at', order: 'DESC' },
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Ошибка при загрузке данных</Typography>;

  if (!data || data.length === 0) {
    return <Typography>Нет данных</Typography>;
  }

  const pageCount = total ? Math.ceil(total / perPage) : 1;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
       

      <ResponsiveFlexBox>
        {isSmall ? (
          // Мобильный компактный список
        <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
            <RecordList
                fields={[
                { label: 'Status', source: 'status', render: () => <TextField source="status" /> },
                { label: 'Open', source: 'open', render: () => <TextField source="open" /> },
                { label: 'Mint Attempts', source: 'mint_attempts', render: () => <NumberField source="mint_attempts" /> },
                { label: 'Ore Mined', source: 'ore_mined', render: () => <NumberField source="ore_mined" /> },
                { label: 'Ton Mined', source: 'ton_mined', render: () => <NumberField source="ton_mined" /> },
                { label: 'Cooldown Date', source: 'cooldown_date', render: () => <NumberField source="cooldown_date" /> },
                { label: 'Ore Collected At', source: 'ore_collected_at', render: () => <NumberField source="ore_collected_at" /> },
                { label: 'Ton Collected At', source: 'ton_collected_at', render: () => <NumberField source="ton_collected_at" /> },
                { label: 'Создано', source: 'created_at', render: () => <DateTimeField source="created_at" showTime={false} /> },
                { label: 'TrolleyId After Open', source: 'trolleyIdAfterOpen', render: () => <TextField source="trolleyIdAfterOpen" /> },
                { label: 'Deleted', source: 'deleted', render: () => <TextField source="deleted" /> },
                ]}
            />
        </NoCheckboxDatagrid>
        ) : (
          // Десктопный полный datagrid
          <NoCheckboxDatagrid data={data} bulkActionButtons={false}>
            <TextField source="status" />
            <TextField source="open" />
            <NumberField source="mint_attempts" />
            <NumberField source="ore_mined" />
            <NumberField source="ton_mined" />
            <NumberField source="cooldown_date" />
            <NumberField source="ore_collected_at" />
            <NumberField source="ton_collected_at" />
            <DateTimeField source="created_at" label="Создано" showTime={false} />
            <TextField source="trolleyIdAfterOpen" />
            <TextField source="deleted" />
          </NoCheckboxDatagrid>
        )}
      </ResponsiveFlexBox>

      {!isSmall && (
        <Pagination
          count={pageCount}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      )}
    </div>
  );
};
