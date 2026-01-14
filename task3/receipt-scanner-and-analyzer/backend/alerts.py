from typing import List
import numpy as np
from data_models import Receipt

def generate_alerts(receipts: List[Receipt], monthly_summary):
    alerts = []

    # 1. High Monthly Spending Alert
    if len(monthly_summary) > 1:
        monthly_totals = list(monthly_summary.values())
        avg_spending = np.mean(monthly_totals)
        std_dev_spending = np.std(monthly_totals)
        high_spending_threshold = avg_spending + (2 * std_dev_spending)

        for month, total in monthly_summary.items():
            if total > high_spending_threshold:
                alerts.append(f"High Spending Alert: Spending in {month} (${total:.2f}) was significantly higher than the average.")

    # 2. Large Transaction Alert
    large_transaction_threshold = 500
    for receipt in receipts:
        if receipt.total_amount > large_transaction_threshold:
            date_str = f"on {receipt.date.strftime('%Y-%m-%d')}" if receipt.date else "on an unknown date"
            alerts.append(f"Large Transaction Alert: A transaction of ${receipt.total_amount:.2f} at {receipt.store_name} {date_str} exceeded the threshold of ${large_transaction_threshold}.")

    return alerts
