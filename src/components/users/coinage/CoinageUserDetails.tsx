import {
  useRecordContext,
  useGetList,
  DateField,
} from 'react-admin';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Divider,
  useMediaQuery,
  CircularProgress
} from '@mui/material'; 
import { IconWithLabel } from '../../../common/iconComponents';

interface ProcessSpeed {
  type: string;
  amount: number;
}

interface ProcessCycle {
  index: number;
  to_currensy_type: string;
  to_currensy_amount: number;
  sort: number;
  progress_percent: number;
}

interface CoinageRecord {
  id: string;
  user_id: string;
  level: number;
  level_speed: number;
  level_storage_gems: number;
  level_storage_ingots: number;
  coinage_id: string;
  process_speed_in_second: ProcessSpeed[];
  last_time_updated_process_speeed: number;
  status: string;
  created_at: number;
  process_cycle: ProcessCycle[];
}

export const CoinageUserDetails = () => {
  const userRecord = useRecordContext();
  const userId = userRecord?.user_id || userRecord?.ID || userRecord?.id || userRecord?._id;
  const isSmall = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));

  const { data, isLoading } = useGetList<CoinageRecord>('coinage_user', {
    filter: { user_id: userId },
    sort: { field: 'created_at', order: 'DESC' },
    pagination: { page: 1, perPage: 3 }
  });

  if (isLoading) return (
    <Box display="flex" justifyContent="center" p={2}>
      <CircularProgress size={24} />
    </Box>
  );

  if (!data || data.length === 0) return (
    <Typography variant="body2" sx={{ p: 2 }}>Нет данных о чеканке</Typography>
  );

  return (
    <Box sx={{ mt: 1 }}>
      {data.map((record: CoinageRecord) => (
        <Card key={record.id} sx={{ mb: 2, borderRadius:0, boxShadow: 1 }}>
          <CardContent> 
            {/* Основные характеристики */}
            Основные характеристики: 
            <Box display="flex" flexDirection={isSmall ? 'column' : 'row'} gap={2} mt={1.5}>
              <Box flex={1}>   
                 <Box display="flex" alignItems="center">
                  <Typography variant="body2" sx={{ minWidth: 50 }}>
                    id #{record.coinage_id}
                  </Typography>
                  <Typography variant="body2" color={record.status === 'active' ? 'success.main' : 'text.secondary'}>
                    Статус: <strong>{record.status}</strong>
                  </Typography>
                </Box>
 
                <Typography variant="body2">
                  level: {record.level}
                </Typography>
                <Typography variant="body2">
                  level_speed: {record.level_speed}
                </Typography>
                <Typography variant="body2">
                  level_storage_gems: {record.level_storage_gems}
                </Typography><Typography variant="body2">
                  level_storage_ingots: {record.level_storage_ingots}
                </Typography>
              </Box>
               
            </Box>

            {/* Даты */}
            <Box mt={1.5}>
              <Typography variant="body2">             
                Обновлено:{' '}
                <DateField 
                  record={record} 
                  source="last_time_updated_process_speeed" 
                  showTime 
                  locales="ru-RU"
                  options={{
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }}
                  transform={value => new Date(value * 1000)}
                />
              </Typography>
              <Typography variant="body2">
                Создано:{' '}
                <DateField 
                  record={record} 
                  source="created_at" 
                  showTime 
                  locales="ru-RU"
                  options={{
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }}
                  transform={value => new Date(value * 1000)}
                />
              </Typography>
            </Box>

            {/* Скорости обработки */}
            <Divider sx={{ my: 1.5 }} />
            Скорости обработки: 

            <Box display="grid" gridTemplateColumns={isSmall ? '1fr' : '1fr 1fr'}  gap={2} mt={1.5}>
              {record.process_speed_in_second?.map((speed: ProcessSpeed, index: number) => (
                <Box key={index} display="flex" alignItems="center">
                  <Typography variant="body2" component="span" sx={{ minWidth: 90 }}>
                    <IconWithLabel record={{ TYPE:  speed.type }} />
                  </Typography>
                  <Typography variant="body2" >
                    {speed.amount.toFixed(6)}/сек
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Циклы обработки */}
            {record.process_cycle?.length > 0 && (
              <> 
                <Divider sx={{ my: 1.5 }} />
                Текущий цикл обработки:
                    
                {record.process_cycle.map((cycle: ProcessCycle, index: number) => (
                  <Box key={index} display="flex" alignItems="center" gap={2} mt={1.5}>
                  <Typography variant="body2" component="span" sx={{ minWidth: 100 }}>
                    <IconWithLabel record={{ TYPE: cycle.to_currensy_type }} />
                  </Typography>
                  <Typography variant="body2" sx={{ minWidth: 50 }}>
                    :{cycle.to_currensy_amount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                      Прогресс: {cycle.progress_percent.toFixed(1)}% 
                  </Typography>
                </Box> 
                ))}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};