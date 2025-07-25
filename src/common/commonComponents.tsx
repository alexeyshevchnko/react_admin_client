import { Alert, Box, ButtonBase, Snackbar, Typography } from "@mui/material";
import { Datagrid, DatagridProps, Link } from "react-admin";
import { ReactNode, useState } from 'react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';  


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

interface ResponsiveFlexBoxProps {
  children: ReactNode;
  maxWidth?: number | string;
}

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

interface CopyableAddressProps {
  label: string;
  value: string;
}
export const CopyableAddress = ({ label, value }: CopyableAddressProps) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Если значение пустое, показываем только label и текст "не указано"
  if (!value) {
    return (
      <Typography
        component="span"
        variant="body2"
        color="text.secondary"
        sx={{ display: 'block' }}
      >
        {label}: не указано
      </Typography>
    );
  }

  return (
    <>
      <Typography
        component="span"
        variant="body2"
        color="text.secondary"
        sx={{ display: 'block' }}
      >
        {label}:{' '}
        <ButtonBase
          onClick={handleCopy}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: 'inherit'
          }}
        >
          {value}
          <ContentCopyIcon fontSize="inherit" />
        </ButtonBase>
      </Typography>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '@media (max-width: 600px)': {
            bottom: 90,
            top: 'auto',
            left: '50%',
            transform: 'translateX(-50%)'
          }
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: '100%' }}
        >
          Copied!
        </Alert>
      </Snackbar>
    </>
  );
};