const test = require('node:test');
const assert = require('node:assert');
const { normalize, calculateValueScores, DEFAULT_PRICE_BUCKETS, getPopularPhonesForRange, filterPhonesByPrice } = require('../scoring');

test('normalize', (t) => {
  t.test('should correctly normalize values', () => {
    assert.strictEqual(normalize(5, 0, 10), 50);
    assert.strictEqual(normalize(10, 0, 10), 100);
    assert.strictEqual(normalize(0, 0, 10), 0);
  });

  t.test('should return 100 when min and max are equal', () => {
    assert.strictEqual(normalize(5, 5, 5), 100);
  });
});

test('calculateValueScores', (t) => {
  const cheapHighSpec = {
    name: "Cheap High Spec",
    price: 10000,
    antutu: 500000,
    ram: 8,
    storage: 128,
    battery: 6000,
    refreshRate: 120,
    cameraMP: 50
  };

  const expensiveLowSpec = {
    name: "Expensive Low Spec",
    price: 30000,
    antutu: 200000,
    ram: 4,
    storage: 64,
    battery: 4000,
    refreshRate: 60,
    cameraMP: 12
  };

  const identicalPrice1 = {
    ...cheapHighSpec,
    name: "Identical 1",
    price: 15000
  };

  const identicalPrice2 = {
    ...expensiveLowSpec,
    name: "Identical 2",
    price: 15000
  };

  const defaultWeights = {
    performance: 30,
    memory: 15,
    battery: 20,
    display: 15,
    camera: 20
  };

  t.test('should rank cheap high-spec phone above expensive low-spec phone', () => {
    const phones = [expensiveLowSpec, cheapHighSpec];
    const ranked = calculateValueScores(phones, defaultWeights);
    
    assert.strictEqual(ranked.length, 2);
    assert.strictEqual(ranked[0].name, "Cheap High Spec");
    assert.strictEqual(ranked[1].name, "Expensive Low Spec");
    
    // The cheap high spec should be 100, the other 0 since there's only 2
    assert.strictEqual(ranked[0].valueScore, 100);
    assert.strictEqual(ranked[1].valueScore, 0);
  });

  t.test('should handle empty phone list', () => {
    const ranked = calculateValueScores([], defaultWeights);
    assert.deepStrictEqual(ranked, []);
  });

  t.test('should handle all weights being 0', () => {
    const phones = [cheapHighSpec, expensiveLowSpec];
    const zeroWeights = { performance: 0, memory: 0, battery: 0, display: 0, camera: 0 };
    const ranked = calculateValueScores(phones, zeroWeights);
    
    assert.strictEqual(ranked.length, 2);
    // Since performance score is 0 for both, raw value is 0. 
    // Normalizing 0 with min 0 and max 0 gives 100.
    // They both should have valueScore 100.
    assert.strictEqual(ranked[0].valueScore, 100);
    assert.strictEqual(ranked[1].valueScore, 100);
  });

  t.test('should handle identical prices', () => {
    const phones = [identicalPrice1, identicalPrice2];
    const ranked = calculateValueScores(phones, defaultWeights);
    
    // Identical 1 has better specs, so it should rank higher despite same price
    assert.strictEqual(ranked[0].name, "Identical 1");
  });

  t.test('should provide sensible default price buckets with ten phones each', () => {
    assert.ok(Array.isArray(DEFAULT_PRICE_BUCKETS));
    assert.ok(DEFAULT_PRICE_BUCKETS.length >= 5);
    assert.ok(DEFAULT_PRICE_BUCKETS.every(bucket => Array.isArray(bucket.phones) && bucket.phones.length >= 10));
    assert.strictEqual(DEFAULT_PRICE_BUCKETS[0].label, '₹0 – ₹5k');
  });

  t.test('should return a matching list for a custom price window', () => {
    const phones = getPopularPhonesForRange(10000, 25000);
    assert.ok(Array.isArray(phones));
    assert.ok(phones.length >= 10);
    assert.ok(phones.every(phone => phone.price >= 10000 && phone.price <= 25000));
  });

  t.test('should filter phones by the selected price range before ranking', () => {
    const phones = [
      { name: 'Cheap', price: 5000, antutu: 100000, ram: 4, storage: 64, battery: 4000, refreshRate: 60, cameraMP: 12 },
      { name: 'Mid', price: 15000, antutu: 200000, ram: 6, storage: 128, battery: 5000, refreshRate: 90, cameraMP: 24 },
      { name: 'Expensive', price: 40000, antutu: 350000, ram: 8, storage: 256, battery: 6000, refreshRate: 120, cameraMP: 48 }
    ];

    const filtered = filterPhonesByPrice(phones, 7000, 20000);
    assert.deepStrictEqual(filtered.map(phone => phone.name), ['Mid']);
  });
});
