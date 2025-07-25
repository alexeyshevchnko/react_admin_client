import {
  List,
  NumberField,
  Datagrid,
  FunctionField,
} from 'react-admin';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import { UserTrolleysByTypeList } from './UserTrolleysByTypeList';
import { TrolleyTypeWithIcon } from '../../../common/iconComponents';

export const UserTrolleysGrouped = ({ userId }: { userId: string }) => {
  const [selected, setSelected] = useState<any>(null);
  const scrollPosition = useRef<number>(0);

  const handleRowClick = (record: any) => {
    scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;
    setSelected(record);
  };

  const handleClose = () => {
    setSelected(null);
    window.scrollTo(0, scrollPosition.current);
  };

  if (!userId) return <Typography>Нет данных</Typography>;

  return (
    <>
      <List
        resource="trolleys_grouped"
        filter={{ user_id: userId }}
        perPage={10}
        title="Тележки пользователя (группировка)"
        empty={<Typography>У пользователя нет тележек</Typography>}
      >
        <Datagrid
          bulkActionButtons={false}
          rowClick={(id, resource, record) => {
            handleRowClick(record);
            return ''; // отменяет переход по ссылке
          }}
        >
          <FunctionField
            label="Тип"
            render={(record) => <TrolleyTypeWithIcon record={record} />}
          />
          <NumberField source="count" label="Количество" />
        </Datagrid>
      </List>

      <Dialog
        open={!!selected}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        disableAutoFocus
        disableScrollLock={true}
      >
        <DialogTitle>
          Тележки типа «{selected?.name}»
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selected && (
            <UserTrolleysByTypeList
              user_id={userId}
              type_id={selected.id}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
