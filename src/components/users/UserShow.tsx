import {
    Show,
    SimpleShowLayout,
    TextField,
    DateField,
    NumberField,
    ArrayField,
    Datagrid,
    FunctionField,
    useRecordContext,
    useGetList,
    TopToolbar,
    EditButton,
    DeleteButton, 
    ReferenceField,
} from 'react-admin';

import { 
    Typography, 
    Divider, 
    Chip, 
    Stack, 
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react';
import { DwarfTypeWithIcon, ResourcesTypeWithIcon } from '../../common/iconComponents';
import { NoCheckboxDatagrid } from '../../common/commonComponents';
import TonTransactionsSection from './TonTransactionsSection'; 
import { ManufactureUserDetails } from '../manufacture/ManufactureUserDetails'; 
import  {CoinageUserDetails}  from '../coinage/CoinageUserDetails';


const UserTitle = () => {
    const record = useRecordContext();
    return <span>Пользователь: {record ? `${record.NICKNAME} (ID: ${record._id})` : ''}</span>;
};

const UserShowActions = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton />
    </TopToolbar>
);

const UserStats = () => {
    const record = useRecordContext();
    return (
        <Stack direction="column" spacing={2} sx={{ my: 2 }}>
            <Chip label={`Звезд куплено: ${record?.PURCHASES?.length || 0}`} />
        </Stack>
    );
};

const UserDwarvesTab = () => {
    const record = useRecordContext();
    const { data, isLoading } = useGetList('user_dwarves', {
        filter: { user_id: record?.ID.toString() },
        pagination: { page: 1, perPage: 100 }
    });

    if (isLoading) return <div>Загрузка данных о дворфах...</div>;

    return (
        <div> 
            <NoCheckboxDatagrid
                data={data}
                sx={{ '& .RaDatagrid-table': { minWidth: '650px' } }}
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
                
                <NumberField 
                    source="count" 
                    label="Количество" 
                    sortable  
                />
                
                <DateField 
                    sortable  
                    source="created_at" 
                    label="Получил"
                    showTime
                    locales="ru-RU"
                    options={{
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }}
                    transform={value => new Date(value * 1000)}
                />
            </NoCheckboxDatagrid>
        </div>
    );
};

const MarketStatsTab = () => {
    const record = useRecordContext();
    const { data: topBuys, isLoading: loadingBuys } = useGetList('offers', {
        filter: { BUYER_ID: record?._id },
        sort: { field: 'PRICE', order: 'DESC' },
        pagination: { page: 1, perPage: 5 }
    });
    
    const { data: topSells, isLoading: loadingSells } = useGetList('offers', {
        filter: { SELLER_ID: record?._id },
        sort: { field: 'PRICE', order: 'DESC' },
        pagination: { page: 1, perPage: 5 }
    });

    if (loadingBuys || loadingSells) return <div>Загрузка данных о сделках...</div>;

    return (
        <>
            <Typography variant="h6" gutterBottom>Топ сделок</Typography>
            <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
                <div>
                    <Typography variant="subtitle1">Топ покупок</Typography>
                    {topBuys?.map((offer) => (
                        <div key={offer.id}>
                            {offer.ITEM} - {offer.AMOUNT} шт. за {offer.PRICE} MMT
                        </div>
                    ))}
                </div>
                <div>
                    <Typography variant="subtitle1">Топ продаж</Typography>
                    {topSells?.map((offer) => (
                        <div key={offer.id}>
                            {offer.ITEM} - {offer.AMOUNT} шт. за {offer.PRICE} MMT
                        </div>
                    ))}
                </div>
            </Stack>
        </>
    );
};

interface LazyAccordionProps {
    title: string;
    children: ReactNode;
    defaultExpanded?: boolean;
}

const LazyAccordion = ({ title, children, defaultExpanded = false }: LazyAccordionProps) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const [hasLoaded, setHasLoaded] = useState(defaultExpanded);
    
    const handleChange = (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded);
        if (isExpanded && !hasLoaded) {
            setHasLoaded(true);
        }
    };
    
    return (
        <Accordion 
            expanded={expanded} 
            onChange={handleChange}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {expanded && hasLoaded ? children : <Typography>Загрузка...</Typography>}
            </AccordionDetails>
        </Accordion>
    );
};

