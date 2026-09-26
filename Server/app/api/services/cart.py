from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem
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