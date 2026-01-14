# Word Cloud Generator

A Python script that scrapes song lyrics from Genius and generates word clouds to visualize word frequency.

## Features
- Web scraping of song lyrics from Genius.com
- Text processing with stopword removal
- Word cloud visualization using WordCloud library
- NLTK integration for text preprocessing

## Tech Stack
- Python 3.x
- Libraries: requests, BeautifulSoup4, wordcloud, matplotlib, nltk

## Dependencies
```bash
pip install requests beautifulsoup4 wordcloud matplotlib nltk
```

## Usage
1. Install required dependencies
2. Run: `python app.py`
3. Script scrapes Taylor Swift's "Love Story" lyrics
4. Displays generated word cloud

## Customization
- Change `song_url` variable for different songs
- Modify word cloud parameters (size, colors, etc.)
- Adjust stopword filtering in `process_text()` function
