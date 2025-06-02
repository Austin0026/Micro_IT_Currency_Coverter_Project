const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const resultDiv = document.getElementById('result');
const convertBtn = document.getElementById('convertBtn');
const swapBtn = document.getElementById('swapBtn');
const loader = document.getElementById('loader');
const fromFlag = document.getElementById('fromFlag');
const toFlag = document.getElementById('toFlag');

const BASE_API_URL = 'https://v6.exchangerate-api.com/v6/dabfe21175519303b6ae2c9a/latest/';

// Map currency codes to country codes for flags
const currencyToCountry = {
  USD: 'us',
  EUR: 'eu', // EU flag (may not render in some flag sources)
  GBP: 'gb',
  INR: 'in',
  JPY: 'jp',
  CAD: 'ca',
  AUD: 'au',
  CHF: 'ch',
  CNY: 'cn',
  NZD: 'nz',
  SGD: 'sg',
  // Add more as needed
};

// Show loader
function showLoader() {
  loader.classList.remove('hidden');
}

// Hide loader
function hideLoader() {
  loader.classList.add('hidden');
}

// Helper to get flag URL using country code
function getFlagUrl(currencyCode) {
  const countryCode = currencyToCountry[currencyCode];
  if (!countryCode) {
    return ''; // fallback: empty string (no flag)
  }
  // Using flagcdn.com - free flags, 40px wide
  return `https://flagcdn.com/w40/${countryCode}.png`;
}

// Update flags based on selected currencies
function updateFlags() {
  fromFlag.src = getFlagUrl(fromCurrency.value);
  toFlag.src = getFlagUrl(toCurrency.value);
}

// Populate currency dropdowns
async function fetchCurrencies() {
  showLoader();
  try {
    const res = await fetch(BASE_API_URL + 'USD');
    const data = await res.json();
    const currencies = Object.keys(data.conversion_rates);

    currencies.forEach(currency => {
      fromCurrency.add(new Option(currency, currency));
      toCurrency.add(new Option(currency, currency));
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'INR';

    updateFlags();
  } catch (error) {
    resultDiv.textContent = 'Error loading currencies.';
  }
  hideLoader();
}

// Perform currency conversion
async function convertCurrency() {
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount)) {
    resultDiv.textContent = 'Please enter a valid amount.';
    return;
  }

  showLoader();
  try {
    const res = await fetch(BASE_API_URL + from);
    const data = await res.json();
    const rate = data.conversion_rates[to];
    const converted = (amount * rate).toFixed(2);
    resultDiv.textContent = `${amount} ${from} = ${converted} ${to}`;
  } catch (error) {
    resultDiv.textContent = 'Conversion failed. Please try again.';
  }
  hideLoader();
}

// Swap currencies when swap button clicked
swapBtn.addEventListener('click', () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  updateFlags();
  convertCurrency();
});

// Update flags & convert on currency change
fromCurrency.addEventListener('change', () => {
  updateFlags();
  convertCurrency();
});
toCurrency.addEventListener('change', () => {
  updateFlags();
  convertCurrency();
});

// Convert on button click
convertBtn.addEventListener('click', convertCurrency);

// Initialize app
fetchCurrencies();
