# from sqlalchemy.orm import Session
# from .database import SessionLocal, engine
# from . import models
# from datetime import datetime, timedelta

# # Create tables
# models.Base.metadata.create_all(bind=engine)

# def seed_data():
#     db = SessionLocal()

#     # Check if data exists
#     if db.query(models.MaintenanceTeam).first():
#         print("Data already exists. Skipping seed.")
#         return

#     print("Seeding Teams...")
#     team_mech = models.MaintenanceTeam(name="Mechanics")
#     team_elec = models.MaintenanceTeam(name="Electricians")
#     team_it = models.MaintenanceTeam(name="IT Support")
#     db.add_all([team_mech, team_elec, team_it])
#     db.commit()

#     print("Seeding Users...")
#     u1 = models.User(name="Alice Gearhead", team_id=team_mech.id, avatar_url="https://i.pravatar.cc/150?u=alice")
#     u2 = models.User(name="Bob Spark", team_id=team_elec.id, avatar_url="https://i.pravatar.cc/150?u=bob")
#     u3 = models.User(name="Charlie Tech", team_id=team_it.id, avatar_url="https://i.pravatar.cc/150?u=charlie")
#     u4 = models.User(name="Dave Wrench", team_id=team_mech.id, avatar_url="https://i.pravatar.cc/150?u=dave")
#     db.add_all([u1, u2, u3, u4])
#     db.commit()

#     print("Seeding Equipment...")
#     eq1 = models.Equipment(
#         name="CNC Machine X1", serial_number="CNC-99", category="Heavy Machinery",
#         department="Production", location="Floor 1", 
#         maintenance_team_id=team_mech.id, technician_id=u1.id,
#         purchase_date=datetime.now() - timedelta(days=700)
#     )
#     eq2 = models.Equipment(
#         name="Office Printer 01", serial_number="PRT-01", category="Electronics",
#         department="Admin", location="Office 202",
#         maintenance_team_id=team_it.id, technician_id=u3.id,
#         purchase_date=datetime.now() - timedelta(days=200)
#     )
#     eq3 = models.Equipment(
#         name="Generator 5000", serial_number="GEN-5K", category="Power",
#         department="Utility", location="Basement",
#         maintenance_team_id=team_elec.id, technician_id=u2.id,
#         purchase_date=datetime.now() - timedelta(days=1000)
#     )
#     db.add_all([eq1, eq2, eq3])
#     db.commit()
    
#     print("Seeding Work Centers...")
#     wc1 = models.WorkCenter(name="Assembly Line 1", code="WC-001", cost_per_hour=150.0, capacity=100.0, oee_target=90.0)
#     wc2 = models.WorkCenter(name="Drill Station", code="WC-002", cost_per_hour=85.0, capacity=50.0, oee_target=75.5)
#     db.add_all([wc1, wc2])
#     db.commit()
    
#     print("Seeding Initial Requests...")
#     # Request 1: High Priority (3 Stars)
#     req1 = models.MaintenanceRequest(
#         subject="Leaking Oil", request_type=models.RequestType.CORRECTIVE,
#         equipment_id=eq1.id, assigned_team_id=team_mech.id,
#         stage=models.RequestStage.NEW,
#         priority=3 # <--- HIGH PRIORITY
#     )
    
#     # Request 2: Medium Priority (2 Stars)
#     req2 = models.MaintenanceRequest(
#         subject="Monthly Checkup", request_type=models.RequestType.PREVENTIVE,
#         equipment_id=eq3.id, assigned_team_id=team_elec.id,
#         stage=models.RequestStage.NEW,
#         scheduled_date=datetime.now() + timedelta(days=5),
#         priority=2 # <--- MEDIUM PRIORITY
#     )

#     db.add_all([req1, req2])
#     db.commit()

#     print("Seeding Complete!")
#     db.close()

# if __name__ == "__main__":
#     seed_data()


from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models
from datetime import datetime, timedelta

