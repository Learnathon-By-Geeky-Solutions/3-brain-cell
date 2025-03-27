import VolunteerDetails from "./VolunteerDetails";
import OrganizationDetails from "./OrganizationDetails";

const RoleDetails = ({ formData, setFormData, handleChange, handleNext }) => {
  // if the role is visitor, redirect to home page cz 3rd step is not needed
    if(formData.role === "visitor") {
        window.location.href = "/";
        return null;
    }
    return (
        <>
          {formData.role === "volunteer" && <VolunteerDetails formData={formData} handleChange={handleChange} handleNext={handleNext} />}
          {formData.role === "organization" && <OrganizationDetails formData={formData} setFormData={setFormData} handleChange={handleChange} handleNext={handleNext} />}
        </>
      );
}

export default RoleDetails;