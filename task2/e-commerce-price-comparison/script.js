// Working APIs without CORS issues
const DUMMYSHOP_API_URL = "https://dummyjson.com/products/search";
const FAKESTORE_API_URL = "https://fakestoreapi.com/products";
const RAPIDAPI_KEY = "27dc1280b5msh75faa2a12a0a27dp16098ajsnb272e4b23995";

const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const resultsContainer = document.getElementById("resultsContainer")
const emptyState = document.getElementById("emptyState")
const errorMessage = document.getElementById("errorMessage")
const loadingSpinner = document.getElementById("loadingSpinner")

// Event listeners
searchBtn.addEventListener("click", performSearch)
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch()
})

function performSearch() {
  const query = searchInput.value.trim().toLowerCase()

  if (!query) {
    showError("Please enter a product name")
    return
  }

  // Show loading state
  loadingSpinner.classList.remove("hidden")
  errorMessage.classList.add("hidden")
  resultsContainer.classList.add("hidden")
  emptyState.classList.add("hidden")

  fetchDeals(query);
}

function fetchDeals(query) {
  // TO DO: implement API call to fetch deals
}

async function fetchDeals(query) {
  // Show loading state
  loadingSpinner.classList.remove("hidden")
  errorMessage.classList.add("hidden")
  resultsContainer.classList.add("hidden")
  emptyState.classList.add("hidden")

  const fetchFakeStore = async (query) => {
    try {
      const response = await fetch(FAKESTORE_API_URL);
      const data = await response.json();
      // Filter products based on search query
      const filteredProducts = data.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);
      return filteredProducts.map(item => ({
        platform: 'FakeStore',
        title: item.title,
        price: item.price,
        image: item.image,
        link: `https://fakestoreapi.com/products/${item.id}`
      }));
    } catch (error) {
      console.error('FakeStore API Error:', error);
      return [];
    }
  };

  const fetchDummyShop = async (query) => {
    const url = `${DUMMYSHOP_API_URL}?q=${encodeURIComponent(query)}&limit=10`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.products.map(item => ({
        platform: 'DummyShop',
        title: item.title,
        price: item.price,
        image: item.thumbnail,
        link: `https://dummyjson.com/products/${item.id}`
      }));
    } catch (error) {
      console.error('DummyShop API Error:', error);
      return [];
    }
  };

  const fetchAmazon = async (query) => {
    const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&country=US&page=1`;
    try {
      const response = await fetch(url, {
        headers: {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
        }
      });
      const data = await response.json();
      // Handle different response structures
      const products = data.data?.products || data.products || [];
      return products.map(item => ({
        platform: 'Amazon',
        title: item.product_title || item.title || 'Unknown Product',
        price: parseFloat(item.product_price || item.price || 0),
        image: item.product_photo || item.thumbnail || item.image || '',
        link: item.product_url || item.url || '#'
      }));
    } catch (error) {
      console.error('Amazon (RapidAPI) Error:', error);
      return [];
    }
  };

  try {
    const results = await Promise.all([
      fetchFakeStore(query),
      fetchDummyShop(query),
      fetchAmazon(query)
    ]);

    const allDeals = results.flat().filter(deal => deal);
    loadingSpinner.classList.add("hidden");

    if (allDeals.length > 0) {
      displayResults(allDeals, query);
      resultsContainer.classList.remove("hidden");
    } else {
      showError(`No results found for "${query}".`);
    }
  } catch (error) {
    loadingSpinner.classList.add("hidden");
    showError("An error occurred while fetching deals.");
    console.error("Fetch error:", error);
  }
}

function displayResults(deals, query) {
  document.getElementById("productName").textContent = `Results for "${query}"`;
  document.getElementById("productDesc").textContent = `Found ${deals.length} offers across different stores.`;

  const validDeals = deals.filter(deal => deal && typeof deal.price === 'number' && deal.price > 0);

  if (validDeals.length === 0) {
    showError(`No valid offers found for "${query}".`);
    resultsContainer.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  const lowestPrice = Math.min(...validDeals.map(d => d.price));

  const pricesContent = document.getElementById("pricesContent");
  pricesContent.innerHTML = "";

  validDeals.forEach(item => {
    const isLowest = item.price === lowestPrice;
    const card = document.createElement("div");
    card.className = `price-card ${isLowest ? "best-price" : ""}`;

    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="product-image" onerror="this.style.display='none'">
      <div class="product-details">
        <div class="platform-name">${item.platform}</div>
        <div class="product-title" title="${item.title}">${item.title}</div>
        ${isLowest ? '<span class="best-price-badge">BEST PRICE</span>' : ''}
        <div class="price-display">$${item.price.toFixed(2)}</div>
        <a href="${item.link}" target="_blank" class="view-btn">View on ${item.platform}</a>
      </div>
    `;
    pricesContent.appendChild(card);
  });

  const bestDeal = validDeals.find(d => d.price === lowestPrice);
  document.getElementById("bestDealText").textContent = `Best price is $${lowestPrice.toFixed(2)} at ${bestDeal.platform}!`;
  document.querySelector(".best-deal").classList.remove("hidden");
}

function showError(message) {
  errorMessage.textContent = message
  errorMessage.classList.remove("hidden")
}
