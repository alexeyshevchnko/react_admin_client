// src/components/currencies.tsx

import {
    ArrayField, 
    FunctionField,
    NumberField, 
    SimpleShowLayout,
} from 'react-admin';

import { Box,  Typography } from '@mui/material'; 
import { NoCheckboxDatagrid } from '../../../common/commonComponents';
import { ResourcesTypeWithIcon } from '../../../common/iconComponents';

export const CurrenciesDetails = () => (
    <SimpleShowLayout>
        <Box>
            <Typography variant="h6" gutterBottom>Текущий склад</Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    justifyContent: 'left',
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 400, overflowX: 'auto' }}>
                    <Typography variant="subtitle1" align="center">CURRENCY</Typography>
                    <ArrayField source="CURRENCIES">
                        <NoCheckboxDatagrid sx={{ minWidth: 300 }}>
                            <FunctionField
                                label="Тип"
                                source="TYPE"
                                render={(record) => <ResourcesTypeWithIcon record={record} />}
                            />
                            <NumberField source="COUNT" />
                        </NoCheckboxDatagrid>
                    </ArrayField>
                </Box>

                <Box sx={{ width: '100%', maxWidth: 400, overflowX: 'auto' }}>
                    <Typography variant="subtitle1" align="center">CURRENCY_SPEND</Typography>
                    <ArrayField source="CURRENCIES_SPEND">
                        <NoCheckboxDatagrid sx={{ minWidth: 300 }}>
                            <FunctionField
                                label="Тип"
                                source="TYPE"
                                render={(record) => <ResourcesTypeWithIcon record={record} />}
                            />
                            <NumberField source="COUNT" />
                        </NoCheckboxDatagrid>
                    </ArrayField>
                </Box>
            </Box>
        </Box> 
    </SimpleShowLayout>
);
