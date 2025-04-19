const { AppDataSource } = require('../config/database');
const Coordinator = require('../models/Coordinator');
const Disaster = require('../models/Disaster');
const Organization = require('../models/Organization');
const Team = require('../models/Team');
const socket = require('../socket/socket');
const ReportRepository = require('../repositories/reportRepository');
const config = require('../config/env');
const axios = require('axios');
const { 
    CoordinatorNotFoundError, 
    InvalidCoordinatorActionError, 
    OrganizationNotFoundError
 } = require('../utils/errors');

 const createDisaster = async (coordinatorId, disasterData) => {
  const coordinatorRepository = AppDataSource.getRepository(Coordinator);
  const coordinator = await coordinatorRepository.findOne({
    where: { user: { userId: coordinatorId } }
  });
  
  if (!coordinator) {
    throw new CoordinatorNotFoundError();
  }
  
  // Create a new disaster object with all the provided data
  const disasterRepository = AppDataSource.getRepository(Disaster);
  
  // Set default empty array if area is not provided
  if (!disasterData.area) {
    disasterData.area = [];
  }
  
  const newDisaster = disasterRepository.create({
    ...disasterData,
    coordinator: coordinator
  });
  
  const savedDisaster = await disasterRepository.save(newDisaster);
  
  
  const disasterWithoutCoordinator = (({ coordinator, ...rest }) => rest)(savedDisaster);
  
  let responseDisaster = { ...disasterWithoutCoordinator };
  
  if (responseDisaster.coordinates) {
    const [lat, lng] = responseDisaster.coordinates.split(',');
    responseDisaster.coordinates = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng)
    };
  }
  
  return responseDisaster;
};

// Retrieve disasters 
const getDisasters = async (offset, limit) => {
    const disasterRepository = AppDataSource.getRepository(Disaster);
    const [disasters, total] = await disasterRepository.findAndCount({
      relations: ['coordinator',  'coordinator.user'],
      skip: offset,
      take: limit,
    });
  
    const formattedDisasters = disasters.map(disaster => {
    
    const disasterWithoutCoordinator = (({ coordinator, ...rest }) => rest)(disaster);
      
    const coordinatorInfo = disaster.coordinator ? {
        coordinator_id: disaster.coordinator.coordinator_id,
        name: disaster.coordinator.user ? disaster.coordinator.user.name : null,
        officialContactNumber: disaster.coordinator.officialContactNumber,
        department: disaster.coordinator.department,
        region: disaster.coordinator.region,
      } : null;
  
      return {
        ...disasterWithoutCoordinator,
        coordinator: coordinatorInfo,
      };
    });
  
    return { total, disasters: formattedDisasters };
  };
  
  //Close a Disaster Event
  const closeDisaster = async (coordinatorId, disasterId) => {
    const disasterRepository = AppDataSource.getRepository(Disaster);
    
    const disaster = await disasterRepository.findOne({
      where: { disaster_id: disasterId },
      relations: ['coordinator', 'coordinator.user']
    });
  
    if (!disaster) {
      throw new Error('Disaster not found');
    }
  
    // Ensure the coordinator attempting the closure is the owner
    if (disaster.coordinator.user.userId !== coordinatorId) {
      throw new InvalidCoordinatorActionError('Coordinator not authorized to turn off this disaster.');
    }
    
    if (disaster.status === 'Closed') {
      throw new InvalidCoordinatorActionError('Disaster is already closed.');
    }
    
    // Update status and set endDate to now
    disaster.status = 'Closed';
    disaster.endDate = new Date();
  
    const updatedDisaster = await disasterRepository.save(disaster);
  
    const disasterWithoutCoordinator = (({ coordinator, ...rest }) => rest)(updatedDisaster);
    
    return disasterWithoutCoordinator;
  };


const approveOrganization = async (orgId,status) => {
  const organizationRepository = AppDataSource.getRepository(Organization);
  const organization = await organizationRepository.findOne({
    where: { organization_id: orgId }
  });
  if (!organization) {
    throw new OrganizationNotFoundError();
  }
  organization.approval_status = status;
  const updatedOrg = await organizationRepository.save(organization);
  return updatedOrg;
};

// Get all organizations
const getAllOrganizations = async (offset, limit) => {
  const organizationRepository = AppDataSource.getRepository(Organization);
  const [organizations, total] = await organizationRepository.findAndCount({
    skip: offset,
    take: limit,
  });
  
  return { total, organizations };
};


