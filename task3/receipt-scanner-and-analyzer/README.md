# Receipt Scanner and Analyzer

A system that scans receipt images and converts them into meaningful financial insights using OCR and the SROIE dataset.

## Features
- Receipt image scanning with OCR technology
- Monthly expense summaries and detailed reports
- Spending analytics by store and frequency
- Smart alerts for unusual spending patterns
- Interactive charts and visual reports

## Tech Stack
- Backend: Python with Flask
- OCR: Tesseract OCR engine
- Frontend: HTML5, CSS3, JavaScript
- Dataset: SROIE receipt dataset (973 receipts)
- Visualization: Chart.js for analytics

## Setup
1. Install Python 3.7+, Node.js 14+, Tesseract OCR
2. Run setup script: `setup.bat` (Windows) or `setup.sh` (Linux/macOS)
3. Access web interface at localhost:5000
4. Upload receipt images for analysis

## Dataset
Uses SROIE dataset v2 with 973 scanned receipts for training and testing OCR capabilities.

## Output
Extracts text, amounts, dates, and merchants from receipts with financial analytics and spending insights.
