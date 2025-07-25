import {
    Show,
    SimpleShowLayout,
    TextField, 
    useRecordContext, 
    TopToolbar,
    EditButton,
    DeleteButton,
    useGetOne,
    Loading, 
} from 'react-admin';

import {
    Typography, 
    Chip,
    Stack,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode, useState } from 'react'; 
import { CopyableAddress, ResponsiveFlexBox } from '../../common/commonComponents';
import TonTransactionsSection from './tonTransactions/TonTransactionsSection';
import { ManufactureUserDetails } from './manufacture/ManufactureUserDetails'; 
import { CoinageUserDetails } from './coinage/CoinageUserDetails';
import { CurrenciesDetails } from './currencies/CurrenciesDetails';
import { DwarvesDetails } from './dwarves/DwarvesDetails';
import DateTimeField from '../../common/dateTimeField';
import { UserStocksTable } from './stocks/UserStocksTable';
import { useParams } from 'react-router';
import { UserMarketSalesTable } from './stocks/UserMarketSalesTable';
import { UserMarketBuysTable } from './stocks/UserMarketBuysTable';
import { UserShopHistoryTable } from './stocks/UserShopHistoryTable';
import { UserToolsTable } from './tools/UserToolsTable';
import { BuyerToolsHistory } from './tools/BuyerToolsHistory';
import { SalesmanToolsHistory } from './tools/SalesmanToolsHistory';
import { UserTrolleysGrouped } from './trolleys/UserTrolleysTable';
import { SalesmanTrolleysHistory } from './trolleys/SalesmanTrolleysHistory';
import { BuyerTrolleysHistory } from './trolleys/BuyerTrolleysHistory';
import { UserDepositsDetails } from './deposits/UserDepositsDetails';
import InviterNicknameField from './InviterNicknameField';
import AnalyticsPage from './analytics/AnalyticsPage';
import { UserMailList } from './MailItem';
import { OldMailList } from './OldMail';


const UserTitle = () => {
    const record = useRecordContext();
    return <span>Пользователь: {record ? `${record.NICKNAME} (ID: ${record._id})` : ''}</span>;
};

const UserShowActions = () => (
    <TopToolbar>
        {/*<EditButton />
        <DeleteButton />*/}
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

    const { id } = useParams();
    const { data: record, isLoading } = useGetOne('users', { id });

    if (isLoading) return <Loading />; 
    if (!record) return <div>Пользователь не найден</div>;
 
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
                                    <Box sx={{ wordBreak: 'break-all' }}> 
                                        <CopyableAddress label="WALLET" value={record?.WALLET || ''} />
                                    </Box> 
                                </Box>
                                <DateTimeField source="REGISTRATION" label="Дата регистрации" />
                                <DateTimeField source="LAST_DAY_ONLINE" label="Последняя активность" />
                                <UserStats />
                                <InviterNicknameField />
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
                            <Divider sx={{ my: 5 }} />
                            <UserShopHistoryTable/>
                            <Divider sx={{ my: 5 }} />
                            <UserMarketBuysTable />
                            <Divider sx={{ my: 5 }} />
                            <UserMarketSalesTable />
                        </ResponsiveFlexBox>
                    </AccordionDetails>
                </LazyAccordion>
                <LazyAccordion title="[Операции с инструментами]">
                    <UserToolsTable/>
                    <BuyerToolsHistory/>
                    <SalesmanToolsHistory/>
                </LazyAccordion>

                <LazyAccordion title="[Операции с вагонетками]">
                        <UserTrolleysGrouped userId={record?.ID}/>
                        <BuyerTrolleysHistory/>
                        <SalesmanTrolleysHistory/>
                </LazyAccordion>

                <LazyAccordion title="[Операции по банку]">
                        <UserDepositsDetails userId={record?.ID || record?._id || ''} />
                </LazyAccordion>

                <LazyAccordion title="[Аналитика по пользователю]">
                    <AnalyticsPage />
                </LazyAccordion>

                <LazyAccordion title="[Почтовые сообщения]">
                    <UserMailList />
                </LazyAccordion>

                <LazyAccordion title="[Почтовые сообщения old]">
                   <OldMailList />
                </LazyAccordion>

                

            </Box>
        </Show>
    );
};
