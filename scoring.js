/**
 * Normalizes a value to a 0-100 scale based on the minimum and maximum values in a dataset.
 * If all values are the same (max === min), it returns 100 to avoid division by zero.
 */
function normalize(value, min, max) {
  if (max === min) return 100;
  return ((value - min) / (max - min)) * 100;
}

const DEFAULT_PRICE_BUCKETS = [
  {
    label: '₹0 – ₹5k',
    min: 0,
    max: 5000,
    phones: [
      { name: 'Realme C12', price: 4999 },
      { name: 'Redmi A3', price: 4899 },
      { name: 'Moto E13', price: 4699 },
      { name: 'Infinix Smart 8', price: 4550 },
      { name: 'Tecno Spark Go', price: 4499 },
      { name: 'Samsung Galaxy M04', price: 4999 },
      { name: 'Nokia C30', price: 4990 },
      { name: 'Poco C50', price: 4999 },
      { name: 'Micromax In 1b', price: 4799 },
      { name: 'Itel A55', price: 3999 }
    ]
  },
  {
    label: '₹5k – ₹10k',
    min: 5000,
    max: 10000,
    phones: [
      { name: 'Redmi 12C', price: 6999 },
      { name: 'Moto G24', price: 7499 },
      { name: 'POCO C65', price: 8999 },
      { name: 'Realme Narzo N53', price: 9499 },
      { name: 'Samsung Galaxy M14', price: 9999 },
      { name: 'Infinix Hot 30', price: 8999 },
      { name: 'Vivo Y16', price: 8999 },
      { name: 'OnePlus Nord CE 4 Lite', price: 9999 },
      { name: 'Tecno Camon 20', price: 9499 },
      { name: 'iQOO Z9x', price: 9999 }
    ]
  },
  {
    label: '₹10k – ₹15k',
    min: 10000,
    max: 15000,
    phones: [
      { name: 'Redmi Note 13', price: 11999 },
      { name: 'Poco M6 Pro', price: 12999 },
      { name: 'Moto G85', price: 13999 },
      { name: 'Realme 12', price: 14999 },
      { name: 'Samsung Galaxy M35', price: 14999 },
      { name: 'Vivo T3x', price: 13999 },
      { name: 'Infinix GT 20 Pro', price: 14999 },
      { name: 'POCO X6 Neo', price: 14999 },
      { name: 'iQOO Z7', price: 13999 },
      { name: 'Redmi A4 Pro', price: 10999 }
    ]
  },
  {
    label: '₹15k – ₹20k',
    min: 15000,
    max: 20000,
    phones: [
      { name: 'Redmi Note 13 Pro', price: 17999 },
      { name: 'Samsung Galaxy M34', price: 19999 },
      { name: 'Moto G Stylus', price: 18999 },
      { name: 'Realme 11 Pro', price: 17999 },
      { name: 'OnePlus Nord CE4 Lite', price: 19999 },
      { name: 'Vivo V29e', price: 18999 },
      { name: 'Poco F5', price: 19999 },
      { name: 'iQOO Neo 9', price: 19999 },
      { name: 'Nothing Phone 2a', price: 17999 },
      { name: 'Honor X9b', price: 18999 }
    ]
  },
  {
    label: '₹20k – ₹25k',
    min: 20000,
    max: 25000,
    phones: [
      { name: 'OnePlus Nord 4', price: 24999 },
      { name: 'Samsung Galaxy F54', price: 22999 },
      { name: 'Realme 12 Pro+', price: 24999 },
      { name: 'Vivo V30e', price: 23999 },
      { name: 'Poco X7 Pro', price: 24999 },
      { name: 'Moto Edge 50', price: 21999 },
      { name: 'iQOO Z9', price: 22999 },
      { name: 'Redmi Note 14 Pro', price: 23999 },
      { name: 'Infinix Zero 40', price: 24999 },
      { name: 'Tecnno Phantom X', price: 21999 }
    ]
  },
  {
    label: '₹25k – ₹30k',
    min: 25000,
    max: 30000,
    phones: [
      { name: 'Samsung Galaxy S23 FE', price: 27999 },
      { name: 'OnePlus 12R', price: 29999 },
      { name: 'Realme GT 6', price: 28999 },
      { name: 'Poco F6', price: 27999 },
      { name: 'Moto Edge 50 Pro', price: 29999 },
      { name: 'Vivo V40', price: 29999 },
      { name: 'iQOO 12', price: 28999 },
      { name: 'Nothing Phone 2', price: 29999 },
      { name: 'Honor 200', price: 25999 },
      { name: 'Redmi K50i', price: 27999 }
    ]
  },
  {
    label: '₹30k – ₹40k',
    min: 30000,
    max: 40000,
    phones: [
      { name: 'OnePlus 11R', price: 34999 },
      { name: 'Samsung Galaxy S24', price: 39999 },
      { name: 'Google Pixel 8a', price: 37999 },
      { name: 'iPhone SE 2024', price: 34999 },
      { name: 'Vivo X100', price: 39999 },
      { name: 'POCO F6 Pro', price: 32999 },
      { name: 'Realme GT Neo 6', price: 35999 },
      { name: 'Moto Edge 50 Ultra', price: 39999 },
      { name: 'Nothing Phone 2a Plus', price: 34999 },
      { name: 'Honor Magic 6 Lite', price: 39999 }
    ]
  },
  {
    label: '₹40k – ₹50k',
    min: 40000,
    max: 50000,
    phones: [
      { name: 'Samsung Galaxy S24 Plus', price: 44999 },
      { name: 'OnePlus 12', price: 49999 },
      { name: 'Google Pixel 8', price: 48999 },
      { name: 'iPhone 13', price: 44999 },
      { name: 'Vivo X200', price: 49999 },
      { name: 'Xiaomi 14', price: 42999 },
      { name: 'Nothing Phone 3', price: 48999 },
      { name: 'Honor 200 Pro', price: 45999 },
      { name: 'Realme GT 7', price: 43999 },
      { name: 'OnePlus 11', price: 42999 }
    ]
  }
];

