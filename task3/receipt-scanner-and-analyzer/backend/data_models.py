from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional

@dataclass
class ReceiptItem:
    name: str
    price: float

@dataclass
class Receipt:
    id: str
    store_name: str
    date: datetime
    total_amount: float
    items: List[ReceiptItem] = field(default_factory=list)
    image_path: Optional[str] = None
    ocr_text_path: Optional[str] = None
