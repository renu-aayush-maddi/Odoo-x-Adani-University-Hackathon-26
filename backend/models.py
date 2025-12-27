from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Enum, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class RequestType(str, enum.Enum):
    CORRECTIVE = "Corrective"
    PREVENTIVE = "Preventive"

class RequestStage(str, enum.Enum):
    NEW = "New"
    IN_PROGRESS = "In Progress"
    REPAIRED = "Repaired"
    SCRAP = "Scrap"

class MaintenanceTeam(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    members = relationship("User", back_populates="team")
    equipment = relationship("Equipment", back_populates="maintenance_team")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    avatar_url = Column(String, nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    team = relationship("MaintenanceTeam", back_populates="members")

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    serial_number = Column(String, unique=True)
    category = Column(String) 
    department = Column(String)
    location = Column(String)
    purchase_date = Column(DateTime, default=datetime.utcnow)
    warranty_expiration = Column(DateTime)
    is_active = Column(Boolean, default=True) # Postgres handles Boolean natively
    
    maintenance_team_id = Column(Integer, ForeignKey("teams.id"))
    technician_id = Column(Integer, ForeignKey("users.id"))
    
    maintenance_team = relationship("MaintenanceTeam", back_populates="equipment")
    requests = relationship("MaintenanceRequest", back_populates="equipment")

class MaintenanceRequest(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String)
    request_type = Column(Enum(RequestType))
    stage = Column(Enum(RequestStage), default=RequestStage.NEW)
    
    scheduled_date = Column(DateTime, nullable=True)
    duration_hours = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    equipment_id = Column(Integer, ForeignKey("equipment.id"))
    assigned_team_id = Column(Integer, ForeignKey("teams.id"))
    technician_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    equipment = relationship("Equipment", back_populates="requests")
    team = relationship("MaintenanceTeam")
    technician = relationship("User")