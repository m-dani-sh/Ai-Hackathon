#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(__file__))

from parse_dataset import parse_receipts_from_dataset
from data_processor import calculate_spending_analytics
from receipt_ocr import process_uploaded_image

def main():
    # Parse receipts from dataset and uploads
    receipts = []
    
    # Parse from dataset if available
    dataset_path = '../dataset'
    if os.path.exists(dataset_path):
        receipts.extend(parse_receipts_from_dataset(dataset_path))
    
    # Process uploaded receipts
    uploads_path = '../uploads'
    if os.path.exists(uploads_path):
        for file in os.listdir(uploads_path):
            if file.endswith(('.jpg', '.jpeg', '.png', '.bmp')) and not file.startswith('ocr_'):
                image_path = os.path.join(uploads_path, file)
                try:
                    receipt = process_uploaded_image(image_path, uploads_path)
                    if receipt:
                        receipts.append(receipt)
                except Exception as e:
                    print(f"Error processing uploaded image {file}: {e}")
    
    # Calculate analytics
    analytics = calculate_spending_analytics(receipts)
    
    print("Spending by Store:")
    for store, amount in analytics['spending_by_store'].items():
        print(f"{store}: ${amount:.2f}")
    
    print("\nMost Frequent Stores:")
    for store, count in analytics['most_frequent_stores']:
        print(f"{store}: {count}")
    
    print(f"\nAverage Transaction Value: ${analytics['average_transaction_value']:.2f}")

if __name__ == "__main__":
    main()
