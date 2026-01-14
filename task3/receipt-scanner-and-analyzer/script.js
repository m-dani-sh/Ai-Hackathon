// Function to handle API errors gracefully
function handleApiError(error, fallbackFunction) {
    console.error('API Error:', error);
    // Show error message to user instead of using mock data
    const container = event?.currentTarget?.querySelector('[id$="-data"]');
    if (container) {
        container.innerHTML = '<p style="color: red;">Error loading data. Please ensure the backend is running and try again.</p>';
    }
}

function displayMonthlySummary(summary) {
    const container = document.getElementById('monthly-summary-data');
    let html = '<ul>';
    for (const [month, total] of Object.entries(summary)) {
        html += `<li><strong>${month}:</strong> $${total.toFixed(2)}</li>`;
    }
    html += '</ul>';
    container.innerHTML = html;
}

function displaySpendingAnalytics(analytics) {
    const container = document.getElementById('spending-analytics-data');
    let html = '<h3>Top 5 Most Frequent Stores</h3><ul>';
    analytics.most_frequent_stores.forEach(([store, count]) => {
        html += `<li>${store}: ${count} visits</li>`;
    });
    html += '</ul>';
    html += `<p><strong>Average Transaction Value:</strong> $${analytics.average_transaction_value.toFixed(2)}</p>`;
    container.innerHTML = html;
}

function displayAlerts(alerts) {
    const container = document.getElementById('alerts-data');
    let html = '<ul>';
    alerts.forEach(alert => {
        html += `<li>${alert}</li>`;
    });
    html += '</ul>';
    container.innerHTML = html;
}

async function fetchMonthlySummary() {
    try {
        const response = await fetch('/api/summary');
        const data = await response.json();
        displayMonthlySummary(data);
    } catch (error) {
        handleApiError(error);
    }
}

async function fetchSpendingAnalytics() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        displaySpendingAnalytics(data);
    } catch (error) {
        handleApiError(error);
    }
}

async function fetchAlerts() {
    try {
        const response = await fetch('/api/alerts');
        const data = await response.json();
        displayAlerts(data);
    } catch (error) {
        handleApiError(error);
    }
}

function displayReportChart() {
    const chart = document.getElementById('report-chart');
    // Use the API endpoint for the report
    chart.src = '/api/report';
}

document.addEventListener('DOMContentLoaded', () => {
    // Fetch data from API endpoints
    fetchMonthlySummary();
    fetchSpendingAnalytics();
    fetchAlerts();
    displayReportChart();
    
    // Add file upload functionality
    const uploadBtn = document.getElementById('upload-btn');
    const fileInput = document.getElementById('receipt-upload');
    
    uploadBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select a receipt image to upload');
            return;
        }
        
        const formData = new FormData();
        formData.append('receipt', file);
        
        try {
            uploadBtn.textContent = 'Uploading...';
            uploadBtn.disabled = true;
            
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                if (result.processed) {
                    alert('Receipt uploaded and processed successfully! OCR analysis complete.');
                } else {
                    alert('Receipt uploaded successfully!');
                }
                console.log('Upload result:', result);
                // Refresh data after upload to show new insights
                fetchMonthlySummary();
                fetchSpendingAnalytics();
                fetchAlerts();
                displayReportChart();
            } else {
                alert('Upload failed: ' + result.message);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            uploadBtn.textContent = 'Upload and Process';
            uploadBtn.disabled = false;
        }
    });
});

