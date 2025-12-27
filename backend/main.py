

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from . import models, database
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="GearGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SCHEMAS ---
class RequestCreate(BaseModel):
    subject: str
    request_type: str 
    equipment_id: Optional[int] = None
    work_center_id: Optional[int] = None
    scheduled_date: Optional[datetime] = None
    priority: int = 1
    
    # --- ADDED THESE FIELDS TO MATCH YOUR FORM ---
    technician_id: Optional[int] = None
    team_id: Optional[int] = None  # User selected team
    duration: Optional[float] = 0.0

# --- UPDATE THE SCHEMA ---
class RequestUpdate(BaseModel):
    stage: Optional[str] = None
    duration_hours: Optional[float] = None
    technician_id: Optional[int] = None
    priority: Optional[int] = None
    # --- ADD THESE ---
    notes: Optional[str] = None
    instructions: Optional[str] = None
    worksheet_log: Optional[str] = None

class EquipmentSchema(BaseModel):
    name: str
    serial_number: str
    category: str
    department: str
    location: str
    maintenance_team_id: int
    technician_id: Optional[int] = None

# --- ENDPOINTS ---

@app.get("/requests/")
def read_requests(db: Session = Depends(database.get_db)):
    return db.query(models.MaintenanceRequest).options(
        joinedload(models.MaintenanceRequest.equipment),
        joinedload(models.MaintenanceRequest.work_center),
        joinedload(models.MaintenanceRequest.team),
        joinedload(models.MaintenanceRequest.technician)
    ).all()

@app.get("/equipment/")
def read_equipment(db: Session = Depends(database.get_db)):
    return db.query(models.Equipment).options(
        joinedload(models.Equipment.maintenance_team),
        joinedload(models.Equipment.technician)
    ).all()

@app.get("/work-centers/")
def read_work_centers(db: Session = Depends(database.get_db)):
    return db.query(models.WorkCenter).all()

@app.get("/teams/")
def read_teams(db: Session = Depends(database.get_db)):
    return db.query(models.MaintenanceTeam).options(joinedload(models.MaintenanceTeam.members)).all()

@app.get("/users/")
def read_users(db: Session = Depends(database.get_db)):
    return db.query(models.User).all()

@app.post("/requests/")
def create_request(request: RequestCreate, db: Session = Depends(database.get_db)):
    # 1. Determine Team: Use User Selection -> Fallback to Equipment Default -> None
    final_team_id = request.team_id
    
    if not final_team_id and request.equipment_id:
        # If user didn't select a team, try to auto-fill from Equipment
        equipment = db.query(models.Equipment).filter(models.Equipment.id == request.equipment_id).first()
        if equipment:
            final_team_id = equipment.maintenance_team_id
            
    try:
        req_type_enum = models.RequestType(request.request_type)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid type")

    new_req = models.MaintenanceRequest(
        subject=request.subject,
        request_type=req_type_enum,
        equipment_id=request.equipment_id,
        work_center_id=request.work_center_id,
        assigned_team_id=final_team_id, # Use the calculated ID
        technician_id=request.technician_id, # Save the Technician
        scheduled_date=request.scheduled_date,
        duration_hours=request.duration, # Save the duration
        stage=models.RequestStage.NEW,
        priority=request.priority
    )
    
    db.add(new_req)
    db.commit()
    db.refresh(new_req)
    return new_req

@app.put("/requests/{request_id}/stage")
def update_stage(request_id: int, update_data: RequestUpdate, db: Session = Depends(database.get_db)):
    req = db.query(models.MaintenanceRequest).filter(models.MaintenanceRequest.id == request_id).first()
    if not req: raise HTTPException(404, "Not found")
    
    # Update fields if they are provided
    if update_data.stage: req.stage = update_data.stage
    if update_data.duration_hours is not None: req.duration_hours = update_data.duration_hours
    if update_data.technician_id: req.technician_id = update_data.technician_id
    if update_data.priority: req.priority = update_data.priority
    
    # --- SAVE NEW FIELDS ---
    if update_data.notes is not None: req.notes = update_data.notes
    if update_data.instructions is not None: req.instructions = update_data.instructions
    if update_data.worksheet_log is not None: req.worksheet_log = update_data.worksheet_log
    # -----------------------

    # Scrap Logic
    if req.stage == models.RequestStage.SCRAP and req.equipment_id:
        equipment = db.query(models.Equipment).filter(models.Equipment.id == req.equipment_id).first()
        if equipment: equipment.is_active = False 
    
    db.commit()
    db.refresh(req) # Refresh to get updated data back
    return req

# CRUD for Equipment
@app.post("/equipment/")
def create_equipment(equip: EquipmentSchema, db: Session = Depends(database.get_db)):
    new_equip = models.Equipment(**equip.dict(), is_active=True)
    db.add(new_equip)
    db.commit()
    db.refresh(new_equip)
    return new_equip

@app.delete("/equipment/{equipment_id}")
def delete_equipment(equipment_id: int, db: Session = Depends(database.get_db)):
    db.query(models.Equipment).filter(models.Equipment.id == equipment_id).delete()
    db.commit()
    return {"msg": "Deleted"}

@app.put("/equipment/{equipment_id}")
def update_equipment(equipment_id: int, equip: EquipmentSchema, db: Session = Depends(database.get_db)):
    db_equip = db.query(models.Equipment).filter(models.Equipment.id == equipment_id).first()
    if not db_equip:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    db_equip.name = equip.name
    db_equip.serial_number = equip.serial_number
    db_equip.category = equip.category
    db_equip.department = equip.department
    db_equip.location = equip.location
    db_equip.maintenance_team_id = equip.maintenance_team_id
    db_equip.technician_id = equip.technician_id
    
    db.commit()
    db.refresh(db_equip)
    return db_equip
    
@app.get("/equipment/{equipment_id}/stats")
def get_equipment_stats(equipment_id: int, db: Session = Depends(database.get_db)):
    count = db.query(models.MaintenanceRequest).filter(
        models.MaintenanceRequest.equipment_id == equipment_id,
        models.MaintenanceRequest.stage != models.RequestStage.REPAIRED,
        models.MaintenanceRequest.stage != models.RequestStage.SCRAP
    ).count()
    return {"open_requests": count}