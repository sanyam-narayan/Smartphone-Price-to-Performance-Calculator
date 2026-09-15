const express = require('express');
const router = express.Router();
const Phone = require('../models/Phone');
const { calculateValueScores, DEFAULT_PRICE_BUCKETS, getPopularPhonesForRange } = require('../scoring');

const DEFAULT_WEIGHTS = {
  performance: 30,
  memory: 15,
  battery: 20,
  display: 15,
  camera: 20
};

// GET / - Renders the dashboard
router.get('/', async (req, res) => {
  try {
    const minPrice = Number(req.query.min) || 0;
    const maxPrice = Number(req.query.max) || 50000;
    const phones = await Phone.find({}).lean();
    const rankedPhones = calculateValueScores(phones, DEFAULT_WEIGHTS);
    const popularPhones = getPopularPhonesForRange(minPrice, maxPrice);

    res.render('index', {
      phones: rankedPhones,
      weights: DEFAULT_WEIGHTS,
      defaultPriceBuckets: DEFAULT_PRICE_BUCKETS,
      priceRange: { min: minPrice, max: maxPrice },
      popularPhones,
      rangeLabel: `₹${Math.round(minPrice / 1000)}k – ₹${Math.round(maxPrice / 1000)}k`
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET /api/phones - JSON endpoint for dynamically re-ranking on the frontend
router.get('/api/phones', async (req, res) => {
  try {
    const weights = {
      performance: Number(req.query.performance) || 0,
      memory: Number(req.query.memory) || 0,
      battery: Number(req.query.battery) || 0,
      display: Number(req.query.display) || 0,
      camera: Number(req.query.camera) || 0
    };

    const phones = await Phone.find({}).lean();
    const rankedPhones = calculateValueScores(phones, weights);
    res.json(rankedPhones);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// GET /add - Renders the form to add a new phone
router.get('/add', (req, res) => {
  res.render('add');
});

// POST /add - Handles adding a new phone
router.post('/add', async (req, res) => {
  try {
    const newPhone = new Phone({
      name: req.body.name,
      price: Number(req.body.price),
      antutu: Number(req.body.antutu),
      ram: Number(req.body.ram),
      storage: Number(req.body.storage),
      battery: Number(req.body.battery),
      refreshRate: Number(req.body.refreshRate),
      cameraMP: Number(req.body.cameraMP)
    });
    
    await newPhone.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(400).send('Bad Request. Make sure all fields are filled properly.');
  }
});

module.exports = router;
