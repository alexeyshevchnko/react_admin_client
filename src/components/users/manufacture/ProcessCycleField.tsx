import React from 'react';
import { useRecordContext, FieldProps } from 'react-admin'; 
import { IconWithLabel } from '../../../common/iconComponents';
//import { Theme, useMediaQuery } from '@mui/material';

//const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
 
const ProcessCycleField: React.FC<FieldProps> = (props) => {
  const record = useRecordContext(props);
  if (!record || !record.process_cicle) return <span>Нет данных</span>;
   
  return (
    <ul style={{ margin: 0, paddingLeft: 16 }}>
      {record.process_cicle.map((item: any, index: number) => (
        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconWithLabel record={{ TYPE: item.to_currensy_type }} />
          <span>
            {item.to_currensy_amount.toFixed(2)} ({item.progress_percent.toFixed(1)}%)
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ProcessCycleField;