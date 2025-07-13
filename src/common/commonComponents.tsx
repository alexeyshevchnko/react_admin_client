import { Datagrid, DatagridProps } from "react-admin";

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
