/**
 * DataForm Component
 * This component provides the functionality to load and display data (bases, tables, pages, etc.)
 * from the connected integration. It sends the stored credentials back to the backend
 * to perform authenticated API requests.
 * Commit Purpose: Add meaningful comments and structure to the DataForm component.
 */

import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
} from '@mui/material';
import axios from 'axios';

// Mapping of integration types to their respective backend API endpoints
const endpointMapping = {
    'Notion': 'notion',
    'Airtable': 'airtable',
};

export const DataForm = ({ integrationType, credentials }) => {
    const [loadedData, setLoadedData] = useState(null);
    const endpoint = endpointMapping[integrationType];

    /**
     * Handles the 'Load Data' button click.
     * Sends credentials to the backend to fetch integration items.
     */
    const handleLoad = async () => {
        try {
            const formData = new FormData();
            formData.append('credentials', JSON.stringify(credentials));

            // Post credentials to the integration-specific load endpoint
            const response = await axios.post(`http://localhost:8000/integrations/${endpoint}/load`, formData);
            const data = response.data;

            // Store the returned metadata for display
            setLoadedData(JSON.stringify(data, null, 2));
        } catch (e) {
            alert(e?.response?.data?.detail);
        }
    }

    return (
        <Box display='flex' justifyContent='center' alignItems='center' flexDirection='column' width='100%'>
            <Box display='flex' flexDirection='column' width='100%'>
                {/* Text area to display the loaded integration data */}
                <TextField
                    label="Loaded Data"
                    multiline
                    minRows={5}
                    value={loadedData || ''}
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                    disabled
                />

                {/* Button to trigger data fetching */}
                <Button
                    onClick={handleLoad}
                    sx={{ mt: 2 }}
                    variant='contained'
                >
                    Load Data
                </Button>

                {/* Button to clear the displayed data */}
                <Button
                    onClick={() => setLoadedData(null)}
                    sx={{ mt: 1 }}
                    variant='contained'
                >
                    Clear Data
                </Button>
            </Box>
        </Box>
    );
}
