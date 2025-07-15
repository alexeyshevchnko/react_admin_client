// src/components/DwarvesDetails.tsx

import {
    useRecordContext,
    useGetList,
    ReferenceField,
    FunctionField,
    NumberField, 
} from 'react-admin';  
import { NoCheckboxDatagrid } from '../../../common/commonComponents';
import { DwarfTypeWithIcon } from '../../../common/iconComponents';
import DateTimeField from '../../../common/dateTimeField';

export const DwarvesDetails = () => {
    const record = useRecordContext();
    const { data, isLoading } = useGetList('user_dwarves', {
        filter: { user_id: record?.ID?.toString() },
        pagination: { page: 1, perPage: 100 }
    });

    if (isLoading) return <div>Загрузка данных о дворфах...</div>;
    if (!data || data.length === 0) return <div>Нет данных о дворфах</div>;

    return (
        <NoCheckboxDatagrid
            data={data}
            sx={{ minWidth: 650 }}
        >
            <ReferenceField
                source="dwarf_id"
                reference="dwarves"
                label="Тип"
                link={false}
                sortable
            >
                <FunctionField
                    source="type"
                    render={(dwarfRecord) => <DwarfTypeWithIcon record={dwarfRecord} />}
                />
            </ReferenceField>
            <NumberField source="count" label="Количество" sortable />
            <DateTimeField source="created_at" label="Получил" />
             
        </NoCheckboxDatagrid>
    );
};
