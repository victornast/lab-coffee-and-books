'use strict';

const { Router } = require('express');
const router = new Router();

const Place = require('./../models/place.model');

router.get('/create', (req, res, next) => {
  res.render('places/create');
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  Place.findById(id)
    .then((place) => {
      res.render('places/detail', { place });
    })
    .catch((error) => next(error));
});

router.post('/:id', (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  Place.findByIdAndUpdate(
    id,
    {
      name: data.name,
      type: data.type,
      location: { coordinates: [data.longitude, data.latitude] }
    },
    { useFindAndModify: false }
  )
    .then(() => res.redirect(`/places/${id}`))
    .catch((error) => next(error));
});

router.get('/:id/edit', (req, res, next) => {
  const id = req.params.id;
  Place.findById(id)
    .then((place) => {
      switch (place.type) {
        case 'coffee_shop':
          place.isCoffee = 'true';
          break;
        case 'bookstore':
          place.isBook = 'true';
          break;
      }
      res.render('places/edit', { place });
    })
    .catch((error) => next(error));
});

router.post('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Place.findByIdAndDelete(id)
    .then(() => res.redirect('/'))
    .catch((error) => next(error));
});

module.exports = router;
