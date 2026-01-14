const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve the frontend
app.use(express.static(path.join(__dirname, '..')));

// Set up the file upload endpoint with OCR processing
app.post('/upload', upload.single('receipt'), (req, res) => {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (req.file) {
        console.log(`File uploaded successfully: ${req.file.filename}`);
        
        // Process the uploaded image with OCR
        const imagePath = req.file.path;
        const outputPath = '../uploads/';
        
        exec(`python receipt_ocr.py "${imagePath}" "${outputPath}"`, { cwd: __dirname }, (error, stdout, stderr) => {
            if (error) {
                console.error('Error processing receipt with OCR:', error);
                return res.status(500).json({ 
                    message: 'File uploaded but OCR processing failed', 
                    filename: req.file.filename,
                    error: 'OCR processing failed'
                });
            }
            
            console.log('OCR Processing output:', stdout);
            
            res.json({ 
                message: 'File uploaded and processed successfully', 
                filename: req.file.filename,
                originalname: req.file.originalname,
                size: req.file.size,
                processed: true
            });
        });
    } else {
        console.log('File upload failed - no file received');
        res.status(400).json({ message: 'File upload failed - no file received' });
    }
});

// Get monthly summary
app.get('/api/summary', (req, res) => {
    // Run the Python script to get summary
    exec('python get_summary.py', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running Python script:', error);
            return res.status(500).json({ error: 'Failed to generate summary' });
        }
        
        try {
            // Parse the output from Python script
            const lines = stdout.split('\n').filter(line => line.trim());
            const summary = {};
            
            lines.forEach(line => {
                if (line.includes(':') && line.includes('$')) {
                    const [month, amount] = line.split(':').map(s => s.trim());
                    if (month && amount) {
                        summary[month] = parseFloat(amount.replace('$', ''));
                    }
                }
            });
            
            res.json(summary);
        } catch (parseError) {
            console.error('Error parsing summary:', parseError);
            res.status(500).json({ error: 'Failed to parse summary data' });
        }
    });
});

// Get spending analytics
app.get('/api/analytics', (req, res) => {
    // Run the Python analytics script
    exec('python get_analytics.py', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running analytics script:', error);
            return res.status(500).json({ error: 'Failed to generate analytics' });
        }
        
        try {
            // Parse the output from Python script
            const lines = stdout.split('\n').filter(line => line.trim());
            const analytics = {
                spending_by_store: {},
                most_frequent_stores: [],
                average_transaction_value: 0
            };
            
            let currentSection = '';
            lines.forEach(line => {
                line = line.trim();
                if (line.includes('Spending by Store:')) {
                    currentSection = 'spending_by_store';
                } else if (line.includes('Most Frequent Stores:')) {
                    currentSection = 'most_frequent_stores';
                } else if (line.includes('Average Transaction Value:')) {
                    const value = parseFloat(line.split(':')[1].trim().replace('$', ''));
                    analytics.average_transaction_value = value;
                } else if (line.includes(':') && line.includes('$') && currentSection === 'spending_by_store') {
                    const [store, amount] = line.split(':').map(s => s.trim());
                    analytics.spending_by_store[store] = parseFloat(amount.replace('$', ''));
                } else if (line.includes(':') && !line.includes('$') && currentSection === 'most_frequent_stores') {
                    const [store, count] = line.split(':').map(s => s.trim());
                    analytics.most_frequent_stores.push([store, parseInt(count)]);
                }
            });
            
            res.json(analytics);
        } catch (parseError) {
            console.error('Error parsing analytics:', parseError);
            res.status(500).json({ error: 'Failed to parse analytics data' });
        }
    });
});

// Get alerts
app.get('/api/alerts', (req, res) => {
    // Run the Python alerts script
    exec('python get_alerts.py', { cwd: __dirname }, (error, stdout, stderr) => {
        if (error) {
            console.error('Error running alerts script:', error);
            return res.status(500).json({ error: 'Failed to generate alerts' });
        }
        
        try {
            // Parse the output from Python script
            const alerts = stdout.split('\n')
                .filter(line => line.trim())
                .map(line => line.trim());
            
            res.json(alerts);
        } catch (parseError) {
            console.error('Error parsing alerts:', parseError);
            res.status(500).json({ error: 'Failed to parse alerts data' });
        }
    });
});

// Get visual report
app.get('/api/report', (req, res) => {
    const reportPath = path.join(__dirname, '..', 'monthly_expense_summary.png');
    if (fs.existsSync(reportPath)) {
        res.sendFile(reportPath);
    } else {
        res.status(404).json({ error: 'Report not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
