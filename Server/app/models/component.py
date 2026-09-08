from sqlalchemy import Column, String, Float, Integer, JSON
from sqlalchemy.orm import declarative_base

Base = declarative_base()

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
    symptoms = Column(JSON, default=[])
    specs = Column(JSON, default={})