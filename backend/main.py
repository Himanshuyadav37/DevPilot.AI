from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.auth.routes import router as auth_router
from backend.api.routes.project import router as project_router
from backend.api.routes.status import router as status_router
from backend.api.routes.history import router as history_router

app = FastAPI(title="DevPilot AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(project_router)
app.include_router(status_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {"message": "DevPilot AI is running"}