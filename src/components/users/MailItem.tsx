import React from 'react';
import { useRecordContext } from 'react-admin';
import { Datagrid, FunctionField } from 'react-admin';
import { Chip, Typography, Box, Stack } from '@mui/material';
import DateTimeField from '../../common/dateTimeField';
import { IconWithLabel } from '../../common/iconComponents';

// Функция для получения всех наград из письма
const getAllRewards = (mail: any) => {
  const rewards = [];

  // Обычные награды
  if (Array.isArray(mail.REWARDS)) {
    rewards.push(...mail.REWARDS.map((r: any) => ({
      type: r.TYPE,
      count: r.COUNT,
      isCurrency: true // Флаг для валютных наград
    })));
  }

  // Пазлы
  if (Array.isArray(mail.REWARDS_PUZZLE)) {
    rewards.push(...mail.REWARDS_PUZZLE.map((r: any) => ({
      type: 'Puzzle',
      count: r.count,
      isCurrency: false
    })));
  }

  // Гномы
  if (Array.isArray(mail.REWARDS_DWARF)) {
    rewards.push(...mail.REWARDS_DWARF.map((r: any) => ({
      type: 'Dwarf',
      count: r.count,
      isCurrency: false
    })));
  }

  // Акции
  if (Array.isArray(mail.REWARDS_STOCK)) {
    rewards.push(...mail.REWARDS_STOCK.map((r: any) => ({
      type: 'Stock',
      count: r.count,
      isCurrency: false
    })));
  }

  return rewards;
};

export const UserMailList = () => {
  const record = useRecordContext();
  const mailData = record?.MAIL || [];

  // Сортируем письма по дате в убывающем порядке
  const sortedMailData = [...mailData].sort((a, b) => {
    return new Date(b.DATE).getTime() - new Date(a.DATE).getTime();
  });

  if (sortedMailData.length === 0) {
    return <Typography>Нет сообщений</Typography>;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Datagrid
        data={sortedMailData}
        total={sortedMailData.length}
        bulkActionButtons={false}
        rowClick={false}
        sx={{
          '& .RaDatagrid-table': {
            width: '100%',
          },
          '& .MuiTableCell-root': {
            padding: '8px', // Уменьшаем отступы для мобильных
          }
        }}
      >
       {/* Колонка "Письмо" */}
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
        
        {/* Добавленная строка с ключом письма */}
        {mail.KEY && (
          <Typography variant="caption" color="text.secondary" fontSize={10}>
            Ключ письма: {mail.KEY}
          </Typography>
        )}
      </Stack>
    );
  }}
/>

        {/* Универсальная колонка "Награды" */}
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
                maxWidth: '200px' // Ограничиваем ширину для мобильных
              }}>
                {rewards.map((reward: any, idx: number) => (
                  <Chip
                    key={idx}
                    label={
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        fontSize: '12px' // Уменьшаем размер текста
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
                        padding: 0
                      }
                    }}
                  />
                ))}
              </Box>
            );
          }}
        />

        {/* Колонка "Дата" */}
        <DateTimeField 
          source="DATE" 
          label="Дата" 
          showTime
          
        />

   <FunctionField
  label="Статус"
  render={(mail: any) => mail.STATUS}
/>
      </Datagrid>
    </Box>
  );
};