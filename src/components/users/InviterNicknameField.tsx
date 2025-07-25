import { useEffect, useState } from 'react';
import { useRecordContext, fetchUtils, FunctionField } from 'react-admin';
import { CircularProgress, Typography } from '@mui/material'; 
import { API_URL } from '../../config';
import { UserIdLink } from '../../common/LinkHelper';

interface UserResponse {
  _id:string;
  ID: string;
  NICKNAME: string;
}

const InviterNicknameField = () => {
  const record = useRecordContext();
  const [nickname, setNickname] = useState<string | null>(null);
  const [_id, set_id] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNickname = async () => {
      if (!record?.INVITER) return;

      setLoading(true);
      try {
        const { json } = await fetchUtils.fetchJson(`${API_URL}/users/byTelegramId/${record.INVITER}`);
        const data = json as UserResponse;
        setNickname(data.NICKNAME || 'Неизвестно');
        set_id(data._id);
      } catch (error) {
        console.error('Ошибка при получении пригласителя:', error);
        setNickname('Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };

    fetchNickname();
  }, [record?.INVITER]);

  if (!record?.INVITER) {
    return <Typography variant="body2">Нет пригласителя</Typography>;
  }

  if (loading) {
    return <CircularProgress size={16} />;
  }

  return (
      <Typography variant="body2" component="div">
  Пригласил:{' '}
  {_id ? (
    <UserIdLink id={_id} label={record.INVITER} />
  ) : (
    record.INVITER
  )} 
  {nickname}
</Typography>

  );
};

export default InviterNicknameField;
