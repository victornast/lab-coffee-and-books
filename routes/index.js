'use strict';

const { Router } = require('express');
const router = new Router();

const Place = require('./../models/place.model');

router.get('/', (req, res, next) => {
  Place.find()
    .then((places) => {
      res.render('index', { title: 'Coffee and books', places });
    })
    .catch((error) => next(error));
});

router.post('/', (req, res, next) => {
  const data = req.body;
  Place.create({
    name: data.name,
    type: data.type,
    location: { coordinates: [data.longitude, data.latitude] }
  })
    .then((createdPlace) => {
      console.log('Created:', createdPlace);
      res.redirect('/');
    })
    .catch((error) => {
      res.redirect('/places/create');
      next(error);
    });
});

module.exports = router;
