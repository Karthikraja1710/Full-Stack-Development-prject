from app.routers.auth import router as auth_router
from app.routers.tasks import router as tasks_router
from app.routers.ws import router as ws_router

__all__ = ["auth_router", "tasks_router", "ws_router"]
