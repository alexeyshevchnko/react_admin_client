import { useDataProvider, Loading } from 'react-admin';
import { useEffect, useState } from 'react';
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Stack, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ResourcesTypeWithIcon, ResourcesTypeWithIcon2 } from '../../../common/iconComponents';

interface Income {
  type: string;
  amount: number;
  income_amount_in_second: number;
}

interface Withdraw {
  _id: string;
  type: string;
  deposit_withdraw_amount: number;
  status: string;
  close_time: number;
  created_at: number;
}

interface Deposit {
  _id: string;
  deposit_id: string;
  income: Income[];
  withdraws: Withdraw[];
  deposit_amount: number;
  last_time_updated_process_speeed: number;
  created_at: number;
}

interface UserDepositsDetailsProps {
  userId: string;
}

const getDepositName = (depositId: string) => {
  const depositNames: Record<string, string> = {
    '1': 'MMToken',
    '2': 'Arkenstone',
    '3': 'Ruby',
    '4': 'Emerald',
    '5': 'Sapphire'
  };
  return depositNames[depositId] || `ID: ${depositId}`;
};

export const UserDepositsDetails = ({ userId }: UserDepositsDetailsProps) => {
  const dataProvider = useDataProvider();
  const [deposits, setDeposits] = useState<Deposit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  setLoading(true);
  dataProvider.getList('user-deposits', {
    filter: { userId: userId },
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'created_at', order: 'DESC' },
  })
  .then(({ data }) => {
    const sortedDeposits = data.sort((a: Deposit, b: Deposit) =>
      Number(a.deposit_id) - Number(b.deposit_id)
    );
    setDeposits(sortedDeposits);
    setLoading(false);
  })
  .catch((e) => {
    setError(e.message || 'Ошибка загрузки депозитов');
    setLoading(false);
  });
}, [dataProvider, userId]);


  if (loading) return <Loading />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!deposits || deposits.length === 0) return <Typography>Депозиты не найдены</Typography>;

  return (
    <Box>
      {deposits.map((deposit) => (
        <Accordion key={deposit._id} defaultExpanded={false}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
  <Box display="flex" alignItems="center" gap={1}>
    {/* Используем ResourcesTypeWithIcon2 и передаем type */}
    <ResourcesTypeWithIcon2 
      record={{ type: deposit.deposit_id === '1' ? 'mmtoken' : 
                       deposit.deposit_id === '2' ? 'arkenstone' :
                       deposit.deposit_id === '3' ? 'ruby' :
                       deposit.deposit_id === '4' ? 'emerald' :
                       'sapphire' }} 
      showLabel={false} 
    />
    <Typography>
      {getDepositName(deposit.deposit_id)} (amount: {deposit.deposit_amount}) (id: {deposit.deposit_id})
    </Typography>
  </Box>
</AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1">Доходы:</Typography>
                {deposit.income.map((inc, idx) => (
                  <Box key={idx} display="flex" alignItems="center" gap={1}>
                    <ResourcesTypeWithIcon2 record={inc} showLabel={false} />
                    <Typography>
                      {inc.amount.toFixed(2)} (в сек: {inc.income_amount_in_second.toFixed(7)})
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1">Выводы:</Typography>
                {deposit.withdraws.length === 0 && <Typography>Нет выводов</Typography>}
                {deposit.withdraws.map((wd) => (
                  <Box key={wd._id} sx={{ mb: 1, p: 1, border: '1px solid #ccc', borderRadius: 1 }}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ResourcesTypeWithIcon2 record={wd} showLabel={false} />
                      <Typography>
                        {wd.deposit_withdraw_amount}, {wd.status}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Создан: {new Date(wd.created_at * 1000).toLocaleString()}, 
                      Закрыт: {new Date(wd.close_time * 1000).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};