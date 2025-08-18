from typing import Callable
from app.chat.schemas.outbound import MessageOut


async def handle_sync_data(
    sync_data: dict, room_id: str, chat_id: str, send_response: Callable
):
    room_data = sync_data.get("rooms", {}).get("join", {}).get(room_id, {})
    if room_data:
        messages = room_data.get("timeline", {}).get("events", [])
        if messages:
            await send_response(
                "messages",
                [
                    MessageOut.parse_matrix_data(m, chat_id).model_dump(by_alias=True)
                    for m in messages
                    if m["type"] == "m.room.message"
                ],
            )
