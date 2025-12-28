/**
 * IntegrationForm Component
 * This is the main form where users can select an integration type (e.g., Notion, Airtable)
 * and provide their User ID and Organization ID to initiate the connection.
 * Commit Purpose: Add meaningful comments to the main IntegrationForm component.
 */

import { useState } from 'react';
import {
    Box,
    Autocomplete,
    TextField,
} from '@mui/material';
import { AirtableIntegration } from './integrations/airtable';
import { NotionIntegration } from './integrations/notion';
import { DataForm } from './data-form';

// Mapping of integration types to their respective UI components
const integrationMapping = {
    'Notion': NotionIntegration,
    'Airtable': AirtableIntegration,
};

export const IntegrationForm = () => {
    // State for integration parameters, user/org details, and currently selected integration type
    const [integrationParams, setIntegrationParams] = useState({});
    const [user, setUser] = useState('TestUser');
    const [org, setOrg] = useState('TestOrg');
    const [currType, setCurrType] = useState(null);

    // Dynamically determine which integration component to render
    const CurrIntegration = integrationMapping[currType];

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' sx={{ width: '100%' }}>
            <Box display='flex' flexDirection='column'>
                {/* Input for User ID */}
                <TextField
                    label="User"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    sx={{ mt: 2 }}
                />
                {/* Input for Organization ID */}
                <TextField
                    label="Organization"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    sx={{ mt: 2 }}
                />
                {/* Selection for Integration Type */}
                <Autocomplete
                    id="integration-type"
                    options={Object.keys(integrationMapping)}
                    sx={{ width: 300, mt: 2 }}
                    renderInput={(params) => <TextField {...params} label="Integration Type" />}
                    onChange={(e, value) => setCurrType(value)}
                />
            </Box>

            {/* Render the specific integration connection component if one is selected */}
            {currType &&
                <Box>
                    <CurrIntegration user={user} org={org} integrationParams={integrationParams} setIntegrationParams={setIntegrationParams} />
                </Box>
            }

            {/* Once connected (credentials exist), render the DataForm to load items */}
            {integrationParams?.credentials &&
                <Box sx={{ mt: 2 }}>
                    <DataForm integrationType={integrationParams?.type} credentials={integrationParams?.credentials} />
                </Box>
            }
        </Box>
    );
}
