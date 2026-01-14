import requests
from bs4 import BeautifulSoup
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import nltk
from nltk.corpus import stopwords

nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def scrape_lyrics(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    lyrics_divs = soup.find_all('div', attrs={"data-lyrics-container": "true"})
    
    if not lyrics_divs:
        raise ValueError("Lyrics not found. Check the URL or website structure.")
    
    lyrics = "\n".join(div.get_text(separator="\n") for div in lyrics_divs)
    return lyrics


def process_text(text):
    words = text.lower().split()
    words = [word.strip('.,!?()') for word in words if word not in stop_words and len(word) > 2]
    return ' '.join(words)

def generate_wordcloud(text):
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.show()


song_url = 'https://genius.com/Taylor-swift-love-story-lyrics'
lyrics = scrape_lyrics(song_url)
cleaned_lyrics = process_text(lyrics)
generate_wordcloud(cleaned_lyrics)