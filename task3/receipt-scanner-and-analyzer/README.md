# Receipt Scanner and Analyzer

A system that scans receipt images and converts them into meaningful financial insights using OCR and the SROIE dataset.

## Features

- **Receipt Image Scanning**: Upload and process receipt images using OCR technology
- **Monthly Expense Summaries**: Generate detailed monthly spending reports
- **Spending Analytics**: Analyze spending patterns by store and frequency
- **Smart Alerts**: Get notified about unusual spending patterns and large transactions
- **Visual Reports**: Interactive charts and graphs for expense visualization

## Dataset Integration

This system uses the SROIE dataset from Kaggle containing 973 scanned receipts:
- [SROIE Dataset v2](https://www.kaggle.com/datasets/urbikn/sroie-datasetv2/data)

## Setup Instructions

### Prerequisites

1. **Python 3.7+**
2. **Node.js 14+**
3. **Tesseract OCR** (for image processing)

### Installing Tesseract OCR

**Windows:**
- Download from: https://github.com/UB-Mannheim/tesseract/wiki
- Add Tesseract to your PATH during installation

**macOS:**
```bash
brew install tesseract
```

**Ubuntu/Debian:**
```bash
sudo apt-get install tesseract-ocr
```

### Quick Setup

**Windows:**
```bash
setup.bat
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. Install Python dependencies:
```bash
pip install -r backend/requirements.txt
```

2. Install Node.js dependencies:
```bash
cd backend
npm install
cd ..
```

3. Create uploads directory:
```bash
mkdir uploads
```

## Running the Application

1. Start the backend server:
```bash
cd backend
node server.js
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. **Upload Receipt Images**: Use the upload button to add receipt images (JPG, PNG, BMP)
2. **View Analytics**: The system automatically processes images and updates all analytics
3. **Check Alerts**: Monitor for unusual spending patterns
4. **Download Reports**: Visual reports are generated automatically

## How It Works

1. **Image Processing**: Uploaded receipt images are processed using OCR (Tesseract)
2. **Data Extraction**: Key information (store name, date, total) is extracted from the text
3. **Analysis**: The extracted data is combined with the SROIE dataset for comprehensive analysis
4. **Reporting**: Monthly summaries, spending analytics, and alerts are generated

## File Structure

```
receipt-scanner-and-analyzer/
├── backend/
│   ├── server.js              # Node.js backend server
│   ├── receipt_ocr.py          # OCR processing module
│   ├── data_processor.py       # Data analysis functions
│   ├── alerts.py              # Alert generation
│   └── requirements.txt       # Python dependencies
├── dataset/                   # SROIE dataset
├── uploads/                   # Uploaded receipt images
├── index.html                 # Frontend interface
├── script.js                  # Frontend logic
└── style.css                  # Styling
```

## Troubleshooting

**OCR not working:**
- Ensure Tesseract OCR is properly installed
- Check that Tesseract is in your system PATH
- Verify image quality and text clarity

**Backend not starting:**
- Check that all Node.js dependencies are installed
- Verify Python dependencies are installed
- Check that ports 3000 is available

**No data showing:**
- Ensure the SROIE dataset is properly extracted in the dataset folder
- Check that uploaded images are being processed
- Verify backend logs for any errors

## Features in Detail

### Monthly Summaries
- Automatic grouping of expenses by month
- Total spending calculations
- Month-over-month comparisons

### Spending Analytics
- Top spending stores by amount
- Most frequently visited stores
- Average transaction values
- Spending patterns and trends

### Smart Alerts
- High spending month detection
- Large transaction notifications
- Unusual pattern identification
- Customizable thresholds

### Visual Reports
- Interactive expense charts
- Monthly trend graphs
- Store comparison visuals
- Downloadable reports
