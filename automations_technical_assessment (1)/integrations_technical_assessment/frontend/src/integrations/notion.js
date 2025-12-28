/**
 * NotionIntegration Component
 * This component provides a UI for users to connect their Notion account via OAuth2.
 * Similar to Airtable, it handles the authorization popup and credential retrieval.
 * Commit Purpose: Add meaningful comments to the Notion integration frontend component.
 */

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress
} from '@mui/material';
import axios from 'axios';

export const NotionIntegration = ({ user, org, integrationParams, setIntegrationParams }) => {
    // State to track individual connection status and loading state
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    /**
     * Initiates the Notion OAuth2 flow.
     * Requests authorization URL from the backend and opens it in a popup.
     */
    const handleConnectClick = async () => {
        try {
            setIsConnecting(true);
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            // Get Notion authorization URL from backend
            const response = await axios.post(`http://localhost:8000/integrations/notion/authorize`, formData);
            const authURL = response?.data;

            // Open popup for user authorization
            const newWindow = window.open(authURL, 'Notion Authorization', 'width=600, height=600');

            // Poll for window closure to proceed with credential exchange
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
     * Fetches the exchanged Notion credentials from the backend.
     */
    const handleWindowClosed = async () => {
        try {
            const formData = new FormData();
            formData.append('user_id', user);
            formData.append('org_id', org);

            // Fetch credentials stored by the backend during the Notion OAuth callback
            const response = await axios.post(`http://localhost:8000/integrations/notion/credentials`, formData);
            const credentials = response.data;

            if (credentials) {
                setIsConnecting(false);
                setIsConnected(true);
                // Store credentials in the parent's integration state
                setIntegrationParams(prev => ({ ...prev, credentials: credentials, type: 'Notion' }));
            }
            setIsConnecting(false);
        } catch (e) {
            setIsConnecting(false);
            alert(e?.response?.data?.detail);
        }
    }

    // Effect to set initial connection status based on provided props
    useEffect(() => {
        setIsConnected(integrationParams?.credentials ? true : false)
    }, []);

    return (
        <>
            <Box sx={{ mt: 2 }}>
                Parameters
                <Box display='flex' alignItems='center' justifyContent='center' sx={{ mt: 2 }}>
                    <Button
                        variant='contained'
                        onClick={isConnected ? () => { } : handleConnectClick}
                        color={isConnected ? 'success' : 'primary'}
                        disabled={isConnecting}
                        style={{
                            pointerEvents: isConnected ? 'none' : 'auto',
                            cursor: isConnected ? 'default' : 'pointer',
                            opacity: isConnected ? 1 : undefined
                        }}
                    >
                        {isConnected ? 'Notion Connected' : isConnecting ? <CircularProgress size={20} /> : 'Connect to Notion'}
                    </Button>
                </Box>
            </Box>
        </>
    );
}
