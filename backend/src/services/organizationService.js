const { AppDataSource } = require('../config/database');
const Organization = require('../models/Organization');
const Volunteer = require('../models/Volunteer');
const VolunteerApplication = require('../models/VolunteerApplication');
const Team = require('../models/Team');
const DailyReport = require('../models/DailyReport');
const { VolunteerAlreadyInTeamError } = require('../utils/errors');

const updateApplicationStatus = async (applicationId, status) => {
  const applicationRepository = AppDataSource.getRepository(VolunteerApplication);
  const application = await applicationRepository.findOne({ 
    where: { application_id: applicationId },
    relations: ['volunteer', 'volunteer.user', 'organization']
  });

  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  application.status = status;
  const updatedApplication = await applicationRepository.save(application);

  if (status === 'approved') {
    const volunteerRepository = AppDataSource.getRepository(Volunteer);
    const volunteer = await volunteerRepository.findOne({
      where: { volunteer_id: application.volunteer.volunteer_id }
    });

    if (volunteer) {
      volunteer.organization = { organization_id: application.organization.organization_id };
      await volunteerRepository.save(volunteer);
    }
  }


  const responseData = {
    application_id: updatedApplication.application_id,
    status: updatedApplication.status,
    createdAt: updatedApplication.createdAt,
    volunteer: {
      name: application.volunteer.user.name, 
      mobile: application.volunteer.user.mobile, 
      skills: application.volunteer.skills,
      work_location: application.volunteer.work_location, 
    }
  };

  return responseData;
};


// Get all applications for the organization
const getOrganizationApplications = async (organizationId) => {
  const applicationRepository = AppDataSource.getRepository(VolunteerApplication);
  const applications = await applicationRepository.find({
    where: { organization: { organization_id: organizationId } },
    relations: ['volunteer', 'volunteer.user'] 
  });

  const result = applications.map(application => ({
    application_id: application.application_id,
    status: application.status,
    createdAt: application.createdAt,
    volunteer: {
      name: application.volunteer.user ? application.volunteer.user.name : null,
      mobile: application.volunteer.user ? application.volunteer.user.mobile : null,
      skills: application.volunteer.skills,
      work_location: application.volunteer.work_location,
    }
  }));

  return result;
};



const getOrganizationVolunteers = async (organizationId) => {
  const volunteerRepository = AppDataSource.getRepository(Volunteer);
  const volunteers = await volunteerRepository
    .createQueryBuilder('volunteer')
    .innerJoinAndSelect('volunteer.user', 'user')
    .leftJoinAndSelect('volunteer.teams', 'team')
    .innerJoinAndSelect('volunteer.volunteerApplications', 'application')
    .where('application.organizationOrganizationId = :organizationId', { organizationId })
    .andWhere('application.status = :status', { status: 'approved' })
    .getMany();

  const formattedVolunteers = volunteers.map(volunteer => ({
    volunteers: {
      memberId: volunteer.volunteer_id,
      name: volunteer.user.name, 
      mobile: volunteer.user.mobile,
      skills: volunteer.skills,
      work_location: volunteer.work_location, 
    },
    teams: volunteer.teams.map(team => ({
      team_id: team.team_id,
      name: team.name,
      responsibility: team.responsibility
    })),
    volunteerApplications: volunteer.volunteerApplications.map(application => ({
      application_id: application.application_id,
      status: application.status,
      createdAt: application.createdAt,
    }))
  }));

  return formattedVolunteers;
};



const createTeamWithMembers = async (organizationId, teamData) => {
  const { teamName, memberIds } = teamData;
  const teamRepository = AppDataSource.getRepository(Team);
  const volunteerRepository = AppDataSource.getRepository(Volunteer);

  const approvedVolunteers = await volunteerRepository
    .createQueryBuilder('volunteer')
    .innerJoinAndSelect('volunteer.user', 'user')
    .where('volunteer.volunteer_id IN (:...memberIds)', { memberIds })
    .getMany();

  if (approvedVolunteers.length === 0) {
    const error = new Error('No approved volunteers found for provided IDs');
    error.statusCode = 404;
    throw error;
  }

  const volunteersAlreadyInTeams = await volunteerRepository
    .createQueryBuilder('volunteer')
    .innerJoinAndSelect('volunteer.user', 'user')
    .leftJoinAndSelect('volunteer.teams', 'team')
    .where('volunteer.volunteer_id IN (:...memberIds)', { memberIds })
    .andWhere('team.team_id IS NOT NULL')
    .getMany();

  if (volunteersAlreadyInTeams.length > 0) {
    const conflictMessages = volunteersAlreadyInTeams.map(volunteer => {
      const team = volunteer.teams[0];
      return `${volunteer.user.name} is already in team "${team.name}" (ID: ${team.team_id})`;
    }).join('; ');
  
    throw new VolunteerAlreadyInTeamError(
      `The following volunteers are already assigned to a team: ${conflictMessages}`
    );
  }

  const newTeam = teamRepository.create({
    name: teamName,
    organization: { organization_id: organizationId },
    members: approvedVolunteers
  });

  const savedTeam = await teamRepository.save(newTeam);

  for (const volunteer of approvedVolunteers) {
    if (!volunteer.teams) {
      volunteer.teams = [];
    }
    volunteer.teams.push({
      team_id: savedTeam.team_id,
      name: savedTeam.name
    });
    await volunteerRepository.save(volunteer);
  }

  const formattedTeam = {
    team_id: savedTeam.team_id,
    name: savedTeam.name,
    organization: savedTeam.organization,
    members: savedTeam.members.map(volunteer => ({
      volunteer: {
        memberId: volunteer.volunteer_id,
        name: volunteer.user ? volunteer.user.name : 'Unknown',
        mobile: volunteer.user ? volunteer.user.mobile : 'Unknown',
        skills: volunteer.skills,
        work_location: volunteer.work_location
      }
    })),
    createdAt: savedTeam.createdAt,
    assignmentStatus: savedTeam.assignmentStatus
  };

  return formattedTeam;
};



