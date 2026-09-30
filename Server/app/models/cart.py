from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Cart(Base):
    __tablename__ = "carts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True) 
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    part_code = Column(String, ForeignKey("parts.code"), nullable=False) 
    quantity = Column(Integer, nullable=False, default=1)
    cart = relationship("Cart", back_populates="items")
    part = relationship("Part")

class CartHistory(Base):
    __tablename__ = "cart_history"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("carts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    items_snapshot = Column(JSON, nullable=False, default=list)
    creation_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)