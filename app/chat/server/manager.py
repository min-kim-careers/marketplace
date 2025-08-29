from fastapi import WebSocket

from app.cache.redis import redis


class ChatManager:
    def __init__(self) -> None:
        self.conn: dict[str, list[WebSocket]] = {}
        self.chan = redis.pubsub()

    def room_key(self, room_id):
        return "chat:channel:room:" + room_id

    async def connect(self, room_id, conn: WebSocket):
        await conn.accept()
        self.conn[room_id] += [conn]

    def disconnect(self, room_id, conn):
        self.conn[room_id] = [c for c in self.conn[room_id] if c != conn]
        if not self.conn[room_id]:
            del self.conn[room_id]
            self.chan.unsubscribe(self.room_key(room_id))

    async def broadcast(self, room_id, msg):
        for conn in list(self.conn[room_id]):
            try:
                await conn.send_text(msg)
            except Exception:
                self.disconnect(room_id, conn)

    async def subscribe(self, room_id: str):
        await self.chan.subscribe(self.room_key(room_id))
        async for payload in self.chan.listen():
            payload: dict
            if payload.get("type") == "message":
                msg = payload.get("data")
                if msg:
                    await self.broadcast(room_id, msg)


manager = ChatManager()
