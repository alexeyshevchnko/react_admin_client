// DateTimeField.tsx
import { useRecordContext } from 'react-admin';

const DateTimeField = (props: { source: string; label?: string }) => {
  const record = useRecordContext(props);
  
  if (!record || !record[props.source]) return null;

  // Конвертируем Unix timestamp в Date
  const date = new Date(record[props.source] * 1000);

  // Форматируем дату в нужный формат
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
  };

  return <span>{formatDate(date)}</span>;
};

export default DateTimeField;