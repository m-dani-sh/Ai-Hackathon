#!/usr/bin/env python3
import os
import sys
import json
import re
from datetime import datetime
from typing import Dict, Any, Optional
from data_models import Receipt

# Try to import pytesseract for OCR
try:
    import pytesseract
    from PIL import Image
    import cv2
    import numpy as np
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    print("Warning: OCR libraries not available. Install with: pip install pytesseract pillow opencv-python")

def extract_text_from_image(image_path: str) -> str:
    """Extract text from receipt image using OCR."""
    if not OCR_AVAILABLE:
        raise ImportError("OCR libraries not available. Install pytesseract, pillow, and opencv-python")
    
    try:
        # Read image
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not read image: {image_path}")
        
        # Preprocessing for better OCR
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply threshold to get better text extraction
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Noise removal
        kernel = np.ones((1,1), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
        
        # Extract text using Tesseract
        text = pytesseract.image_to_string(opening, config='--psm 6')
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from image: {e}")
        return ""

def parse_receipt_text(text: str) -> Dict[str, Any]:
    """Parse extracted text to get receipt information."""
    receipt_data = {
        "company": None,
        "date": None,
        "address": None,
        "total": None,
        "items": []
    }
    
    lines = text.split('\n')
    
    # Extract company name (usually first few lines)
    for i, line in enumerate(lines[:5]):
        if line.strip() and len(line.strip()) > 3:
            # Skip common non-company lines
            if not any(keyword in line.lower() for keyword in ['cash', 'bill', 'receipt', 'invoice', 'no.', 'date']):
                receipt_data["company"] = line.strip()
                break
    
    # Extract date
    date_patterns = [
        r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}',
        r'\d{2,4}[/-]\d{1,2}[/-]\d{1,2}',
        r'\d{1,2}\s+\w{3,9}\s+\d{2,4}'
    ]
    
    for line in lines:
        for pattern in date_patterns:
            match = re.search(pattern, line)
            if match:
                receipt_data["date"] = match.group()
                break
    
    # Extract total amount
    total_patterns = [
        r'total[:\s]*\$?(\d+\.?\d*)',
        r'amount[:\s]*\$?(\d+\.?\d*)',
        r'sum[:\s]*\$?(\d+\.?\d*)',
        r'\$?(\d+\.\d{2})\s*total',
        r'grand\s+total[:\s]*\$?(\d+\.?\d*)'
    ]
    
    for line in lines:
        line_lower = line.lower()
        for pattern in total_patterns:
            match = re.search(pattern, line_lower)
            if match:
                receipt_data["total"] = match.group(1)
                break
    
    return receipt_data

def process_uploaded_image(image_path: str, output_dir: str) -> Optional[Receipt]:
    """Process uploaded receipt image and create receipt object."""
    try:
        # Extract text using OCR
        extracted_text = extract_text_from_image(image_path)
        
        if not extracted_text:
            print("No text extracted from image")
            return None
        
        # Parse the extracted text
        receipt_data = parse_receipt_text(extracted_text)
        
        # Create receipt object
        receipt_id = os.path.splitext(os.path.basename(image_path))[0]
        
        # Parse date
        receipt_date = None
        if receipt_data["date"]:
            date_formats = ['%d/%m/%Y', '%d-%m-%Y', '%Y-%m-%d', '%d %b %Y', '%d %B %Y']
            for fmt in date_formats:
                try:
                    receipt_date = datetime.strptime(receipt_data["date"], fmt)
                    break
                except ValueError:
                    continue
        
        # Parse total amount
        total_amount = 0.0
        if receipt_data["total"]:
            try:
                total_amount = float(re.sub(r'[^\d.]', '', receipt_data["total"]))
            except ValueError:
                print(f"Could not parse total amount: {receipt_data['total']}")
        
        # Save OCR text to file
        ocr_text_path = os.path.join(output_dir, f"ocr_{receipt_id}.txt")
        with open(ocr_text_path, 'w', encoding='utf-8') as f:
            f.write(extracted_text)
        
        # Save parsed data as JSON
        json_path = os.path.join(output_dir, f"{receipt_id}.json")
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(receipt_data, f, indent=2, ensure_ascii=False)
        
        receipt = Receipt(
            id=receipt_id,
            store_name=receipt_data["company"],
            date=receipt_date,
            total_amount=total_amount,
            image_path=image_path,
            ocr_text_path=ocr_text_path
        )
        
        return receipt
        
    except Exception as e:
        print(f"Error processing uploaded image: {e}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python receipt_ocr.py <image_path> <output_dir>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    output_dir = sys.argv[2]
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process the image
    receipt = process_uploaded_image(image_path, output_dir)
    
    if receipt:
        print(f"Successfully processed receipt: {receipt.store_name} - ${receipt.total_amount:.2f}")
    else:
        print("Failed to process receipt")
        sys.exit(1)
