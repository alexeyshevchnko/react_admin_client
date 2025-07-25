import { useEffect, useState } from 'react';
import {
  useNotify,
  useDataProvider,
  useRecordContext,
} from 'react-admin';
import { ResourcesTypeWithIcon } from '../../../common/iconComponents';
import { Theme, useMediaQuery, Button, MenuItem, Select, TextField } from '@mui/material';

interface LogEntry {
  TIME: string;
  ACTION: string;
  TYPE: string;
  COUNT: number;
}

interface LogData {
  DAY: number;
  LOG: LogEntry[];
}

const formatTime = (timeStr: string) => {
  const [h = '0', m = '0', s = '0'] = timeStr.split(':');
  const pad = (n: string) => n.padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const AnalyticsPage = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const record = useRecordContext();
  const userId = record?.ID;

  const [collections, setCollections] = useState<string[]>([]);
  const [formState, setFormState] = useState({
    collectionName: '',
    minDay: null as number | null,
    maxDay: null as number | null,
  });
  const [logs, setLogs] = useState<LogData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const result = await dataProvider.getList('analytics_collections', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'name', order: 'ASC' },
          filter: {},
        });
        setCollections(result.data.map((item: any) => item.name));
      } catch (err) {
        notify('Ошибка загрузки коллекций', { type: 'error' });
      }
    };
    fetchCollections();
  }, [dataProvider, notify]);

  const fetchDayRange = async () => {
    const { collectionName } = formState;

    if (!collectionName || !userId) {
      notify('Выберите коллекцию (и убедитесь, что есть userId)', { type: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await dataProvider.getOne('analytics_day_range', {
        id: `${collectionName}:${userId}`,
      });
      setFormState(prev => ({
        ...prev,
        minDay: result.data.minDay,
        maxDay: result.data.maxDay,
      }));
    } catch (err) {
      notify('Ошибка получения диапазона дней', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    const { collectionName, minDay, maxDay } = formState;

    if (!collectionName || userId == null || minDay == null || maxDay == null) {
      notify('Пожалуйста, заполните все поля', { type: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const result = await dataProvider.getList('analytics_logs', {
        filter: { collectionName, userId, minDay, maxDay },
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'TIME', order: 'ASC' },
      });

      setLogs(result.data);
    } catch (error) {
      notify('Ошибка получения логов', { type: 'error' });
      console.error('Error in handleGenerate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formState) => (value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'collectionName' ? { minDay: null, maxDay: null } : {}),
    }));
    setLogs([]);
  };

  return (
    <div style={{ padding: 20 }}>

      <div style={{ marginBottom: 16 }}>
        <label>Коллекция:</label><br />
        <Select
          fullWidth
          value={formState.collectionName}
          onChange={e => handleChange('collectionName')(e.target.value)}
          disabled={isLoading}
          displayEmpty
        >
          <MenuItem value="">-- Выберите --</MenuItem>
          {collections.map(c => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
      </div>

      <Button
        variant="contained"
        onClick={fetchDayRange}
        disabled={!formState.collectionName || !userId || isLoading}
        sx={{ mb: 2, mr: 1 }}
      >
        Получить диапазон
      </Button>

      <div style={{ marginBottom: 16 }}>
        <TextField
          label="Min Day"
          type="number"
          value={formState.minDay ?? ''}
          onChange={e => handleChange('minDay')(e.target.value ? Number(e.target.value) : null)}
          disabled={isLoading}
          fullWidth
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <TextField
          label="Max Day"
          type="number"
          value={formState.maxDay ?? ''}
          onChange={e => handleChange('maxDay')(e.target.value ? Number(e.target.value) : null)}
          disabled={isLoading}
          fullWidth
        />
      </div>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleGenerate}
        disabled={!formState.collectionName || userId == null || formState.minDay == null || formState.maxDay == null || isLoading}
        sx={{ mb: 2 }}
      >
        Сформировать отчёт
      </Button>

      {isLoading && <p>Загрузка...</p>}

      {logs.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>Результаты:</h3>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <h4>День {log.DAY}</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {isSmall ? (
                      <th style={{ borderBottom: '1px solid #ccc' }}> </th>
                    ) : (
                      <>
                        <th style={{ borderBottom: '1px solid #ccc' }}>Время</th>
                        <th style={{ borderBottom: '1px solid #ccc' }}>Действие</th>
                      </>
                    )}
                    <th style={{ borderBottom: '1px solid #ccc' }}>Тип</th>
                    <th style={{ borderBottom: '1px solid #ccc' }}>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {log.LOG.map((entry, j) => (
                    <tr key={j}>
                      {isSmall ? (
                        <td style={{ borderBottom: '1px solid #eee' }}>
                          <strong>{formatTime(entry.TIME)}</strong><br />{entry.ACTION}
                        </td>
                      ) : (
                        <>
                          <td style={{ borderBottom: '1px solid #eee' }}>{formatTime(entry.TIME)}</td>
                          <td style={{ borderBottom: '1px solid #eee' }}>{entry.ACTION}</td>
                        </>
                      )}
                      <td style={{ borderBottom: '1px solid #eee' }}>
                        <ResourcesTypeWithIcon record={entry} />
                      </td>
                      <td style={{ borderBottom: '1px solid #eee' }}>
                        {Number(entry.COUNT).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;
