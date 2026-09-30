from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem, CartHistory
from app.models.part import Part
from typing import List
from app.schemas.cart import CartItemCreate


def get_or_create_cart(db: Session, user_id: int) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if cart:
        return cart

    new_cart = Cart(user_id=user_id)
    db.add(new_cart)
    db.commit()
    db.refresh(new_cart)
    return new_cart
def checkout_cart(db: Session, user_id: int) -> CartHistory:
    """
    Finds the active cart, creates a frozen snapshot of items, and posts to history.
    """
    cart = get_or_create_cart(db, user_id)
    
    if not cart.items:
        raise ValueError("Cannot checkout an empty cart.")

    # 1. Build immutable snapshot of items and product details
    snapshot = []
    for item in cart.items:
        # Match using 'part' (lowercase) and 'Part.code' (model attribute)
        part = db.query(Part).filter(Part.code == item.part_code).first()
        
        snapshot.append({
            "part_code": item.part_code,
            "product_name": (part.type or part.describe or part.code) if part else f"Part #{item.part_code}",
            "price": float(part.price) if (part and part.price is not None) else 0.0,
            "image_url": part.file if part else None,
            "quantity": item.quantity
        })

    # 2. Create immutable history record
    cart_history = CartHistory(
        cart_id=cart.id,
        user_id=user_id,
        items_snapshot=snapshot
    )
    db.add(cart_history)

    # 3. Clear active cart items
    for item in list(cart.items):
        db.delete(item)

    db.commit()
    db.refresh(cart_history)

    return cart_history


def get_user_order_history(db: Session, user_id: int) -> List[CartHistory]:
    """
    Retrieves all historical orders for a user.
    """
    return db.query(CartHistory).filter(CartHistory.user_id == user_id).order_by(CartHistory.creation_date.desc()).all()

def add_item_to_cart(db: Session, user_id: int, item_data: CartItemCreate) -> Cart:
    cart = get_or_create_cart(db, user_id)

    existing_item = next(
        (item for item in cart.items if item.part_code == item_data.part_code),
        None
    )

    if existing_item:
        existing_item.quantity += item_data.quantity
    else:
        new_item = CartItem(
            cart_id=cart.id,
            part_code=item_data.part_code,
            quantity=item_data.quantity
        )
        db.add(new_item)

    db.commit()
    db.refresh(cart)
    return cart


def update_item_quantity(db: Session, user_id: int, part_code: str, new_quantity: int) -> Cart:
    cart = get_or_create_cart(db, user_id)
     
    existing_item = next(
        (item for item in cart.items if item.part_code == part_code),
        None
    )
     
    if not existing_item:
        raise ValueError("Item not found in cart.")

    if new_quantity > 0:
        existing_item.quantity = new_quantity
    else:
        db.delete(existing_item)

    db.commit()
    db.refresh(cart)
    return cart

def remove_cart_item(db: Session, user_id: int, part_code: str) -> Cart:
    cart = get_or_create_cart(db, user_id)

    existing_item = next(
        (item for item in cart.items if item.part_code == part_code),
        None
    )

    if not existing_item:
        raise ValueError("Item not found in cart.")

    db.delete(existing_item)
    db.commit()
    db.refresh(cart)
    return cart

def clear_cart(db: Session, user_id: int) -> Cart:
    cart = get_or_create_cart(db, user_id)

    for item in cart.items:
        db.delete(item)

    db.commit()
    db.refresh(cart)
    return cart 