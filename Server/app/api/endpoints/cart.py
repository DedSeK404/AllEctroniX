from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartResponse
from app.api.services import cart as cart_service
from app.models.user import UserModel as User # Import your User model here
from app.core.deps import get_current_user # Import your auth dependency here
# Import your auth dependency (e.g., get_current_user) and User model here

router = APIRouter()


@router.get("/", response_model=CartResponse)
def get_user_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Fetch the current user's cart (creates one if it doesn't exist).
    """

    cart= cart_service.get_or_create_cart(db, current_user.id)
    return cart

@router.post("/items", response_model=CartResponse)
def add_item_to_user_cart(
    item_data: CartItemCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Add an item to the current user's cart.
    """
    cart = cart_service.add_item_to_cart(
        db=db, 
        user_id=current_user.id, 
        item_data=item_data
    )
    return cart

@router.patch("/items", response_model=CartResponse)
def update_item_in_user_cart(
    item_data: CartItemUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an item in the current user's cart.
    """
    try:
        cart = cart_service.update_item_quantity(
            db=db, 
            user_id=current_user.id, 
            part_code=item_data.part_code, 
            new_quantity=item_data.quantity
        )
        return cart
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=str(e)
        )

@router.delete("/items/{part_code}", response_model=CartResponse)
def remove_item_from_user_cart(
    part_code: str,  
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Remove an item from the current user's cart by its part code.
    """
    try:
        cart = cart_service.remove_cart_item(
            db=db, 
            user_id=current_user.id, 
            part_code=part_code
        )
        return cart
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=str(e)
        )

@router.delete("/", response_model=CartResponse)
def clear_user_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Clear all items from the current user's cart.
    """
    cart = cart_service.clear_cart(
        db=db, 
        user_id=current_user.id
    )
    return cart