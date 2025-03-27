import Input from "../../shared/components/Input";
import {
  validateConfirmPassword,
  validateEmail,
  validateLocation,
  validateMobile,
  validatePassword,
  validateRole,
  validateText,
} from "../../shared/components/InputValidation";

const PersonalDetails = ({
  userData,
  handleChange,
  handleRegister,
  setFormErrors,
  formErrors,
}) => {
  const validateForm = () => {
    const errors = {};

    const nameError = validateText(userData.name);
    if (nameError) errors.name = nameError.message;

    const emailError = validateEmail(userData.email);
    if (emailError) errors.email = emailError.message;

    const mobileError = validateMobile(userData.mobile);
    if (mobileError) errors.mobile = mobileError.message;

    const passwordError = validatePassword(userData.password);
    if (passwordError) errors.password = passwordError.message;

    const confirmPasswordError = validateConfirmPassword(
      userData.password,
      userData.confirmPassword
    );
    if (confirmPasswordError)
      errors.confirmPassword = confirmPasswordError.message;

    const locationError = validateLocation(userData.location);
    if (locationError) errors.location = locationError.message;

    const roleError = validateRole(userData.role);
    if (roleError) errors.role = roleError.message;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      handleRegister();
    }
  };

  // Validate on field blur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = null;

    switch (name) {
      case "name":
        error = validateText(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "mobile":
        error = validateMobile(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(userData.password, value);
        break;
      case "location":
        error = validateLocation(value);
        break;
      case "role":
        error = validateRole(value);
        break;
      default:
        break;
    }

    if (error) {
      setFormErrors((prev) => ({ ...prev, [name]: error.message }));
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Your Personal Details</h3>
      <form onSubmit={handleSubmit}>
        <Input
          handleChange={handleChange}
          formData={userData}
          setting={{
            label: "Name",
            type: "text",
            name: "name",
            width: "w-100",
          }}
          error={formErrors?.name}
        />
        <Input
          handleChange={handleChange}
          formData={userData}
          setting={{
            label: "Email",
            type: "email",
            name: "email",
            width: "w-100",
          }}
          error={formErrors?.email}
        />
        <Input
          handleChange={handleChange}
          formData={userData}
          setting={{
            label: "Mobile",
            type: "text",
            name: "mobile",
            width: "w-100",
          }}
          error={formErrors?.mobile}
        />
        <Input
          handleChange={handleChange}
          formData={userData}
          setting={{
            label: "Password",
            type: "password",
            name: "password",
            width: "w-100",
          }}
          error={formErrors?.password}
        />
        <Input
          handleChange={handleChange}
          formData={userData}
          setting={{
            label: "Confirm Password",
            type: "password",
            name: "confirmPassword",
            width: "w-100",
          }}
          error={formErrors?.confirmPassword}
        />
        <Input
          handleChange={handleChange}
          formData={userData}
          setting={{
            label: "Location",
            type: "text",
            name: "location",
            width: "w-100",
          }}
          error={formErrors?.location}
        />
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-100 p-2 border max-md:w-60 ${
              formErrors?.role ? "border-red-500" : "border-gray-300"
            } rounded mt-1`}
          >
            <option value="">Select Role</option>
            <option value="visitor">Member</option>
            <option value="volunteer">Volunteer</option>
            <option value="organization">Organization</option>
          </select>
          {formErrors?.role && (
            <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-amber-500 text-white px-10 py-3 rounded cursor-pointer"
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
};

export default PersonalDetails;
