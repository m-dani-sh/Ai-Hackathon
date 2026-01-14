import os
import json
import re
from datetime import datetime
from data_models import Receipt, ReceiptItem

def parse_key_information(file_path):
    try:
        # Use 'utf-8-sig' to handle BOM and 'replace' to handle encoding errors
        with open(file_path, 'r', encoding='utf-8-sig', errors='replace') as f:
            content = f.read()
            if not content:
                print(f"Warning: Empty key information file skipped: {file_path}")
                return {}
            data = json.loads(content)
        return data
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON from file: {file_path}")
        print(f"Error: {e}")
        return {}

def process_dataset(dataset_path):
    receipts = []
    for subdir, dirs, files in os.walk(dataset_path):
        # Exclude 'box' directories from os.walk
        if 'box' in dirs:
            dirs.remove('box')
            
        for file in files:
            if file.endswith('.txt') and not file.startswith('ocr_'):
                key_info_path = os.path.join(subdir, file)
                receipt_id = os.path.splitext(file)[0]
                
                key_info = parse_key_information(key_info_path)
                
                # Skip if key_info is empty due to parsing error
                if not key_info:
                    continue

                raw_date = key_info.get('date')
                receipt_date = None
                if raw_date:
                    # Attempt to parse multiple date formats
                    date_formats = ['%d/%m/%Y', '%d-%m-%y', '%d.%m.%y', '%d %b %y', '%d %b %Y']
                    for fmt in date_formats:
                        try:
                            receipt_date = datetime.strptime(raw_date, fmt)
                            break
                        except ValueError:
                            continue
                    if not receipt_date:
                        print(f"Warning: Could not parse date '{raw_date}' in file {key_info_path}. All formats failed. Skipping date.")

                total_str = key_info.get('total', '0')
                total_amount = 0.0
                if total_str:
                    # Remove currency symbols and other non-numeric characters except the decimal point
                    cleaned_total_str = re.sub(r'[^\d.]', '', total_str)
                    try:
                        total_amount = float(cleaned_total_str)
                    except (ValueError, TypeError):
                        print(f"Warning: Could not convert total '{total_str}' to float in file {key_info_path}. Setting to 0.")
                        total_amount = 0.0

                receipt = Receipt(
                    id=receipt_id,
                    store_name=key_info.get('company'),
                    date=receipt_date,
                    total_amount=total_amount,
                    image_path=os.path.join(subdir, f'{receipt_id}.jpg'),
                    ocr_text_path=os.path.join(subdir, f'ocr_{receipt_id}.txt')
                )
                receipts.append(receipt)
    return receipts

if __name__ == '__main__':
    # This assumes the dataset is extracted in a 'dataset' folder in the parent directory
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset')
    if os.path.exists(dataset_path):
        parsed_receipts = process_dataset(dataset_path)
        print(f'Successfully parsed {len(parsed_receipts)} receipts.')
    else:
        print(f'Dataset directory not found at {dataset_path}')
