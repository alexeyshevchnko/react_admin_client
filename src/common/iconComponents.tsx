// src/components/iconComponents.tsx
import { getResourcesIcon } from './resourceLoader'; 

interface IconWithLabelProps {
  record?: {
    TYPE?: string;
    type?: string;
  };
  fieldName?: 'TYPE' | 'type';
}
 
export const IconWithLabel = ({ record, fieldName = 'TYPE' }: IconWithLabelProps) => {
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
      <span>{value}</span>
    </div>
  );
};
 
export const ResourcesTypeWithIcon = ({ record }: IconWithLabelProps) => (
  <IconWithLabel record={record} fieldName="TYPE" />
);

export const DwarfTypeWithIcon = ({ record }: IconWithLabelProps) => (
  <IconWithLabel record={record} fieldName="type" />
);