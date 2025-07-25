import { useRecordContext } from 'react-admin';
import { ReactNode } from 'react';

type RecordListField = {
    label?: string;
    source: string;
    render?: (value: any, record: any) => ReactNode;
    alignRight?: boolean;
};

const RecordList = ({ fields }: { fields: RecordListField[] }) => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <ul style={{ margin: 0, paddingLeft: 16 }}>
            {fields.map((field, index) => {
                const value = record[field.source];
                const renderedValue = field.render
                    ? field.render(value, record)
                    : value?.toString?.() ?? '—';

                const alignStyle =   'left';

                return (
                    <li
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: field.alignRight ? 'column' : 'row',
                            justifyContent: field.alignRight ? 'flex-end' : 'flex-start',
                            alignItems:  'baseline',
                            padding: '4px 0',
                            gap: field.alignRight ? undefined : '4px',
                        }}
                    >
                        {field.label && (
                            <strong style={{ textAlign: alignStyle }}>
                                {field.label}
                                {':'}
                            </strong>
                        )}
                        <div style={{ textAlign: alignStyle }}>
                            {renderedValue}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default RecordList;
