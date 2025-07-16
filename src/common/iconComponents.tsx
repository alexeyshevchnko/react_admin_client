import { getResourcesIcon } from './resourceLoader'; 

interface IconWithLabelProps {
  record?: {
    TYPE?: string;
    type?: string;
  };
  fieldName?: 'TYPE' | 'type';
  showLabel?: boolean; // <-- новый флаг
}

export const IconWithLabel = ({
  record,
  fieldName = 'TYPE',
  showLabel = true, // по умолчанию true
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
            objectFit: 'contain'
          }} 
        />
      )}
      {showLabel && <span>{value}</span>} {/* ← только если showLabel */}
    </div>
  );
};

export const ResourcesTypeWithIcon = (props: IconWithLabelProps) => (
  <IconWithLabel {...props} fieldName="TYPE" />
);

export const DwarfTypeWithIcon = (props: IconWithLabelProps) => (
  <IconWithLabel {...props} fieldName="type" />
);
