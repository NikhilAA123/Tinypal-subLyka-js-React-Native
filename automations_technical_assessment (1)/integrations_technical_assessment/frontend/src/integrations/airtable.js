/**
 * AirtableIntegration Component
 * This component provides a UI for users to connect their Airtable account via OAuth2.
 * It handles the authorization popup, polling for completion, and credential storage.
 * Commit Purpose: Add meaningful comments to the Airtable integration frontend component.
 */

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

export const AirtableIntegration = ({ user, org, integrationParams, setIntegrationParams }) => {
    // State to track connection status and loading state
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    /**
     * Initiates the Airtable OAuth2 flow.
     * Opens a popup window for the user to authorize the application.
     */
    const handleConnectClick = async () => {
        try {
            setIsConnecting(true);
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            // Fetch the authorization URL from the backend
            const response = await axios.post(`http://localhost:8000/integrations/airtable/authorize`, formData);
            const authURL = response?.data;

            // Open the authorization URL in a new window
            const newWindow = window.open(authURL, 'Airtable Authorization', 'width=600, height=600');

            // Set up a polling timer to detect when the popup window is closed
            const pollTimer = window.setInterval(() => {
                if (newWindow?.closed !== false) { 
                    window.clearInterval(pollTimer);
                    handleWindowClosed();
                }
            }, 200);
        } catch (e) {
            setIsConnecting(false);
            alert(e?.response?.data?.detail);
        }
    }

    /**
     * Handles logic after the authorization window is closed.
     * Fetches the exchanged credentials from the backend.
     */
    const handleWindowClosed = async () => {
        try {
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            // Retrieve the credentials stored by the backend during the OAuth callback
            const response = await axios.post(`http://localhost:8000/integrations/airtable/credentials`, formData);
            const credentials = response.data; 

            if (credentials) {
                setIsConnecting(false);
                setIsConnected(true);
                // Update the parent component's state with the new credentials
                setIntegrationParams(prev => ({ ...prev, credentials: credentials, type: 'Airtable' }));
            }
            setIsConnecting(false);
        } catch (e) {
            setIsConnecting(false);
            alert(e?.response?.data?.detail);
        }
    }

    // Effect to initialize the connection state based on existing integrationParams
    useEffect(() => {
        setIsConnected(integrationParams?.credentials ? true : false)
    }, []);

    return (
        <>
        <Box sx={{mt: 2}}>
            Parameters
            <Box display='flex' alignItems='center' justifyContent='center' sx={{mt: 2}}>
                <Button 
                    variant='contained' 
                    onClick={isConnected ? () => {} :handleConnectClick}
                    color={isConnected ? 'success' : 'primary'}
                    disabled={isConnecting}
                    style={{
                        pointerEvents: isConnected ? 'none' : 'auto',
                        cursor: isConnected ? 'default' : 'pointer',
                        opacity: isConnected ? 1 : undefined
                    }}
                >
                    {isConnected ? 'Airtable Connected' : isConnecting ? <CircularProgress size={20} /> : 'Connect to Airtable'}
                </Button>
            </Box>
        </Box>
      </>
    );
}
