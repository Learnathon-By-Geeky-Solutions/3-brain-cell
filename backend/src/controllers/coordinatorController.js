const Coordinator = require('../models/Coordinator');


const getCoordinators = async (req, res) => {
  try {
    const coordinators = await Coordinator.find();
    res.json(coordinators);
  } catch (error) {
    res.status(500).json({ message: "Error fetching coordinators" });
  }
};


const createCoordinator = async (req, res) => {
  try {
    const { department } = req.body;
    const coordinator = Coordinator.create({ department });
    await coordinator.save();
    res.status(201).json(coordinator);
  } catch (error) {
    res.status(500).json({ message: "Error creating coordinator" });
  }
};

module.exports = { getCoordinators, createCoordinator };
