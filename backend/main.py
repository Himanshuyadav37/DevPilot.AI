from fastapi import FastAPI

from db.mongo_client import db

from auth.routes import router as auth_router
from api.users import router as user_router
from api.planner import router as planner_router
from api.projects import router as project_router
from api.routes.execution import (
    router as execution_router
)
from api.routes.memory import (
    router as memory_router
)

app = FastAPI(
    title="NeuroForge AI",
    description="Autonomous Multi-Agent Software Engineering Platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "NeuroForge AI Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# Auth Routes
app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)

# User Routes
app.include_router(
    user_router,
    prefix="/users",
    tags=["Users"]
)


# planner agent route
app.include_router(
    planner_router,
    prefix="/planner",
    tags=["Planner Agent"]
)

# Project Route
app.include_router(
    project_router,
    prefix="/projects",
    tags=["Projects"]
)

app.include_router(
    execution_router,
    prefix="/ai",
    tags=["NeuroForge"]
)

app.include_router(
    memory_router,
    prefix="/memory",
    tags=["Memory"]
)