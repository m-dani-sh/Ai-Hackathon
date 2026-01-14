import os
from parse_dataset import process_dataset
from data_processor import calculate_monthly_summary, calculate_spending_analytics

# Handle optional dependencies
try:
    from reporting import generate_summary_chart
    matplotlib_available = True
except ImportError:
    matplotlib_available = False

try:
    from alerts import generate_alerts
    numpy_available = True
except ImportError:
    numpy_available = False

def main():
    # This assumes the dataset is extracted in a 'dataset' folder in the parent directory
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset')
    if not os.path.exists(dataset_path):
        print(f'Dataset directory not found at {dataset_path}')
        return

    # 1. Parse the dataset
    print('Parsing the dataset...')
    parsed_receipts = process_dataset(dataset_path)
    print(f'Successfully parsed {len(parsed_receipts)} receipts.')

    # 2. Calculate the monthly summary
    print('\nCalculating monthly expense summary...')
    monthly_summary = calculate_monthly_summary(parsed_receipts)
    for month, total in monthly_summary.items():
        print(f'  {month}: ${total:.2f}')

    # 3. Calculate spending analytics
    print('\nCalculating spending analytics...')
    analytics = calculate_spending_analytics(parsed_receipts)
    print('  Spending by Store:')
    for store, total in analytics['spending_by_store'].items():
        print(f'    {store}: ${total:.2f}')
    print('\n  Top 5 Most Frequent Stores:')
    for store, count in analytics['most_frequent_stores']:
        print(f'    {store}: {count} visits')
    print(f"\n  Average Transaction Value: ${analytics['average_transaction_value']:.2f}")

    # 4. Generate Alerts
    print('\nGenerating alerts...')
    if numpy_available:
        alerts = generate_alerts(parsed_receipts, monthly_summary)
        if alerts:
            for alert in alerts:
                print(f'  - {alert}')
        else:
            print('  No alerts to display.')
    else:
        print('  Skipping alerts generation: numpy is not installed.')

    # 5. Generate a visual report
    print('\nGenerating visual report...')
    if matplotlib_available:
        output_chart_path = os.path.join(os.path.dirname(__file__), '..', 'monthly_expense_summary.png')
        generate_summary_chart(monthly_summary, output_chart_path)
    else:
        print('  Skipping visual report generation: matplotlib is not installed.')

if __name__ == '__main__':
    main()
