// src/components/ObjectField.tsx
import { Chip, Stack } from '@mui/material';
import { FieldProps } from 'react-admin';

interface ObjectFieldProps extends FieldProps {
  source: string;
}

export const ObjectField = ({ record, source }: ObjectFieldProps) => {
  if (!record || !source) return null;
  
  const value = record[source];
  if (!value) return null;

  // Для массива объектов
  if (Array.isArray(value)) {
    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {value.map((item, index) => (
          <Chip 
            key={index}
            label={typeof item === 'object' 
              ? Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ')
              : String(item)
            }
            size="small"
          />
        ))}
      </Stack>
    );
  }

  // Для одиночного объекта
  if (typeof value === 'object' && value !== null) {
    return (
      <Chip
        label={Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ')}
        size="small"
      />
    );
  }

  return <span>{String(value)}</span>;
};