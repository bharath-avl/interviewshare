export const COMPANIES = [
  // Global Tech
  { name: 'Google', slug: 'google', domain: 'google.com' },
  { name: 'Microsoft', slug: 'microsoft', domain: 'microsoft.com' },
  { name: 'Amazon', slug: 'amazon', domain: 'amazon.com' },
  { name: 'Meta', slug: 'meta', domain: 'meta.com' },
  { name: 'Apple', slug: 'apple', domain: 'apple.com' },
  { name: 'Netflix', slug: 'netflix', domain: 'netflix.com' },
  { name: 'Goldman Sachs', slug: 'goldman-sachs', domain: 'goldmansachs.com' },
  { name: 'JPMorgan', slug: 'jpmorgan', domain: 'jpmorgan.com' },
  { name: 'Stripe', slug: 'stripe', domain: 'stripe.com' },
  { name: 'Uber', slug: 'uber', domain: 'uber.com' },
  { name: 'Tesla', slug: 'tesla', domain: 'tesla.com' },
  { name: 'Adobe', slug: 'adobe', domain: 'adobe.com' },
  { name: 'Salesforce', slug: 'salesforce', domain: 'salesforce.com' },
  { name: 'Spotify', slug: 'spotify', domain: 'spotify.com' },
  { name: 'Twitter', slug: 'twitter', domain: 'x.com' },
  { name: 'Airbnb', slug: 'airbnb', domain: 'airbnb.com' },
  { name: 'LinkedIn', slug: 'linkedin', domain: 'linkedin.com' },
  { name: 'Nvidia', slug: 'nvidia', domain: 'nvidia.com' },
  { name: 'Oracle', slug: 'oracle', domain: 'oracle.com' },
  { name: 'IBM', slug: 'ibm', domain: 'ibm.com' },
  { name: 'Intel', slug: 'intel', domain: 'intel.com' },
  { name: 'Samsung', slug: 'samsung', domain: 'samsung.com' },
  { name: 'Deloitte', slug: 'deloitte', domain: 'deloitte.com' },
  { name: 'McKinsey', slug: 'mckinsey', domain: 'mckinsey.com' },
  { name: 'Palantir', slug: 'palantir', domain: 'palantir.com' },
  { name: 'Coinbase', slug: 'coinbase', domain: 'coinbase.com' },
  { name: 'Databricks', slug: 'databricks', domain: 'databricks.com' },
  { name: 'Snowflake', slug: 'snowflake', domain: 'snowflake.com' },
  { name: 'Figma', slug: 'figma', domain: 'figma.com' },
  { name: 'Notion', slug: 'notion', domain: 'notion.so' },

  // Indian IT & Services
  { name: 'TCS', slug: 'tcs', domain: 'tcs.com' },
  { name: 'Infosys', slug: 'infosys', domain: 'infosys.com' },
  { name: 'Wipro', slug: 'wipro', domain: 'wipro.com' },
  { name: 'HCLTech', slug: 'hcltech', domain: 'hcltech.com' },
  { name: 'Tech Mahindra', slug: 'tech-mahindra', domain: 'techmahindra.com' },
  { name: 'LTIMindtree', slug: 'ltimindtree', domain: 'ltimindtree.com' },
  { name: 'Cognizant', slug: 'cognizant', domain: 'cognizant.com' },
  { name: 'Persistent Systems', slug: 'persistent', domain: 'persistent.com' },
  { name: 'Mphasis', slug: 'mphasis', domain: 'mphasis.com' },

  // Indian Startups & Product Companies
  { name: 'Flipkart', slug: 'flipkart', domain: 'flipkart.com' },
  { name: 'Razorpay', slug: 'razorpay', domain: 'razorpay.com' },
  { name: 'Zerodha', slug: 'zerodha', domain: 'zerodha.com' },
  { name: 'PhonePe', slug: 'phonepe', domain: 'phonepe.com' },
  { name: 'Swiggy', slug: 'swiggy', domain: 'swiggy.com' },
  { name: 'Zomato', slug: 'zomato', domain: 'zomato.com' },
  { name: 'CRED', slug: 'cred', domain: 'cred.club' },
  { name: 'Meesho', slug: 'meesho', domain: 'meesho.io' },
  { name: 'Paytm', slug: 'paytm', domain: 'paytm.com' },
  { name: 'Dream11', slug: 'dream11', domain: 'dream11.com' },
  { name: 'Ola', slug: 'ola', domain: 'olacabs.com' },
  { name: 'Myntra', slug: 'myntra', domain: 'myntra.com' },
  { name: 'ShareChat', slug: 'sharechat', domain: 'sharechat.com' },
  { name: 'Groww', slug: 'groww', domain: 'groww.in' },
  { name: 'Unacademy', slug: 'unacademy', domain: 'unacademy.com' },
  { name: 'Juspay', slug: 'juspay', domain: 'juspay.in' },
  { name: 'Atlassian', slug: 'atlassian', domain: 'atlassian.com' },
  { name: 'Sprinklr', slug: 'sprinklr', domain: 'sprinklr.com' },
  { name: 'Nutanix', slug: 'nutanix', domain: 'nutanix.com' },
  { name: 'ServiceNow', slug: 'servicenow', domain: 'servicenow.com' },

  // Indian Conglomerates & Finance
  { name: 'Reliance', slug: 'reliance', domain: 'ril.com' },
  { name: 'Tata Group', slug: 'tata-group', domain: 'tata.com' },
  { name: 'ICICI Bank', slug: 'icici', domain: 'icicibank.com' },
  { name: 'HDFC Bank', slug: 'hdfc', domain: 'hdfcbank.com' },
  { name: 'Bajaj Finserv', slug: 'bajaj-finserv', domain: 'bajajfinserv.in' },
];

export function getCompanyBySlug(slug) {
  return COMPANIES.find(c => c.slug === slug) || null;
}

export function getCompanyLogo(domain, size = 128) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
}

export function getCompanyLogoFallback(name) {
  return name.charAt(0).toUpperCase();
}
