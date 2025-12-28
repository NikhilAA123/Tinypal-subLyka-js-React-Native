"""
IntegrationItem Data Model
This class defines a standardized structure for items fetched from various integrations like Airtable, Notion, etc.
Commit Purpose: Add meaningful comments and docstrings to the IntegrationItem class.
"""

from datetime import datetime
from typing import Optional, List

class IntegrationItem:
    """
    Represents a generic item from an integrated service.
    Attributes include metadata like ID, name, type, and parent relationships.
    """
    def __init__(
        self,
        id: Optional[str] = None,
        type: Optional[str] = None,
        directory: bool = False,
        parent_path_or_name: Optional[str] = None,
        parent_id: Optional[str] = None,
        name: Optional[str] = None,
        creation_time: Optional[datetime] = None,
        last_modified_time: Optional[datetime] = None,
        url: Optional[str] = None,
        children: Optional[List[str]] = None,
        mime_type: Optional[str] = None,
        delta: Optional[str] = None,
        drive_id: Optional[str] = None,
        visibility: Optional[bool] = True,
    ):
        self.id = id
        self.type = type # 'Base', 'Table', 'Page', 'Database', etc.
        self.directory = directory
        self.parent_path_or_name = parent_path_or_name
        self.parent_id = parent_id
        self.name = name
        self.creation_time = creation_time
        self.last_modified_time = last_modified_time
        self.url = url
        self.children = children # List of child item IDs
        self.mime_type = mime_type
        self.delta = delta
        self.drive_id = drive_id
        self.visibility = visibility
