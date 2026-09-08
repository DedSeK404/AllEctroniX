import json
import uuid
from app.db.session import engine, SessionLocal
from app.models.component import Base, ComponentModel

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(ComponentModel).first():
        print("PostgreSQL database already contains data. Skipping seed.")
        db.close()
        return

    with open("app/db/components.json", "r") as f:
        components_data = json.load(f)

    for item in components_data:
        db_item = ComponentModel(
            id=f"comp-{uuid.uuid4().hex[:8]}",
            part_number=item["part_number"],
            name=item["name"],
            category=item["category"],
            subcategory=item["subcategory"],
            price=item["price"],
            stock=item["stock"],
            package=item.get("package"),
            description=item.get("description"),
            symptoms=item.get("symptoms", []),
            specs=item.get("specs", {})
        )
        db.add(db_item)

    db.commit()
    db.close()
    print("PostgreSQL database successfully created and seeded!")

if __name__ == "__main__":
    seed_database()