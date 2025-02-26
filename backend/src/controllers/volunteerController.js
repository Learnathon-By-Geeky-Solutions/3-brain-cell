const Volunteer = require('../models/Volunteer');

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching volunteers" });
  }
};


const createVolunteer = async (req, res) => {
  try {
    const { skills, work_location } = req.body;
    const volunteer = Volunteer.create({ skills, work_location });
    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ message: "Error creating volunteer" });
  }
};

module.exports = { getVolunteers, createVolunteer };
