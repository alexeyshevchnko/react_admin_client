import { useRecordContext } from 'react-admin';

interface DateTimeFieldProps {
    source: string;
    label?: string;
    showLabel?: boolean; 
    showTime?: boolean; 
}

const DateTimeField = ({ source, label, showLabel = false, showTime = true }: DateTimeFieldProps) => {
    const record = useRecordContext();
    const rawValue = record?.[source];

    if (!rawValue) {
        const renderLabel = showLabel ?  label +": " : "";
        return <span>{renderLabel}Нет данных</span>;
    }

    // Преобразование значения в Date
    const parseDate = (value: string | number): Date | null => {
        if (typeof value === 'number') {
            return new Date(value * 1000); // Unix timestamp в секундах
        }

        if (typeof value === 'string') {
            const maybeNumber = Number(value);
            if (!isNaN(maybeNumber) && value.length <= 12) {
                return new Date(maybeNumber * 1000);
            }
            return new Date(value);
        }

        return null;
    };

    const date = parseDate(rawValue);

    if (!date || isNaN(date.getTime())) {
        return <span>{label ? `${label}: ` : ''}Некорректная дата</span>;
    }

    // Форматирование даты (и времени, если showTime = true)
    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        if (!showTime) {
            return `${day}.${month}.${year}`;
        }

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    };
    const renderLabel = showLabel ?  label +": " : "";
    return (
        <div>
            {<strong>{renderLabel}</strong>}
            {formatDate(date)}
        </div>
    );
};

export default DateTimeField;