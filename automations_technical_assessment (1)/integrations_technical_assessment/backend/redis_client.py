"""
Redis Client Module
This module provides a simple interface for interacting with Redis, 
primarily used for storing OAuth2 states and credentials.
Commit Purpose: Add meaningful comments and docstrings to the Redis client utility.
"""

import os
import redis.asyncio as redis
from kombu.utils.url import safequote

# Initialize Redis configuration
redis_host = safequote(os.environ.get('REDIS_HOST', 'localhost'))
redis_client = redis.Redis(host=redis_host, port=6379, db=0)

async def add_key_value_redis(key, value, expire=None):
    """
    Asynchronously sets a key-value pair in Redis with an optional expiration time.
    """
    await redis_client.set(key, value)
    if expire:
        await redis_client.expire(key, expire)

async def get_value_redis(key):
    """
    Asynchronously retrieves the value associated with a key from Redis.
    """
    return await redis_client.get(key)

async def delete_key_redis(key):
    """
    Asynchronously deletes a key from Redis.
    """
    await redis_client.delete(key)
