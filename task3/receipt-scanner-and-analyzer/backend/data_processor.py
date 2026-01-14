from typing import List
from collections import Counter
from data_models import Receipt

def calculate_monthly_summary(receipts: List[Receipt]):
    monthly_summary = {}
    for receipt in receipts:
        if receipt.date:
            month_year = receipt.date.strftime('%Y-%m')
            if month_year not in monthly_summary:
                monthly_summary[month_year] = 0
            monthly_summary[month_year] += receipt.total_amount
    return monthly_summary

def calculate_spending_analytics(receipts: List[Receipt]):
    # Spending by store
    spending_by_store = {}
    for receipt in receipts:
        if receipt.store_name:
            if receipt.store_name not in spending_by_store:
                spending_by_store[receipt.store_name] = 0
            spending_by_store[receipt.store_name] += receipt.total_amount

    # Most frequent stores
    store_counts = Counter(r.store_name for r in receipts if r.store_name)
    most_frequent_stores = store_counts.most_common(5)

    # Average transaction value
    total_spending = sum(r.total_amount for r in receipts)
    average_transaction = total_spending / len(receipts) if receipts else 0

    return {
        'spending_by_store': spending_by_store,
        'most_frequent_stores': most_frequent_stores,
        'average_transaction_value': average_transaction
    }