function filterPhonesByPrice(phones, minPrice, maxPrice) {
  const low = Number(minPrice) || 0;
  const high = Number(maxPrice) || Number.MAX_SAFE_INTEGER;

  return (phones || []).filter(phone => {
    const price = Number(phone.price);
    return price >= low && price <= high;
  });
}

function getPopularPhonesForRange(minPrice, maxPrice) {
  const low = Number(minPrice) || 0;
  const high = Number(maxPrice) || Number.MAX_SAFE_INTEGER;

  const matches = DEFAULT_PRICE_BUCKETS.flatMap(bucket => {
    const overlap = bucket.max >= low && bucket.min <= high;
    if (!overlap) return [];

    return bucket.phones.filter(phone => {
      const price = Number(phone.price);
      return price >= low && price <= high;
    });
  });

  return matches
    .sort((a, b) => a.price - b.price)
    .slice(0, 10);
}

/**
 * Calculates the min and max for each spec across all phones.
 * This is necessary so we can normalize each spec relative to the current database.
 */
function getRanges(phones) {
  const keys = ['antutu', 'ram', 'storage', 'battery', 'refreshRate', 'cameraMP'];
  const ranges = {};
  
  keys.forEach(key => {
    const values = phones.map(p => p[key]);
    ranges[key] = {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  });
  
  return ranges;
}

/**
 * Calculates the Value Score for a list of phones given specific weights.
 * The model rewards strong hardware and a good price point without over-penalizing
 * phones that are a little more expensive but clearly better overall.
 */
function calculateValueScores(phones, weights) {
  // Edge case: If there are no phones, we can't score anything.
  if (!phones || phones.length === 0) return [];

  const totalWeight = Number(weights.performance) + Number(weights.memory) + 
                      Number(weights.battery) + Number(weights.display) + 
                      Number(weights.camera);

  const ranges = getRanges(phones);
  const minPrice = Math.min(...phones.map(phone => Number(phone.price) || 0));
  const maxPrice = Math.max(...phones.map(phone => Number(phone.price) || 0));

  // Use map to create a shallow copy so we don't mutate the original documents directly
  // if they are Mongoose documents. (In reality, we should pass lean objects here).
  const scoredPhones = phones.map(phoneObj => {
    const phone = typeof phoneObj.toObject === 'function' ? phoneObj.toObject() : { ...phoneObj };

    const antutuNorm = normalize(phone.antutu, ranges.antutu.min, ranges.antutu.max);
    const ramNorm = normalize(phone.ram, ranges.ram.min, ranges.ram.max);
    const storageNorm = normalize(phone.storage, ranges.storage.min, ranges.storage.max);
    const batteryNorm = normalize(phone.battery, ranges.battery.min, ranges.battery.max);
    const refreshNorm = normalize(phone.refreshRate, ranges.refreshRate.min, ranges.refreshRate.max);
    const cameraNorm = normalize(phone.cameraMP, ranges.cameraMP.min, ranges.cameraMP.max);

    const memoryNorm = (ramNorm + storageNorm) / 2;

    let performanceScore = 0;
    if (totalWeight > 0) {
      performanceScore = (
        (antutuNorm * weights.performance) +
        (memoryNorm * weights.memory) +
        (batteryNorm * weights.battery) +
        (refreshNorm * weights.display) +
        (cameraNorm * weights.camera)
      ) / totalWeight;
    }

    const priceNorm = normalize(phone.price, minPrice, maxPrice);
    const priceAdvantage = 100 - priceNorm;
    const priceWeightedValue = performanceScore * (0.7 + (0.3 * priceAdvantage / 100));

    return {
      ...phone,
      performanceScore,
      rawValue: priceWeightedValue
    };
  });

  const rawValues = scoredPhones.map(p => p.rawValue);
  const minRaw = Math.min(...rawValues);
  const maxRaw = Math.max(...rawValues);

  scoredPhones.forEach(phone => {
    phone.valueScore = normalize(phone.rawValue, minRaw, maxRaw);
  });

  scoredPhones.sort((a, b) => b.valueScore - a.valueScore);

  return scoredPhones;
}

module.exports = {
  normalize,
  calculateValueScores,
  DEFAULT_PRICE_BUCKETS,
  getPopularPhonesForRange,
  filterPhonesByPrice
};