# Create tables (ensure they exist)
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()

    # Check if data exists to avoid duplicates
    if db.query(models.MaintenanceTeam).first():
        print("Data already exists. Skipping seed.")
        return

    print("--- Seeding Teams ---")
    team_mech = models.MaintenanceTeam(name="Mechanics")
    team_elec = models.MaintenanceTeam(name="Electricians")
    team_it = models.MaintenanceTeam(name="IT Support")
    db.add_all([team_mech, team_elec, team_it])
    db.commit()

    print("--- Seeding Users (Technicians) ---")
    u1 = models.User(name="Mitchell Admin", team_id=team_mech.id, avatar_url="https://i.pravatar.cc/150?u=mitchell")
    u2 = models.User(name="Marc Demo", team_id=team_elec.id, avatar_url="https://i.pravatar.cc/150?u=marc")
    u3 = models.User(name="Abigail Peterson", team_id=team_it.id, avatar_url="https://i.pravatar.cc/150?u=abigail")
    db.add_all([u1, u2, u3])
    db.commit()

    print("--- Seeding Work Centers ---")
    wc1 = models.WorkCenter(name="Assembly Line 1", code="WC-001", cost_per_hour=150.0, capacity=100.0, oee_target=90.0)
    wc2 = models.WorkCenter(name="Drill Station", code="WC-002", cost_per_hour=85.0, capacity=50.0, oee_target=75.5)
    db.add_all([wc1, wc2])
    db.commit()

    print("--- Seeding Equipment ---")
    eq1 = models.Equipment(
        name="CNC Machine X1", serial_number="MT/125/22778837", category="Heavy Machinery",
        department="Production", location="Floor 1", 
        maintenance_team_id=team_mech.id, technician_id=u1.id,
        purchase_date=datetime.now() - timedelta(days=700)
    )
    eq2 = models.Equipment(
        name="Samsung Monitor 15\"", serial_number="MT/122/11112222", category="Monitors",
        department="Admin", location="Office 202",
        maintenance_team_id=team_it.id, technician_id=u3.id,
        purchase_date=datetime.now() - timedelta(days=200)
    )
    eq3 = models.Equipment(
        name="Generator 5000", serial_number="GEN-5K", category="Power",
        department="Utility", location="Basement",
        maintenance_team_id=team_elec.id, technician_id=u2.id,
        purchase_date=datetime.now() - timedelta(days=1000)
    )
    db.add_all([eq1, eq2, eq3])
    db.commit()
    
    print("--- Seeding Requests ---")
    
    # Request 1: Corrective, Assigned to Technician, Has Notes
    req1 = models.MaintenanceRequest(
        subject="Leaking Oil", 
        request_type=models.RequestType.CORRECTIVE,
        equipment_id=eq1.id, 
        assigned_team_id=team_mech.id,
        technician_id=u1.id,  # <--- Assigned!
        stage=models.RequestStage.IN_PROGRESS,
        priority=3,
        notes="Oil leak detected near the main valve. Needs gasket replacement.",
        instructions="Wear safety gloves. Shut down power before inspecting."
    )
    
    # Request 2: Preventive, Future Date
    req2 = models.MaintenanceRequest(
        subject="Monthly Checkup", 
        request_type=models.RequestType.PREVENTIVE,
        equipment_id=eq3.id, 
        assigned_team_id=team_elec.id,
        stage=models.RequestStage.NEW,
        scheduled_date=datetime.now() + timedelta(days=5),
        priority=2
    )

    # Request 3: Work Center Request (Not Equipment)
    req3 = models.MaintenanceRequest(
        subject="Calibration Error", 
        request_type=models.RequestType.CORRECTIVE,
        work_center_id=wc1.id,  # <--- Linked to Work Center!
        assigned_team_id=team_mech.id,
        technician_id=u1.id,
        stage=models.RequestStage.NEW,
        priority=1,
        notes="Assembly line sensor is drifting."
    )

    db.add_all([req1, req2, req3])
    db.commit()

    print("--- Seeding Complete! ---")
    db.close()

if __name__ == "__main__":
    seed_data()