// Get all teams associated with the organization
const getOrganizationTeams = async (organizationId) => {
  const teamRepository = AppDataSource.getRepository(Team);
  
  const teams = await teamRepository.find({
    where: { organization: { organization_id: organizationId } },
    relations: ['members', 'members.user']
  });

  const formattedTeams = teams.map(team => ({
    team_id: team.team_id,
    name: team.name,
    createdAt: team.createdAt,
    assignedAt: team.assignedAt,
    assignmentStatus: team.assignmentStatus,
    members: team.members.map(volunteer => ({
      volunteer: {
        name: volunteer.user.name, 
        mobile: volunteer.user.mobile,
        skills: volunteer.skills, 
        work_location: volunteer.work_location 
      }
    }))
  }));

  return formattedTeams;
};



// Submit a daily report for a disaster by the organization
const submitDailyReport = async (organizationId, disasterId, reportData) => {
  const reportRepository = AppDataSource.getRepository(DailyReport);
  const { 
    description, 
    volunteersCount,
    
    // Relief distribution items
    waterFiltrationTablets,
    rice,
    flattenedRice,
    puffedRice,
    potato,
    onion,
    sugar,
    oil,
    salt,
    candles,
    
    // Rescue/shelter data
    rescuedMen,
    rescuedWomen,
    rescuedChildren,
    
    // Medical aid data
    saline,
    paracetamol,
    bandages,
    sanitaryPads 
  } = reportData;
  
  const itemsDistributed = 
    (waterFiltrationTablets || 0) +
    (rice || 0) + 
    (flattenedRice || 0) + 
    (puffedRice || 0) + 
    (potato || 0) + 
    (onion || 0) + 
    (sugar || 0) + 
    (oil || 0) + 
    (salt || 0) + 
    (candles || 0) +
    (saline || 0) + 
    (paracetamol || 0) + 
    (bandages || 0) + 
    (sanitaryPads || 0);
  
  const newReport = reportRepository.create({
    organization: { organization_id: organizationId },
    disaster: { disaster_id: disasterId },
    description,
    volunteersCount,
    itemsDistributed,
    
    // Relief distribution items
    waterFiltrationTablets,
    rice,
    flattenedRice,
    puffedRice,
    potato,
    onion,
    sugar,
    oil,
    salt,
    candles,
    
    // Rescue/shelter data
    rescuedMen,
    rescuedWomen,
    rescuedChildren,
    
    // Medical aid data
    saline,
    paracetamol,
    bandages,
    sanitaryPads
  });

  const savedReport = await reportRepository.save(newReport);

  const formattedReport = {
    description: savedReport.description,
    volunteersCount: savedReport.volunteersCount,
    date: savedReport.date,
    createdAt: savedReport.createdAt,
    
    reliefDistribution: {
      waterFiltrationTablets: savedReport.waterFiltrationTablets,
      rice: savedReport.rice,
      flattenedRice: savedReport.flattenedRice,
      puffedRice: savedReport.puffedRice,
      potato: savedReport.potato,
      onion: savedReport.onion,
      sugar: savedReport.sugar,
      oil: savedReport.oil,
      salt: savedReport.salt,
      candles: savedReport.candles,
      totalItems: savedReport.itemsDistributed
    },
    
    rescueShelter: {
      men: savedReport.rescuedMen,
      women: savedReport.rescuedWomen,
      children: savedReport.rescuedChildren,
      totalRescued: (savedReport.rescuedMen || 0) + 
                    (savedReport.rescuedWomen || 0) + 
                    (savedReport.rescuedChildren || 0)
    },
    
    medicalAid: {
      saline: savedReport.saline,
      paracetamol: savedReport.paracetamol,
      bandages: savedReport.bandages,
      sanitaryPads: savedReport.sanitaryPads
    }
  };

  return formattedReport;
};


module.exports = {
  updateApplicationStatus,
  getOrganizationApplications,
  getOrganizationVolunteers,
  createTeamWithMembers,
  getOrganizationTeams,
  submitDailyReport,
};
