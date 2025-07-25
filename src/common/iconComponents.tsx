import { copperIcons, getResourcesIcon } from './resourceLoader';

//
// Базовый компонент отображения иконки и подписи
//
interface IconWithLabelProps {
  record?: {
    TYPE?: string;
    type?: string;
  };
  fieldName?: 'TYPE' | 'type';
  showLabel?: boolean;
}

export const IconWithLabel = ({
  record,
  fieldName = 'TYPE',
  showLabel = true,
}: IconWithLabelProps) => {
  const value = record?.[fieldName] || '';
  const icon = getResourcesIcon(value);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {icon && (
        <img
          src={icon}
          alt={value}
          style={{
            width: '20px',
            height: '20px',
            objectFit: 'contain',
          }}
        />
      )}
      {showLabel && <span>{value}</span>}
    </div>
  );
};

//
// Обёртки под разные поля данных (TYPE или type)
//
export const ResourcesTypeWithIcon2 = (props: IconWithLabelProps) => (
  <IconWithLabel {...props} fieldName="type" />
);

export const ResourcesTypeWithIcon = (props: IconWithLabelProps) => (
  <IconWithLabel {...props} fieldName="TYPE" />
);

//
// Dwarf – отображение иконки дворфа с типом и сортом (DWARF_MINER_1 и т.п.)
//
interface DwarfProps {
  record: {
    type?: string;
    sort?: number | string;
  };
}

export const DwarfTypeWithIcon = ({ record }: DwarfProps) => {
  const type = record?.type?.toLowerCase();
  const sort = Number(record?.sort);
  const dwarfKey = `DWARF_${type?.toUpperCase()}_${sort}`;
  const icon = getResourcesIcon(dwarfKey);

  if (icon) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src={icon} alt={`${type} Dwarf ${sort}`} style={{ width: 24, height: 24 }} />
        <span>{record.type}</span>
      </div>
    );
  }

  return <span>{record.type}</span>;
};

//
// Trolley – отображение иконки вагонетки (TROLLEY_MINER, TROLLEY_WARRIOR и т.п.)
//
interface TrolleyProps {
  record: {
    id?: string;
    name?: string;
    type?: string;
  };
}

export const TrolleyTypeWithIcon = ({ record }: TrolleyProps) => {
  if (!record) {
    console.warn('TrolleyTypeWithIcon: record is undefined');
    return <span>–</span>;
  }

  const typeRaw = record?.name;
  const type = typeRaw?.toLowerCase();
  const normalizedType = type?.toUpperCase() || '';
  const icon = getResourcesIcon(`TROLLEY_${normalizedType}`);

  if (icon) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img src={icon} alt={type} style={{ width: 24, height: 24 }} />
        <span>{record.name || type}</span>
      </div>
    );
  }

  return <span>{record.name || type || '–'}</span>;
};
