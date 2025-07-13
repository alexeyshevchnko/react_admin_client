import React from 'react';
import {
  List,
  Datagrid,
  TextField, 
  NumberField,
  ListProps,
  useRecordContext,
  FieldProps,
} from 'react-admin';
import ProcessCycleField from './ProcessCycleField';
import DateTimeField from '../../common/dateTimeField';

const TimestampDateField: React.FC<FieldProps> = (props) => {
  const record = useRecordContext(props);
  const value = record ? record[props.source as string] : undefined;

  if (!value) return <span>—</span>;

  // Преобразуем секунды в миллисекунды
  const date = new Date(value * 1000);

  return <span>{date.toLocaleString()}</span>;
};


export const ManufactureUserDetails: React.FC<Partial<ListProps>> = (props) => {
  const record = useRecordContext();
  const userId = record?.user_id || record?.ID || record?.id || record?._id;

  return (
    <List
      {...props}
      resource="manufacture_user"
      filter={{ user_id: userId }}
      perPage={100}
      sort={{ field: 'created_at', order: 'DESC' }}
    >
      <Datagrid 
        bulkActionButtons={false}
        rowClick={false} 
        sx={{ '& .RaDatagrid-table': { width: '100%', minWidth: '650px' } }}
      >
        <ProcessCycleField source="process_cicle" label="Process Cycle" />
        <NumberField source="level" label="Level" /> 
        <NumberField source="process_speed_in_second" label="Speed" />
        {/*<DateTimeField source="last_time_updated_process_speeed" label="Last Update Time" />*/}
        <TextField source="status" label="Status" />
        <TimestampDateField source="created_at" label="Дата создания" />
       
      </Datagrid>
    </List>
  );
};
