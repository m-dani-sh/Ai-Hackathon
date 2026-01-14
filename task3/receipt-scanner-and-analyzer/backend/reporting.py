import matplotlib.pyplot as plt

def generate_summary_chart(summary_data, output_path):
    months = list(summary_data.keys())
    expenses = list(summary_data.values())

    plt.figure(figsize=(10, 6))
    plt.bar(months, expenses, color='skyblue')
    plt.xlabel('Month')
    plt.ylabel('Total Expenses')
    plt.title('Monthly Expense Summary')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(output_path)
    print(f'Chart saved to {output_path}')
