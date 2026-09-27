from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from app.services.auth import verify_token
from app.services.websocket import manager

router = APIRouter(prefix="/api/ws", tags=["WebSockets"])


@router.websocket("")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(...)):
    try:
        token_data = verify_token(token)
        if not token_data.user_id:
            await websocket.close(code=4001)
            return
        
        user_id = token_data.user_id
        await manager.connect(user_id, websocket)
        
        try:
            while True:
                # Keep connection alive and listen for ping/pong or client messages
                data = await websocket.receive_text()
                # Optional ping response
                if data == "ping":
                    await websocket.send_text("pong")
        except WebSocketDisconnect:
            manager.disconnect(user_id, websocket)
    except Exception:
        await websocket.close(code=4000)
