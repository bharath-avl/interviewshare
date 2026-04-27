// Cloudflare Pages Function — GET /api/news
// Fetches real-time tech company news using NewsData.io API
// Environment variable NEWSDATA_API_KEY must be set in Cloudflare Pages dashboard.
// Free tier: https://newsdata.io — 200 requests/day, perfect for this use-case.

const TECH_KEYWORDS = [
  // Indian Companies
  'TCS', 'Infosys', 'Wipro', 'HCLTech', 'Tech Mahindra', 'LTIMindtree',
  'Flipkart', 'Razorpay', 'Swiggy', 'Zomato', 'PhonePe', 'Paytm',
  'CRED', 'Meesho', 'Ola', 'Dream11', 'Groww', 'Juspay', 'Zerodha',
  'Reliance Jio', 'Myntra', 'ShareChat', 'Unacademy',
  // Global
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
  'Nvidia', 'Adobe', 'Salesforce', 'Uber', 'Tesla', 'Intel',
  'Goldman Sachs', 'JPMorgan', 'Oracle', 'IBM', 'Samsung',
  'Atlassian', 'Sprinklr', 'ServiceNow', 'Cognizant',
];

// Cache news in-memory for 30 minutes to avoid burning API quota
let cachedNews = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export async function onRequestGet(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const apiKey = context.env.NEWSDATA_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'News API key not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const url = new URL(context.request.url);
    const category = url.searchParams.get('category') || 'all'; // all, hiring, layoffs, funding
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    // Check cache
    const now = Date.now();
    if (cachedNews && (now - cacheTimestamp) < CACHE_DURATION_MS && !forceRefresh) {
      const filtered = filterByCategory(cachedNews, category);
      return new Response(
        JSON.stringify({ articles: filtered, cached: true, lastUpdated: new Date(cacheTimestamp).toISOString() }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    // Fetch from NewsData.io — tech news focused on India + global tech
    const queries = [
      `technology hiring layoff startup India`,
      `tech company India jobs funding`,
    ];

    let allArticles = [];

    for (const q of queries) {
      const apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}&q=${encodeURIComponent(q)}&language=en&category=technology,business&size=10`;

      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.results) {
          allArticles = allArticles.concat(data.results);
        }
      }
    }

    // Deduplicate by title
    const seen = new Set();
    const uniqueArticles = allArticles.filter(a => {
      if (!a.title || seen.has(a.title)) return false;
      seen.add(a.title);
      return true;
    });

    // Map to a clean format
    const articles = uniqueArticles.map(a => ({
      title: a.title,
      description: a.description || '',
      url: a.link,
      source: a.source_name || a.source_id || 'Unknown',
      publishedAt: a.pubDate,
      imageUrl: a.image_url || null,
      category: detectCategory(a.title + ' ' + (a.description || '')),
      companies: detectCompanies(a.title + ' ' + (a.description || '')),
    })).filter(a => a.title && a.url);

    // Sort by date (newest first)
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Cache
    cachedNews = articles;
    cacheTimestamp = now;

    const filtered = filterByCategory(articles, category);

    return new Response(
      JSON.stringify({ articles: filtered, cached: false, lastUpdated: new Date(now).toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err) {
    console.error('News function error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch news.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}

function detectCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('layoff') || t.includes('laid off') || t.includes('job cut') || t.includes('fire') || t.includes('downsize')) return 'layoffs';
  if (t.includes('hiring') || t.includes('recruit') || t.includes('job opening') || t.includes('hiring spree') || t.includes('onboard')) return 'hiring';
  if (t.includes('funding') || t.includes('raised') || t.includes('valuation') || t.includes('series') || t.includes('invest')) return 'funding';
  if (t.includes('acquisition') || t.includes('acquire') || t.includes('merger') || t.includes('buyout')) return 'acquisition';
  if (t.includes('ipo') || t.includes('listing') || t.includes('stock')) return 'market';
  return 'general';
}

function detectCompanies(text) {
  return TECH_KEYWORDS.filter(keyword => {
    const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  });
}

function filterByCategory(articles, category) {
  if (category === 'all') return articles;
  return articles.filter(a => a.category === category);
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
