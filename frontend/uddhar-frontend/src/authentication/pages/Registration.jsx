import { useState } from "react";
import Commmon from "../../shared/ImportShared";
import { verify } from "../data/handleVerifyApi";
import { register } from "../data/regApi";
import Auth from "../ImportAuthentication";

const Registration = () => {
  const [step, setStep] = useState(0);
  const [error, setError] = useState();
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    location: "",
    role: "",
    code: "",
    skills: []
  });

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: "Password didn't match!"
      }));
      return;
    }
    
    try {
      const { name, email, mobile, password, location, role } = formData;
      const data = {
        name,
        email,
        mobile,
        password,
        location,
        role,
      };
      const response = await register(data);
      console.log(response);
      if (response.status) {
        handleNext();
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("An error occurred during registration");
      console.error("An error occurred", error);
    }
  };
  const handleVerify = async () => {
    try {
      const { email, code } = formData;
      const data = {
        email,
        code,
      };
      const response = await verify(data);
      if(response.status) {
        handleNext();
      }
      else {
        alert(response.message);
      }
    } catch (error) {
      setError("Invalid Code");
      console.error("Error sending code:", error);
    }
  };
  const handleNext = () => {
    setStep(step + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing again
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 shadow-lg to-yellow-200">
      <p className="text-4xl text-center py-5">Registration Process</p>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto max-w-3xl mb-4">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      <div className="flex p-10 items-start justify-center gap-x-20 max-md:flex-col">
        <Commmon.VerticalStepper currentStep={step} />
        <div className="bg-white p-8 rounded-lg shadow-lg pr-12 max-md:w-[300px] max-md:p-1 max-md:py-5">
          <div className="w-full pl-8">
            {step === 0 && (
              <Auth.PersonalDetails
                userData={formData}
                handleChange={handleChange}
                handleRegister={handleRegister}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
              />
            )}
            {step === 1 && (
              <Auth.EmailVerification
                formData={formData}
                handleChange={handleChange}
                handleVerify={handleVerify}
                error={error}
              />
            )}
            {step === 2 && (
              <Auth.RoleDetails
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                handleNext={handleNext}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
