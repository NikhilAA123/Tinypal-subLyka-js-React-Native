"""
Notion Integration Module
This module handles OAuth2 authentication and data retrieval from Notion.
Commit Purpose: Add detailed comments and docstrings to the Notion backend integration.
"""

import json
import secrets
from fastapi import Request, HTTPException
from fastapi.responses import HTMLResponse
import httpx
import asyncio
import base64
import requests
from integrations.integration_item import IntegrationItem

from redis_client import add_key_value_redis, get_value_redis, delete_key_redis

# Notion API Credentials
# TODO: Replace 'XXX' with actual credentials or environment variables
CLIENT_ID = 'XXX'
CLIENT_SECRET = 'XXX'
encoded_client_id_secret = base64.b64encode(f'{CLIENT_ID}:{CLIENT_SECRET}'.encode()).decode()

REDIRECT_URI = 'http://localhost:8000/integrations/notion/oauth2callback'

# Base authorization URL for Notion OAuth2
authorization_url = f'https://api.notion.com/v1/oauth/authorize?client_id={CLIENT_ID}&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fintegrations%2Fnotion%2Foauth2callback'

async def authorize_notion(user_id, org_id):
    """
    Generates the Notion authorization URL and stores state in Redis.
    """
    state_data = {
        'state': secrets.token_urlsafe(32),
        'user_id': user_id,
        'org_id': org_id
    }
    encoded_state = json.dumps(state_data)
    
    # Store state in Redis for verification in the callback
    await add_key_value_redis(f'notion_state:{org_id}:{user_id}', encoded_state, expire=600)

    return f'{authorization_url}&state={encoded_state}'

async def oauth2callback_notion(request: Request):
    """
    Handles the OAuth2 callback from Notion, exchanges the code for a token, and stores it in Redis.
    """
    if request.query_params.get('error'):
        raise HTTPException(status_code=400, detail=request.query_params.get('error'))
    
    code = request.query_params.get('code')
    encoded_state = request.query_params.get('state')
    state_data = json.loads(encoded_state)

    original_state = state_data.get('state')
    user_id = state_data.get('user_id')
    org_id = state_data.get('org_id')

    # Retrieve saved state from Redis
    saved_state = await get_value_redis(f'notion_state:{org_id}:{user_id}')

    # Validate state to prevent CSRF
    if not saved_state or original_state != json.loads(saved_state).get('state'):
        raise HTTPException(status_code=400, detail='State does not match.')

    async with httpx.AsyncClient() as client:
        # Exchange authorization code for access token
        response, _ = await asyncio.gather(
            client.post(
                'https://api.notion.com/v1/oauth/token',
                json={
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': REDIRECT_URI
                }, 
                headers={
                    'Authorization': f'Basic {encoded_client_id_secret}',
                    'Content-Type': 'application/json',
                }
            ),
            delete_key_redis(f'notion_state:{org_id}:{user_id}'),
        )

    # Store the received credentials in Redis
    await add_key_value_redis(f'notion_credentials:{org_id}:{user_id}', json.dumps(response.json()), expire=600)
    
    # Script to close the popup window after successful authentication
    close_window_script = """
    <html>
        <script>
            window.close();
        </script>
    </html>
    """
    return HTMLResponse(content=close_window_script)

async def get_notion_credentials(user_id, org_id):
    """
    Retrieves and deletes Notion credentials from Redis.
    """
    credentials = await get_value_redis(f'notion_credentials:{org_id}:{user_id}')
    if not credentials:
        raise HTTPException(status_code=400, detail='No credentials found.')
    credentials = json.loads(credentials)
    if not credentials:
        raise HTTPException(status_code=400, detail='No credentials found.')
    await delete_key_redis(f'notion_credentials:{org_id}:{user_id}')

    return credentials

def _recursive_dict_search(data, target_key):
    """
    Recursively search for a key in a dictionary or list of dictionaries.
    Used to extract content from deeply nested Notion API responses.
    """
    if target_key in data:
        return data[target_key]

    for value in data.values():
        if isinstance(value, dict):
            result = _recursive_dict_search(value, target_key)
            if result is not None:
                return result
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    result = _recursive_dict_search(item, target_key)
                    if result is not None:
                        return result
    return None

def create_integration_item_metadata_object(
    response_json: str,
) -> IntegrationItem:
    """
    Standardizes Notion search results into an IntegrationItem metadata object.
    """
    # Attempt to find the name/content of the item
    name = _recursive_dict_search(response_json['properties'], 'content')
    
    # Determine the parent item ID if available
    parent_type = (
        ''
        if response_json['parent']['type'] is None
        else response_json['parent']['type']
    )
    if response_json['parent']['type'] == 'workspace':
        parent_id = None
    else:
        parent_id = response_json['parent'][parent_type]

    # Fallback to general object type if name is not found
    name = _recursive_dict_search(response_json, 'content') if name is None else name
    name = 'multi_select' if name is None else name
    name = response_json['object'] + ' ' + name

    # Return the standardized IntegrationItem object
    integration_item_metadata = IntegrationItem(
        id=response_json['id'],
        type=response_json['object'],
        name=name,
        creation_time=response_json['created_time'],
        last_modified_time=response_json['last_edited_time'],
        parent_id=parent_id,
    )

    return integration_item_metadata

async def get_items_notion(credentials) -> list[IntegrationItem]:
    """
    Fetches all accessible objects (pages/databases) from Notion using the Search API.
    """
    credentials = json.loads(credentials)
    response = requests.post(
        'https://api.notion.com/v1/search',
        headers={
            'Authorization': f'Bearer {credentials.get("access_token")}',
            'Notion-Version': '2022-06-28',
        },
    )

    if response.status_code == 200:
        results = response.json()['results']
        list_of_integration_item_metadata = []
        for result in results:
            list_of_integration_item_metadata.append(
                create_integration_item_metadata_object(result)
            )

        print(list_of_integration_item_metadata)
        return list_of_integration_item_metadata
    
    return []
