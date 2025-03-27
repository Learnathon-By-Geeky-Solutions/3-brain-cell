import { useState } from "react";
import { validateSkills } from "../../shared/components/InputValidation";
import { registerCompletion } from "../data/registerCompletion";

const VolunteerDetails = ({ formData, handleChange, handleNext }) => {
  const [errors, setErrors] = useState({});

  const addSkill = (e) => {
    const newSkill = e.target.value;
    if (newSkill && !formData.skills.includes(newSkill)) {
      handleChange({
        target: {
          name: "skills",
          value: [...formData.skills, newSkill],
        },
      });

      // Clear error when skills are added
      if (errors.skills) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.skills;
          return newErrors;
        });
      }
    }
    // Reset select to initial placeholder
    e.target.value = "";
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter(
      (skill) => skill !== skillToRemove
    );
    handleChange({
      target: {
        name: "skills",
        value: updatedSkills,
      },
    });

    // Validate skills after removal
    if (updatedSkills.length === 0) {
      setErrors((prev) => ({
        ...prev,
        skills: "Please select at least one skill",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const skillsError = validateSkills(formData.skills);
    if (skillsError) {
      newErrors.skills = skillsError.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const response = await registerCompletion(formData);
      if (response.status) {
        window.location.href = "/dashboard/volunteer";
      } else {
        setErrors((prev) => ({
          ...prev,
          form: response.message,
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        form: "An error occurred during submission",
      }));
      console.error("Error during submission:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{errors.form}</span>
        </div>
      )}

      <label htmlFor="skills" className="block mb-2">
        Skills
      </label>
      <select
        id="skills"
        name="skills"
        onChange={addSkill}
        className={`p-2 border rounded w-full mb-4 ${
          errors.skills ? "border-red-500" : "border-gray-300"
        }`}
        defaultValue=""
      >
        <option value="" disabled>
          Select a skill
        </option>
        <option value="first_aid">First Aid</option>
        <option value="water_rescue">Fire Rescue</option>
        <option value="search_and_rescue">Search and Rescue</option>
        <option value="logistics">Logistics</option>
        <option value="food_distribution">Food Distribution</option>
      </select>
      {errors.skills && (
        <p className="text-red-500 text-xs mb-4">{errors.skills}</p>
      )}

      <div className="mb-4">
        {formData.skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center bg-gray-200 rounded px-2 py-1 mr-2 mb-2"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1 text-red-500 cursor-pointer"
            >
              &#x2715;
            </button>
          </span>
        ))}
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer">
          Submit
        </button>
      </div>
    </form>
  );
};

export default VolunteerDetails;