const getAllTeams = async (offset, limit) => {
  const teamRepository = AppDataSource.getRepository(Team);
  const [teams, total] = await teamRepository.findAndCount({
    relations: ['organization', 'disaster', 'members', 'members.user'],
    skip: offset,
    take: limit
  });
  const formattedTeams = teams.map(team => ({
    team_id: team.team_id,
    name: team.name,
    responsibility: team.responsibility,
    location: team.location,
    createdAt: team.createdAt,
    assignmentStatus: team.assignmentStatus,
    organization: team.organization,
    disaster: team.disaster,
    members: team.members.map(member => ({
      volunteer_id: member.volunteer_id,
      name: member.user ? member.user.name : null,
      email: member.user ? member.user.email : null,
      mobile: member.user ? member.user.mobile : null,
      skills: member.skills,
      work_location: member.work_location
    }))
  }));
  return { total, teams: formattedTeams };
};

// Assign a team to a disaster
const assignDisasterToTeam = async (teamId, disasterId, teamDetails = {}) => {
  const teamRepository = AppDataSource.getRepository(Team);
  const disasterRepository = AppDataSource.getRepository(Disaster);
  
  const team = await teamRepository.findOne({ where: { team_id: teamId } });
  if (!team) {
    throw new InvalidCoordinatorActionError('Team not found or already assigned.')
  }
  
  const disaster = await disasterRepository.findOne({ where: { disaster_id: disasterId } });
  if (!disaster) {
    throw new InvalidCoordinatorActionError('Disaster not found.');
  }
  
  team.disaster = disaster;
  team.assignmentStatus = 'assigned';

  if (teamDetails.location) {
    team.location = teamDetails.location;
  }
  
  if (teamDetails.responsibility) {
    team.responsibility = teamDetails.responsibility;
  }
  
  team.assignedAt = new Date();
  
  const updatedTeam = await teamRepository.save(team);
  return updatedTeam;
};

// Get disaster statistics 
// const getDisasterStats = async (disasterId) => {
//   return await ReportRepository.getDisasterStats(disasterId);
// };


const getDisasterStats = async (disasterId) => {
  
  try {
    const stats = await ReportRepository.getDisasterStats(disasterId);
    
    
    if (stats.totalReports > 0) {
      const totalRescued = stats.rescueShelter.totalRescued;
      if (totalRescued > 0) {
        stats.rescueShelter.percentages = {
          men: ((stats.rescueShelter.men / totalRescued) * 100).toFixed(1),
          women: ((stats.rescueShelter.women / totalRescued) * 100).toFixed(1),
          children: ((stats.rescueShelter.children / totalRescued) * 100).toFixed(1)
        };
      }
      
      stats.summary = {
        avgVolunteersPerDay: Math.round(stats.totalVolunteers / stats.totalReports),
        avgReliefItemsPerDay: Math.round(stats.reliefDistribution.totalItems / stats.totalReports),
        avgRescuedPerDay: Math.round(stats.rescueShelter.totalRescued / stats.totalReports)
      };
    }
    
    return stats;
  } catch (error) {
    console.error('Error getting disaster stats:', error);
    throw error;
  }
};

const getLocationKeyByCity = async (city) => {
  try {
    const response = await axios.get(`${config.weather.apiUrlForKey}`, {
      params: {
        q: city,
        apikey: config.weather.apiKey,
      }
    });

    if (response.data.length === 0) {
      throw new Error('City not found');
    }
    return response.data[0].Key;
  } catch (error) {
    throw new Error(`Error fetching location key: ${error.message}`);
  }
};


const getLocationInfoByKey = async (locationKey) => {
  try {
    const response = await axios.get(`${config.weather.apiUrlForInfo}/${locationKey}`, {
      params: {
        details: true,
        apikey: config.weather.apiKey,
      }
    });

    return response.data;  
  } catch (error) {
    throw new Error('Error fetching location info: ' + error.message);
  }
};

// Send an emergency notification to all users
const sendEmergencyNotification = async (subject, message) => {
  const userRepository = AppDataSource.getRepository('User');
  const users = await userRepository.find();
  const notificationRepository = AppDataSource.getRepository('Notification');
  const notifications = users.map(user =>
    notificationRepository.create({ subject, message, user })
  );
  await notificationRepository.save(notifications);
  const io = socket.getIo();
  io.emit('emergencyNotification', {
    subject,
    message,
    date: new Date().toISOString(),
  });
  return { message: 'Emergency notification sent to all users' };
};

module.exports = {
  createDisaster,
  getDisasters,
  closeDisaster,
  approveOrganization,
  getAllOrganizations,
  getAllTeams,
  assignDisasterToTeam,
  getDisasterStats,
  getLocationKeyByCity,
  getLocationInfoByKey,
  sendEmergencyNotification,
};
