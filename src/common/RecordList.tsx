import { useRecordContext } from 'react-admin';
import { ReactNode } from 'react';

type RecordListField = {
    label?: string;
    source: string;
    render?: (value: any, record: any) => ReactNode;
    alignRight?: boolean; // Новый параметр для выравнивания по правому краю
};

const RecordList = ({ fields }: { fields: RecordListField[] }) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <ul style={{ 
            margin: 0, 
            paddingLeft: 16,
            
        }}>
            {fields.map((field, index) => {
                const value = record[field.source];
                const renderedValue = field.render
                    ? field.render(value, record)
                    : value?.toString?.() ?? '—';

                return (
                    <li 
                        key={index} 
                        style={{ 
                            display: 'flex',
                            justifyContent: field.alignRight ? 'flex-end' : 'flex-start', // Выравнивание
                            alignItems: 'center',
                            gap: '8px',
                            padding: '4px 0'
                        }}
                    >
                        <span style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textAlign: field.alignRight ? 'right' : 'left' // Дублируем выравнивание для текста
                        }}>
                            {field.label && (
                                <>
                                    <strong>{field.label}</strong>
                                    {': '}
                                </>
                            )}
                            <span style={{
                                display: 'inline-block',
                                width: 'auto', // Для правильного выравнивания
                                textAlign: field.alignRight ? 'right' : 'left'
                            }}>
                                {renderedValue}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ul>
    );
};

export default RecordList;