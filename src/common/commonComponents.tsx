import { Box } from "@mui/material";
import { Datagrid, DatagridProps } from "react-admin";
import { ReactNode } from 'react';

interface ResponsiveFlexBoxProps {
  children: ReactNode;
  maxWidth?: number | string;
}


export const NoCheckboxDatagrid = ({ children, ...props }: DatagridProps) => (
    <Datagrid
        {...props}
        rowClick={false}
        bulkActionButtons={false}
        sx={{
            '& .RaDatagrid-checkbox': {
                display: 'none !important'  // Скрываем только чекбоксы
            },
            '& .RaDatagrid-thead th:first-of-type': {
                width: '1px',  // Минимальная ширина для заголовка
                padding: 0
            },
            '& .RaDatagrid-row td:first-of-type': {
                width: '1px',  // Минимальная ширина для ячейки
                padding: 0
            }
        }}
    >
        {children}
    </Datagrid>
); 


export const ResponsiveFlexBox = ({ children, maxWidth = 850 }: ResponsiveFlexBoxProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        justifyContent: 'left',
        overflowX: 'auto', // добавлено здесь
        width: '100%',
      }}
    >
      <Box sx={{ minWidth: 300, maxWidth: maxWidth, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};
