from sqlalchemy import Column, Integer, String, Float, Text
from app.db.session import Base

class Part(Base):
    __tablename__ = "parts"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, index=True, nullable=False)  # e.g., C13661
    brand = Column(String, index=True, nullable=True)
    package = Column(String, nullable=True)
    category = Column(String, index=True, nullable=True)
    type = Column(String, index=True, nullable=True)
    describe = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    stock = Column(Integer, default=0)