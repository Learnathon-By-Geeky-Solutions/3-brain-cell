const jwt = require("jsonwebtoken");
const { AppDataSource } = require('../config/database');
const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Organization = require('../models/Organization');
const Coordinator = require('../models/Coordinator');

const completeRegistration = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Unauthorized: Token missing" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; 
        const jwtRole = decoded.role;

        const { ...profileData } = req.body;

        const userRepository = AppDataSource.getRepository(User);
        
        const user = await userRepository.findOne({ where: { userId } });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role !== jwtRole) {
            user.role = jwtRole;
            await userRepository.save(user);
        }

        if (!user.role) return res.status(404).json({ message: "Role not assigned during registration" });

        if (user.role === "volunteer") {
            const volunteerRepository = AppDataSource.getRepository(Volunteer);
            const volunteer = volunteerRepository.create({
                user: user,
                skills: profileData.skills,
                work_location: profileData.location,
            });
            await volunteerRepository.save(volunteer);

        } else if (user.role === "organization") {
            const organizationRepository = AppDataSource.getRepository(Organization);
            const organization = organizationRepository.create({
                user: user,
                organization_name: profileData.organization_name,
                type: profileData.type,
                sector: profileData.sector,
                documentLink: profileData.documentLink,
                regNo: profileData.regNo,
                establishedDate: profileData.establishedDate,
                mission: profileData.mission,
                secondaryContactName: profileData.secondaryContactName,
                secondaryContactTitle: profileData.secondaryContactTitle,
                secondaryContactMail: profileData.secondaryContactMail,
                location: profileData.location,
                website: profileData.website,
                socialMediaLink: profileData.socialMediaLink,
                parentOrg: profileData.parentOrg,
                approval_status: profileData.approval_status,
            });
            await organizationRepository.save(organization);

        } else if (user.role === "coordinator") {
            const coordinatorRepository = AppDataSource.getRepository(Coordinator);
            const coordinator = coordinatorRepository.create({
                user: user,
                department: profileData.department,
                region: profileData.region,
                officialContactNumber: profileData.officialContactNumber,
                roleTitle: profileData.roleTitle,
                experience: profileData.experience,
                certifications: profileData.certifications,
                bio: profileData.bio,
            });

            await coordinatorRepository.save(coordinator);

        } else {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { completeRegistration };