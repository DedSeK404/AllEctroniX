from sqlalchemy import JSON, Column, Float, Integer, String
# Import the shared Base class from session.py
from app.db.session import Base


class ComponentModel(Base):
    __tablename__ = "components"

    id = Column(String, primary_key=True, index=True)
    part_number = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    subcategory = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    package = Column(String, nullable=True)
    description = Column(String, nullable=True)
    symptoms = Column(JSON, default=list)
    specs = Column(JSON, default=dict)