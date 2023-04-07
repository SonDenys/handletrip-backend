const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const Trip = require("../models/Trip");

// ------------- ROUTE GET TRIP -----------------

router.get("user/trip/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const trip = await Trip.find({ owner: userId }).populate({
      path: "owner",
      select: "account",
    });

    console.log(trip, "helldqdzo");
    res.status(200).json({ trip: trip });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------- ROUTE CREATE -----------------

router.post("/user/trip/create_trip", isAuthenticated, async (req, res) => {
  try {
    const newTrip = new Trip({
      owner: req.fields.userId,
      tripId: req.fields.tripId,
      localisation: req.fields.localisation,
      event: req.fields.event,
      date: req.fields.date,
    });

    await newTrip.save();

    res.json({
      owner: req.fields.userId,
      tripId: req.fields.tripId,
      localisation: req.fields.localisation,
      event: req.fields.event,
      date: req.fields.date,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------- ROUTE UPDATE -----------------

router.post("user/trip/update_trip", async (req, res) => {
  try {
    if ((req.fields.id, req.fields.localisation)) {
      const trip = await Trip.findById(req.fields.id);

      trip.localisation = req.fields.localisation;
      trip.event = req.fields.event;
      trip.date = req.fields.date;

      await trip.save();
      res.json(trip);
    } else {
      res.status(400).json({ message: "Missing Paramater" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