export const UserShow = () => {
    return (
        <Show title={<UserTitle />} actions={<UserShowActions />}>
            <Box sx={{ width: '100%' }}>
                {/* Основная информация */}
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Основная информация</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <SimpleShowLayout>
                            <TextField source="ID" label="ID пользователя" />
                            <TextField source="NICKNAME" label="Никнейм" />
                            <TextField source="WALLET" label="WALLET" />
                            <DateField 
                                source="REGISTRATION" 
                                label="Дата регистрации"
                                showTime
                                locales="ru-RU"
                                options={{
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }}
                            />
                            <DateField 
                                source="LAST_DAY_ONLINE" 
                                label="Последняя активность"
                                showTime
                                locales="ru-RU"
                                options={{
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }}
                            />
                            <UserStats />
                        </SimpleShowLayout>
                    </AccordionDetails>
                </Accordion>

                {/* Финансовые операции */}
                <LazyAccordion title="[Вовод Вывод Тон]">
                    <TonTransactionsSection />
                </LazyAccordion>

                {/* [Операции по переработкам] */}
                <LazyAccordion title="[Операции по переработкам]">
                    <ManufactureUserDetails />
                </LazyAccordion>
                
                <LazyAccordion title="[Операции по чеканке]">
                    <CoinageUserDetails />
                </LazyAccordion> 

                {/* [Операции по складу] */}
                <LazyAccordion title="[Операции по складу]">
                    <SimpleShowLayout> 
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="h6" sx={{ textAlign: 'left' }} gutterBottom>Текущий склад</Typography>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: { xs: 2, md: 4 },
                                justifyContent: 'center',
                                alignItems: 'flex-start'
                            }}>
                                {/* Первая таблица (CURRENCY) */}
                                <Box sx={{ width: { xs: '100%', md: '50%' }, maxWidth: '300px' }}>
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                    CURRENCY
                                </Typography>
                                <ArrayField source="CURRENCIES">
                                    <NoCheckboxDatagrid>
                                     <FunctionField
                                        label="Тип"
                                        source="TYPE"
                                        sortable
                                        render={(record) => <ResourcesTypeWithIcon record={record} />}
                                    />
                                    <NumberField source="COUNT" /> 
                                    </NoCheckboxDatagrid>
                                </ArrayField>
                                </Box>

                                {/* Вторая таблица (CURRENCY_SPEND) */}
                                <Box sx={{ width: { xs: '100%', md: '50%' }, maxWidth: '300px'}}>
                                <Typography variant="h6" sx={{ textAlign: 'center' }}>
                                    CURRENCY_SPEND
                                </Typography>
                                <ArrayField source="CURRENCIES_SPEND">
                                    <NoCheckboxDatagrid>
                                    <FunctionField
                                        label="Тип"
                                        source="TYPE"
                                        sortable
                                        render={(record) => <ResourcesTypeWithIcon record={record} />}
                                    />
                                    <NumberField source="COUNT" /> 
                                    </NoCheckboxDatagrid>
                                </ArrayField>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />


                        <Typography variant="h6" gutterBottom>Кирки</Typography>
                        <ArrayField source="TOOLS" label="">
                            <Datagrid>
                                <TextField source="TYPE" label="Тип" />
                                <NumberField source="DURABILITY" label="Прочность" />
                                <TextField source="STATUS" label="Статус" />
                            </Datagrid>
                        </ArrayField>
                        <Typography variant="h6" gutterBottom>Вагонетки</Typography>
                        <ArrayField source="TROLLEYS" label="">
                            <Datagrid>
                                <TextField source="TYPE" label="Тип" />
                                <NumberField source="CAPACITY" label="Вместимость" />
                                <TextField source="STATUS" label="Статус" />
                            </Datagrid>
                        </ArrayField>
                    </SimpleShowLayout>
                </LazyAccordion>
                {/*[Операции по гномам] */}
                <LazyAccordion title="[Операции по гномам]">
                    <UserDwarvesTab />
                </LazyAccordion> 
            </Box>
        </Show>
    );
};