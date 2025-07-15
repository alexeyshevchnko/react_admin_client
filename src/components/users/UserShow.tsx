import {
    Show,
    SimpleShowLayout,
    TextField, 
    useRecordContext, 
    TopToolbar,
    EditButton,
    DeleteButton, 
} from 'react-admin';

import {
    Typography, 
    Chip,
    Stack,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react'; 
import { ResponsiveFlexBox } from '../../common/commonComponents';
import TonTransactionsSection from './tonTransactions/TonTransactionsSection';
import { ManufactureUserDetails } from './manufacture/ManufactureUserDetails'; 
import { CoinageUserDetails } from './coinage/CoinageUserDetails';
import { CurrenciesDetails } from './currencies/CurrenciesDetails';
import { DwarvesDetails } from './dwarves/DwarvesDetails';
import DateTimeField from '../../common/dateTimeField';
import { UserStocksTable } from './stocks/UserStocksTable';

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
        <Accordion expanded={expanded} onChange={handleChange}>
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
                <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>Основная информация</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ overflowX: 'auto' }}>
                        <ResponsiveFlexBox>
                            <SimpleShowLayout>
                                <TextField source="ID" label="ID пользователя" />
                                <TextField source="NICKNAME" label="Никнейм" />
                                <Box sx={{ wordBreak: 'break-all' }}>
                                    <TextField source="WALLET" label="WALLET" />
                                </Box>
                                <DateTimeField source="REGISTRATION" label="Дата регистрации" />
                                <DateTimeField source="LAST_DAY_ONLINE" label="Последняя активность" />
                                <UserStats />
                            </SimpleShowLayout>
                        </ResponsiveFlexBox>
                    </AccordionDetails>
                </Accordion>

                <LazyAccordion title="[Ввод / Вывод TON]">
                    <AccordionDetails sx={{ overflowX: 'auto' }}>
                        <ResponsiveFlexBox>
                            <TonTransactionsSection />
                        </ResponsiveFlexBox>
                    </AccordionDetails>
                </LazyAccordion>

                <LazyAccordion title="[Операции по переработкам]">
                    <AccordionDetails sx={{ overflowX: 'auto' }}>
                        <ResponsiveFlexBox>
                            <ManufactureUserDetails />
                        </ResponsiveFlexBox>
                    </AccordionDetails>
                </LazyAccordion>

                <LazyAccordion title="[Операции по чеканке]">
                    <AccordionDetails sx={{ overflowX: 'auto' }}>
                        <ResponsiveFlexBox>
                            <CoinageUserDetails />
                        </ResponsiveFlexBox>
                    </AccordionDetails>
                </LazyAccordion>

                <LazyAccordion title="[Операции по складу]">
                    <AccordionDetails sx={{ overflowX: 'auto' }}>
                        <ResponsiveFlexBox>
                            <CurrenciesDetails />
                        </ResponsiveFlexBox>
                    </AccordionDetails>
                </LazyAccordion>

                <LazyAccordion title="[Операции по гномам]">
                    <AccordionDetails sx={{ overflowX: 'auto' }}>
                        <ResponsiveFlexBox>
                            <DwarvesDetails />
                        </ResponsiveFlexBox>
                    </AccordionDetails>
                </LazyAccordion>

                <LazyAccordion title="[Операции по акциям]">
                    <AccordionDetails sx={{ overflowX: 'auto' }}>
                        <ResponsiveFlexBox>
                            <UserStocksTable />
                        </ResponsiveFlexBox>
                    </AccordionDetails>
                </LazyAccordion>
            </Box>
        </Show>
    );
};
