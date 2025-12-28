const express = require('express');
const router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

router.get('/nearby-bars', async (req, res) => {
  try {
    console.log('Received request for nearby bars:', req.query);
    const { lat, lng, radius = 1000 } = req.query;

    if (!lat || !lng) {
      console.log('Missing coordinates');
      return res.status(400).json({ message: 'נדרשים קווי אורך ורוחב' });
    }

    console.log('Searching for bars with params:', {
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radius: parseInt(radius)
    });

    const response = await client.placesNearby({
      params: {
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radius: parseInt(radius),
        type: 'bar',
        key: process.env.GOOGLE_MAPS_API_KEY,
        language: 'he'
      }
    });

    console.log('Found bars:', response.data.results.length);
    res.json(response.data.results);
  } catch (error) {
    console.error('Error fetching nearby bars:', error);
    res.status(500).json({ 
      message: 'שגיאה בחיפוש ברים סמוכים',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router; 