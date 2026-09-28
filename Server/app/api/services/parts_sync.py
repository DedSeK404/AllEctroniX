import pandas as pd
from app.db.session import SessionLocal  # Import your session factory
from app.models.part import Part

CSV_URL = "https://lrks.github.io/jlcpcb-economic-parts/economic-parts.csv"


def parse_float(val) -> float:
  try:
    if val is None or val == "" or pd.isna(val):
      return 0.0
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


def sync_jlcpcb_parts() -> dict:
  # Create a dedicated independent session for the background task
  db = SessionLocal()
  try:
    df = pd.read_csv(CSV_URL)
    df.columns = [c.strip().lower() for c in df.columns]

    records = []
    for _, row in df.iterrows():
      price_val = None
      for col in row.index:
        if "price" in col:
          price_val = row[col]
          break

      stock_val = None
      for col in row.index:
        if "stock" in col or "qty" in col or "quantity" in col:
          stock_val = row[col]
          break

      part_data = {
          "code": str(row.get("code") or row.get("lcsc part") or "").strip(),
          "brand": str(row.get("brand") or row.get("manufacturer") or "").strip(),
          "package": str(
              row.get("package") or row.get("footprint") or ""
          ).strip(),
          "category": str(row.get("category") or "").strip(),
          "type": str(row.get("type") or row.get("subcategory") or "").strip(),
          "describe": str(
              row.get("describe") or row.get("description") or ""
          ).strip(),
          "price": parse_float(price_val),
          "stock": parse_int(stock_val),
          "file": str(
              row.get("file") or row.get("datasheet") or row.get("pdf") or ""
          ).strip(),
      }
      records.append(part_data)

    # Perform bulk refresh transaction safely
    db.query(Part).delete()
    db.bulk_insert_mappings(Part, records)
    db.commit()

    return {"status": "success", "total_synced": len(records)}
  except Exception as e:
    db.rollback()
    raise e
  finally:
    db.close()  # Always close the session to prevent connection leaks