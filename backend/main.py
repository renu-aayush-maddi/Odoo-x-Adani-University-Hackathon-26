from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from . import models, database
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# 1. Initialize Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="GearGuard API")

# 2. Add CORS Middleware 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas 

class RequestCreate(BaseModel):
    subject: str
    request_type: str 
    equipment_id: int
    scheduled_date: Optional[datetime] = None


class RequestUpdate(BaseModel):
    stage: Optional[str] = None
    duration_hours: Optional[float] = None
    technician_id: Optional[int] = None

# --- CORE LOGIC ENDPOINTS ---

# A. Read Operations (For Lists & Kanban)

@app.get("/requests/")
def read_requests(db: Session = Depends(database.get_db)):

    return db.query(models.MaintenanceRequest).options(
        joinedload(models.MaintenanceRequest.equipment),
        joinedload(models.MaintenanceRequest.team),
        joinedload(models.MaintenanceRequest.technician)
    ).all()



@app.get("/equipment/")
def read_equipment(db: Session = Depends(database.get_db)):
    return db.query(models.Equipment).all()

@app.get("/teams/")
def read_teams(db: Session = Depends(database.get_db)):
    return db.query(models.MaintenanceTeam).all()

# B. Write Operations (Business Logic)


@app.post("/requests/")
def create_request(request: RequestCreate, db: Session = Depends(database.get_db)):
    # 1. Fetch Equipment details
    equipment = db.query(models.Equipment).filter(models.Equipment.id == request.equipment_id).first()
    if not equipment:
        raise HTTPException(status_code=404, detail="Equipment not found")
        
    # 2. AUTO-FILL LOGIC: Fetch Team from Equipment
    auto_assigned_team = equipment.maintenance_team_id
    
    # 3. Create the request
    # FIX: Explicitly convert the string to the Enum object for Postgres safety
    try:
        req_type_enum = models.RequestType(request.request_type)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid request type: {request.request_type}")

    new_req = models.MaintenanceRequest(
        subject=request.subject,
        request_type=req_type_enum, # <--- Passing the Enum Object, not string
        equipment_id=request.equipment_id,
        assigned_team_id=auto_assigned_team,
        scheduled_date=request.scheduled_date,
        stage=models.RequestStage.NEW
    )
    
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@app.put("/requests/{request_id}/stage")
def update_stage(request_id: int, update_data: RequestUpdate, db: Session = Depends(database.get_db)):
    req = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not req:
        raise HTTPException(404, "Request not found")
    

    if update_data.stage:
        req.stage = update_data.stage
    if update_data.duration_hours is not None:
        req.duration_hours = update_data.duration_hours
    if update_data.technician_id:
        req.technician_id = update_data.technician_id


    if req.stage == models.RequestStage.SCRAP:
        equipment = db.query(models.Equipment).filter(models.Equipment.id == req.equipment_id).first()
        if equipment:
            equipment.is_active = False 
    db.commit()
    db.refresh(req)
    return req

# C. Smart Features

@app.get("/equipment/{equipment_id}/stats")
def get_equipment_stats(equipment_id: int, db: Session = Depends(database.get_db)):

    count = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.equipment_id == equipment_id,
        models.MaintenanceRequest.stage != models.RequestStage.REPAIRED,
        models.MaintenanceRequest.stage != models.RequestStage.SCRAP
    ).count()
    return {"open_requests": count}