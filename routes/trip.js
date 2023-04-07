const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");

const Trip = require("../models/Trip");

// ------------- ROUTE GET ALL TRIP -----------------

router.get("/user/trip/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;

    const tripCount = await Trip.countDocuments({ owner: userId });
    console.log("userId ===>", userId);
    console.log("Nombre de voyages pour cet utilisateur :", tripCount);

    const trip = await Trip.find({ owner: userId }).populate({
      path: "owner",
      select: "account",
    });

    res.status(200).json({ trip: trip });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------- ROUTE GET TRIP -----------------A FAIRE

router.get("/user/trip/:id", isAuthenticated, async (req, res) => {
  try {
    if (req.params.id) {
      const userId = req.params.id;
      const trip = await Trip.findById(userId).populate({
        path: "owner",
        select: "account",
      });

      res.json(trip);
    } else {
      res.status(400).json({ message: "Trip not founded" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------- ROUTE CREATE -----------------

router.post("/user/trip/create_trip", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("userId ===>", userId);

    let newTrip = new Trip({
      owner: userId,
      tripId: req.fields.tripId,
      localisation: req.fields.localisation,
      event: req.fields.event,
      date: req.fields.date,
    });

    await newTrip.save();

    // Récupérer les informations du voyageur propriétaire
    const populatedTrip = await Trip.findById(newTrip._id).populate(
      "owner",
      "account"
    );

    res.json(populatedTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ------------- ROUTE UPDATE -----------------

router.post("user/trip/update_trip", async (req, res) => {
  try {
    if ((req.fields.id, req.fields.localisation)) {
      const trip = await Trip.findById(req.fields.id).populate({
        path: "owner",
        select: "account",
      });

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
