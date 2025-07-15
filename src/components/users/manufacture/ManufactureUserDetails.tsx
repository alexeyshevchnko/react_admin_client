import React from 'react';
import {
  List,
  Datagrid,
  NumberField,
  ListProps,
  useRecordContext, 
} from 'react-admin';
import { useMediaQuery, Theme } from '@mui/material';
import ProcessCycleField from './ProcessCycleField';  
import RecordList from '../../../common/RecordList';
import DateTimeField from '../../../common/dateTimeField';
 

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

  return (
    <List
      {...props}
      resource="manufacture_user"
      filter={{ user_id: userId }}
      perPage={100}
      sort={{ field: 'created_at', order: 'DESC' }}
    >
      {isSmall ? (
          <div style={{ overflowX: 'auto' }}>
            <Datagrid
              bulkActionButtons={false}
              rowClick={false}
              sx={{
                '& .RaDatagrid-table': {
                  width: '100%',
                  minWidth: '370px',  
                },
              }}
            >
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
            </Datagrid>
          </div>
        ) : (
          <Datagrid
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
          </Datagrid>
        )}
    </List>
  );
};
