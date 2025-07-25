import React, { useState } from 'react';
import {
  useMediaQuery,
  Theme,
  Pagination,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  List,
  Datagrid,
  NumberField,
  ListProps,
  useRecordContext,
  useGetList,
} from 'react-admin';
import ProcessCycleField from './ProcessCycleField';  
import RecordList from '../../../common/RecordList';
import DateTimeField from '../../../common/dateTimeField';
import { NoCheckboxDatagrid } from '../../../common/commonComponents';

const StatusAndLevelField = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <span>
      Уровень: {record.level} | Статус: {record.status}
    </span>
  );
}; 

export const ManufactureUserDetails: React.FC<Partial<ListProps>> = (props) => {
  const record = useRecordContext();
  const userId = record?.user_id || record?.ID || record?.id || record?._id;
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  const [page, setPage] = useState(1);
  const perPage = 5;

  const { data, total, isLoading, error } = useGetList('manufacture_user', {
    filter: { user_id: userId },
    pagination: { page, perPage },
    sort: { field: 'created_at', order: 'DESC' },
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Ошибка при загрузке данных производства</Typography>;

  if (!data || data.length === 0) {
    return <Typography>Нет данных о производстве</Typography>;
  }

  const pageCount = total ? Math.ceil(total / perPage) : 1;

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      {isSmall ? (
        <div style={{ overflowX: 'auto' }}>
          <NoCheckboxDatagrid bulkActionButtons={false} data={data}>
            <ProcessCycleField source="process_cicle" label="Process Cycle" />
            <RecordList
              fields={[
                {
                  label: 'Speed',
                  source: 'process_speed_in_second',
                  render: (val) => Number(val).toFixed(2),
                },
                {
                  label: 'Уровень',
                  source: 'level',
                },
                {
                  label: 'Статус',
                  source: 'status',
                },
              ]}
            />
          </NoCheckboxDatagrid>
        </div>
      ) : (
        <NoCheckboxDatagrid
          data={data}
          bulkActionButtons={false}
          rowClick={false}
          sx={{
            '& .RaDatagrid-table': {
              width: '100%',
            },
          }}
        >
          <ProcessCycleField source="process_cicle" label="Process Cycle" />
          <NumberField source="process_speed_in_second" label="Speed" />
          <StatusAndLevelField />
          <DateTimeField source="created_at" label="Дата создания" />
        </NoCheckboxDatagrid>
      )}

      <Pagination
        count={pageCount}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
};