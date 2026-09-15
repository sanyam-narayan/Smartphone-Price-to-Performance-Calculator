const test = require('node:test');
const assert = require('node:assert');
const { normalize, calculateValueScores } = require('../scoring');

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
});
