const Organization = require('../models/Organization');


const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching organizations" });
  }
};


const createOrganization = async (req, res) => {
  try {
    const { name, location } = req.body;
    const organization = Organization.create({ name, location });
    await organization.save();
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ message: "Error creating organization" });
  }
};

module.exports = { getOrganizations, createOrganization };
