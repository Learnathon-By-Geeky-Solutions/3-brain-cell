import { useState } from "react";
import {
  validateDate,
  validateEmail,
  validateOrganizationType,
  validateRegNo,
  validateSocialMedia,
  validateText,
  validateWebsite,
} from "../../shared/components/InputValidation";
import ImportShared from "../../shared/ImportShared";
import { registerCompletion } from "../data/registerCompletion";

const { Input, Selection } = ImportShared;

const OrganizationDetails = () => {
  const [formData, setFormData] = useState({
    organization_name: "",
    type: "",
    sector: [],
    secondaryContactName: "",
    secondaryContactTitle: "",
    secondaryContactMail: "",
    location: "",
    website: "",
    socialMediaLink: "",
    parentOrg: "",
    documentLink: "",
    regNo: "",
    establishedDate: "",
    mission: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const nameError = validateText(formData.organization_name, true);
    if (nameError) newErrors.organization_name = nameError.message;

    const typeError = validateOrganizationType(formData.type);
    if (typeError) newErrors.type = typeError.message;

    if (!formData.sector || formData.sector.length === 0) {
      newErrors.sector = "Please select at least one sector";
    }

    const locationError = validateText(formData.location, true);
    if (locationError) newErrors.location = locationError.message;

    const contactNameError = validateText(formData.secondaryContactName, true);
    if (contactNameError)
      newErrors.secondaryContactName = contactNameError.message;

    const contactTitleError = validateText(
      formData.secondaryContactTitle,
      true
    );
    if (contactTitleError)
      newErrors.secondaryContactTitle = contactTitleError.message;

    const contactMailError = validateEmail(formData.secondaryContactMail, true);
    if (contactMailError)
      newErrors.secondaryContactMail = contactMailError.message;

    const websiteError = validateWebsite(formData.website);
    if (websiteError) newErrors.website = websiteError.message;

    const socialMediaError = validateSocialMedia(formData.socialMediaLink);
    if (socialMediaError) newErrors.socialMediaLink = socialMediaError.message;

    const regNoError = validateRegNo(formData.regNo);
    if (regNoError) newErrors.regNo = regNoError.message;

    const dateError = validateDate(formData.establishedDate, true);
    if (dateError) newErrors.establishedDate = dateError.message;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await registerCompletion(formData);
      if (response.status) {
        window.location.href = "/dashboard/organization";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing again
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = null;

    switch (name) {
      case "organization_name":
        error = validateText(value, true);
        break;
      case "type":
        error = validateOrganizationType(value);
        break;
      case "location":
        error = validateText(value, true);
        break;
      case "secondaryContactName":
        error = validateText(value, true);
        break;
      case "secondaryContactTitle":
        error = validateText(value, true);
        break;
      case "secondaryContactMail":
        error = validateEmail(value, true);
        break;
      case "website":
        error = validateWebsite(value);
        break;
      case "socialMediaLink":
        error = validateSocialMedia(value);
        break;
      case "regNo":
        error = validateRegNo(value);
        break;
      case "establishedDate":
        error = validateDate(value, true);
        break;
      default:
        break;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error.message }));
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <h3 className="text-xl font-semibold mb-4 text-center">
        Organization Details
      </h3>

      {errors.form && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">{errors.form}</span>
        </div>
      )}

      <Input
        setting={{
          name: "organization_name",
          label: "Organization Name",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.organization_name}
      />
      <div className="mb-4 w-100">
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full py-2 px-3 border ${
            errors.type ? "border-red-500" : "border-gray-300"
          } bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        >
          <option value="">Select Organization Type</option>
          <option value="Non-Profit">Non-Profit</option>
          <option value="NGO">NGO</option>
          <option value="Government">Government</option>
          <option value="Social Welfare">Social Welfare</option>
          <option value="Corporate">Corporate</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-xs mt-1">{errors.type}</p>
        )}
      </div>
      <Selection
        setting={{
          name: "sector",
          label: "Sector",
          width: "w-100",
        }}
        options={[
          "Health",
          "Education",
          "Awareness",
          "Social Wellfare",
          "Environment",
          "Human Rights",
        ]}
        formData={formData}
        setFormData={setFormData}
        error={errors.sector}
      />
      <Input
        setting={{
          name: "location",
          label: "Office Location",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.location}
      />
      <Input
        setting={{
          name: "secondaryContactName",
          label: "Contact Person Name",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.secondaryContactName}
      />
      <Input
        setting={{
          name: "secondaryContactTitle",
          label: "Position in Organization",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.secondaryContactTitle}
      />
      <Input
        setting={{
          name: "secondaryContactMail",
          label: "Mail Address",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.secondaryContactMail}
      />
      <Input
        setting={{
          name: "website",
          label: "Official Website",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.website}
      />
      <Input
        setting={{
          name: "socialMediaLink",
          label: "Social Media Link",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.socialMediaLink}
      />
      <Input
        setting={{
          name: "parentOrg",
          label: "Parent Organization",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
      />
      <Input
        setting={{
          name: "regNo",
          label: "Govt Registration Number",
          width: "w-100",
          type: "number",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.regNo}
      />
      <Input
        setting={{
          name: "documentLink",
          label: "Provide Registration Document Link",
          width: "w-100",
          type: "text",
        }}
        handleChange={handleChange}
        formData={formData}
      />
      <Input
        setting={{
          name: "establishedDate",
          label: "Established Date",
          width: "w-100",
          type: "date",
        }}
        handleChange={handleChange}
        formData={formData}
        error={errors.establishedDate}
      />
      <div className="flex flex-col mb-4">
        <label htmlFor="mission">Mission of the Organization</label>
        <textarea
          name="mission"
          id="mission"
          cols="50"
          rows="3"
          className={`resize-none border p-3 my-5 ${
            errors.mission ? "border-red-500" : "border-gray-300"
          }`}
          onChange={handleChange}
        ></textarea>
        {errors.mission && (
          <p className="text-red-500 text-xs mt-1">{errors.mission}</p>
        )}
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-amber-500 text-black px-5 py-2 rounded cursor-pointer hover:bg-amber-600 hover:-translate-y-1"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default OrganizationDetails;
