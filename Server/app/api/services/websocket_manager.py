from typing import Dict, List, Union
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps user_id (str or int) to active WebSocket connections list
        self.active_connections: Dict[Union[str, int], List[WebSocket]] = {}

    async def connect(self, user_id: Union[str, int], websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)

    def disconnect(self, user_id: Union[str, int], websocket: WebSocket):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_json(self, websocket: WebSocket, data: dict):
        try:
            await websocket.send_json(data)
        except Exception as e:
            print(f"⚠️ Failed to send JSON message: {e}")

    async def send_personal_message(self, user_id: Union[str, int], data: dict):
        """Sends a JSON message to all active connection tabs for a specific user."""
        if user_id in self.active_connections:
            for connection in list(self.active_connections[user_id]):
                try:
                    await connection.send_json(data)
                except Exception:
                    # Automatically prune disconnected sockets
                    self.disconnect(user_id, connection)


manager = ConnectionManager()