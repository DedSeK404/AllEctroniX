from fastapi import FastAPI
# Change "components" to "component" in the import line:
from app.api.endpoints.component import router as components_router

app = FastAPI(title="AllEctronix AI Repair API", version="1.0.0")

app.include_router(components_router, prefix="/api/components", tags=["Components"])

@app.get("/")
def read_root():
    return {"message": "AllEctronix Backend API is running!"}