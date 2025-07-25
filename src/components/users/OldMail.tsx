import React, { useState } from 'react';
import {
  useGetList,
  useRecordContext,
  Datagrid,
  FunctionField,
} from 'react-admin';
import {
  Chip,
  Typography,
  Box,
  Stack,
  CircularProgress,
  Pagination,
} from '@mui/material';
import DateTimeField from '../../common/dateTimeField';
import { IconWithLabel } from '../../common/iconComponents';

// Функция для получения всех наград из письма
const getAllRewards = (mail: any) => {
  const rewards = [];

  if (Array.isArray(mail.REWARDS)) {
    rewards.push(...mail.REWARDS.map((r: any) => ({
      type: r.TYPE,
      count: r.COUNT,
      isCurrency: true,
    })));
  }
  if (Array.isArray(mail.REWARDS_PUZZLE)) {
    rewards.push(...mail.REWARDS_PUZZLE.map((r: any) => ({
      type: 'Puzzle',
      count: r.count,
      isCurrency: false,
    })));
  }
  if (Array.isArray(mail.REWARDS_DWARF)) {
    rewards.push(...mail.REWARDS_DWARF.map((r: any) => ({
      type: 'Dwarf',
      count: r.count,
      isCurrency: false,
    })));
  }
  if (Array.isArray(mail.REWARDS_STOCK)) {
    rewards.push(...mail.REWARDS_STOCK.map((r: any) => ({
      type: 'Stock',
      count: r.count,
      isCurrency: false,
    })));
  }
  return rewards;
};

export const OldMailList = () => {
  const record = useRecordContext();
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, total, isLoading, error } = useGetList('oldMail', {
    filter: { userId: record?.ID },
    pagination: { page, perPage },
    sort: { field: 'DATE', order: 'DESC' },
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography color="error">Ошибка загрузки писем</Typography>;
  if (!data || data.length === 0) return <Typography>Нет сообщений</Typography>;

  const pageCount = total ? Math.ceil(total / perPage) : 1;

  return (
    <Box sx={{ mt: 2 }}>
      <Datagrid
        data={data}
        bulkActionButtons={false}
        rowClick={false}
        sx={{
          '& .RaDatagrid-table': {
            width: '100%',
          },
          '& .MuiTableCell-root': {
            padding: '8px',
          },
        }}
      >
        <FunctionField
          label="Письмо"
          render={(mail: any) => {
            const langData = mail.LANGUAGE?.find((lang: any) => lang.TYPE === 'RU') || mail.LANGUAGE?.[0];
            return (
              <Stack spacing={0.5}>
                <Typography fontWeight="bold" fontSize={14}>
                  {langData?.TITLE || 'Без темы'}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize={12}>
                  {langData?.DESCRIPTION || 'Нет содержимого'}
                </Typography>
                {mail.KEY && (
                  <Typography variant="caption" color="text.secondary" fontSize={10}>
                    Ключ письма: {mail.KEY}
                  </Typography>
                )}
              </Stack>
            );
          }}
        />
        <FunctionField
          label="Награды"
          render={(mail: any) => {
            const rewards = getAllRewards(mail);
            if (rewards.length === 0) {
              return (
                <Typography variant="body2" color="text.secondary" fontSize={12}>
                  Нет
                </Typography>
              );
            }
            return (
              <Box sx={{
                display: 'flex',
                gap: 0.5,
                flexWrap: 'wrap',
                maxWidth: '200px',
              }}>
                {rewards.map((reward: any, idx: number) => (
                  <Chip
                    key={idx}
                    label={
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        fontSize: '12px',
                      }}>
                        <IconWithLabel
                          record={{ TYPE: reward.type }}
                          showLabel={false}
                        />
                        <span>
                          {reward.isCurrency
                            ? Number(reward.count).toFixed(2)
                            : reward.count} {reward.type}
                        </span>
                      </Box>
                    }
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 'auto',
                      padding: '2px 4px',
                      '& .MuiChip-label': {
                        padding: 0,
                      },
                    }}
                  />
                ))}
              </Box>
            );
          }}
        />
        <DateTimeField
          source="DATE"
          label="Дата"
          showTime
        />
        <FunctionField
          label="Статус"
          render={(mail: any) => (
            <Typography
              color={mail.STATUS === 'READ' ? 'text.secondary' : 'primary.main'}
              fontWeight={mail.STATUS === 'UNREAD' ? 'bold' : 'normal'}
            >
              {mail.STATUS === 'READ' ? 'Прочитано' : 'Новое'}
            </Typography>
          )}
        />
      </Datagrid>

      {/* Пагинация */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
};
