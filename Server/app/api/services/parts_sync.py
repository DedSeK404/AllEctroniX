import pandas as pd
from sqlalchemy.orm import Session
from app.models.part import Part

CSV_URL = "https://lrks.github.io/jlcpcb-economic-parts/economic-parts.csv"

def parse_float(val) -> float:
    try:
        if val is None or val == "" or pd.isna(val):
            return 0.0
        # Strip currency symbols if present ($ or ¥)
        clean_str = str(val).replace("$", "").replace("¥", "").strip()
        return float(clean_str)
    except (ValueError, TypeError):
        return 0.0

def parse_int(val) -> int:
    try:
        if val is None or val == "" or pd.isna(val):
            return 0
        return int(float(val))
    except (ValueError, TypeError):
        return 0

def sync_jlcpcb_parts(db: Session) -> dict:
    # 1. Read CSV without converting NaNs to empty strings upfront
    df = pd.read_csv(CSV_URL)

    # Clean up column headers (lowercase and strip spaces/symbols)
    # This turns "Price ($)" -> "price ($)", "Stock" -> "stock", etc.
    df.columns = [c.strip().lower() for c in df.columns]

    records = []
    for _, row in df.iterrows():
        # Find price column dynamically (matches 'price', 'price ($)', or 'unit price')
        price_val = None
        for col in row.index:
            if "price" in col:
                price_val = row[col]
                break

        # Find stock column dynamically (matches 'stock', 'quantity', or 'qty')
        stock_val = None
        for col in row.index:
            if "stock" in col or "qty" in col or "quantity" in col:
                stock_val = row[col]
                break

        part_data = {
            "code": str(row.get("code") or row.get("lcsc part") or "").strip(),
            "brand": str(row.get("brand") or row.get("manufacturer") or "").strip(),
            "package": str(row.get("package") or row.get("footprint") or "").strip(),
            "category": str(row.get("category") or "").strip(),
            "type": str(row.get("type") or row.get("subcategory") or "").strip(),
            "describe": str(row.get("describe") or row.get("description") or "").strip(),
            "price": parse_float(price_val),
            "stock": parse_int(stock_val),
        }
        records.append(part_data)

    # 2. Bulk refresh database
    db.query(Part).delete()
    db.bulk_insert_mappings(Part, records)
    db.commit()

    return {"status": "success", "total_synced": len(records)}