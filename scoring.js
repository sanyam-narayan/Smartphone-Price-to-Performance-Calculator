/**
 * Normalizes a value to a 0-100 scale based on the minimum and maximum values in a dataset.
 * If all values are the same (max === min), it returns 100 to avoid division by zero.
 */
function normalize(value, min, max) {
  if (max === min) return 100;
  return ((value - min) / (max - min)) * 100;
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
 * It normalizes specs, calculates a Performance Score, divides by price to get raw value,
 * and finally normalizes that raw value to get a 0-100 Value Score.
 */
function calculateValueScores(phones, weights) {
  // Edge case: If there are no phones, we can't score anything.
  if (!phones || phones.length === 0) return [];

  // Edge case: If all weights are 0, every phone has a 0 performance score.
  // We handle division by zero below.
  const totalWeight = Number(weights.performance) + Number(weights.memory) + 
                      Number(weights.battery) + Number(weights.display) + 
                      Number(weights.camera);

  const ranges = getRanges(phones);

  // Use map to create a shallow copy so we don't mutate the original documents directly
  // if they are Mongoose documents. (In reality, we should pass lean objects here).
  const scoredPhones = phones.map(phoneObj => {
    // If it's a mongoose document, it might have a toObject() method
    const phone = typeof phoneObj.toObject === 'function' ? phoneObj.toObject() : { ...phoneObj };

    // 1. Normalize each spec to 0-100
    const antutuNorm = normalize(phone.antutu, ranges.antutu.min, ranges.antutu.max);
    const ramNorm = normalize(phone.ram, ranges.ram.min, ranges.ram.max);
    const storageNorm = normalize(phone.storage, ranges.storage.min, ranges.storage.max);
    const batteryNorm = normalize(phone.battery, ranges.battery.min, ranges.battery.max);
    const refreshNorm = normalize(phone.refreshRate, ranges.refreshRate.min, ranges.refreshRate.max);
    const cameraNorm = normalize(phone.cameraMP, ranges.cameraMP.min, ranges.cameraMP.max);

    // Memory is the average of normalized RAM and storage
    const memoryNorm = (ramNorm + storageNorm) / 2;

    // 2. Combine into a Performance Score using weights
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

    // 3. Divide by price for raw value-for-money
    // Handle edge case where price is 0 (unlikely but possible), avoid Infinity
    const rawValue = phone.price > 0 ? (performanceScore / phone.price) : 0;

    return {
      ...phone,
      performanceScore,
      rawValue
    };
  });

  // 4. Min-max normalize the rawValue to get final Value Score (0-100)
  const rawValues = scoredPhones.map(p => p.rawValue);
  const minRaw = Math.min(...rawValues);
  const maxRaw = Math.max(...rawValues);

  scoredPhones.forEach(phone => {
    // Round to 1 decimal place or just keep as float. 
    // We will keep as float for precision, formatting can happen on UI.
    phone.valueScore = normalize(phone.rawValue, minRaw, maxRaw);
  });

  // 5. Sort phones by Value Score, descending
  scoredPhones.sort((a, b) => b.valueScore - a.valueScore);

  return scoredPhones;
}

module.exports = {
  normalize,
  calculateValueScores
};
