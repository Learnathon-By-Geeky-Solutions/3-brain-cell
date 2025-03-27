// write input validation for every type of input field

export const validateText = (text, isRequired = true) => {
  if (!text && isRequired) {
    return {
      message: "This field is required",
      status: true,
    };
  }

  if (text && !/^[a-zA-Z ]+$/.test(text)) {
    return {
      message: "This field should contain only alphabets",
      status: true,
    };
  }
  return false;
};

export const validateEmail = (email, isRequired = true) => {
  if (!email && isRequired) {
    return {
      message: "Email is required",
      status: true,
    };
  }

  if (
    email &&
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    return {
      message: "Invalid email format",
      status: true,
    };
  }
  return false;
};

export const validateMobile = (mobile, isRequired = true) => {
  if (!mobile && isRequired) {
    return {
      message: "Mobile number is required",
      status: true,
    };
  }

  if (mobile && !/^[0-9]{10,11}$/.test(mobile)) {
    return {
      message: "Mobile number should be 10-11 digits",
      status: true,
    };
  }
  return false;
};

export const validatePassword = (password, isRequired = true) => {
  if (!password && isRequired) {
    return {
      message: "Password is required",
      status: true,
    };
  }

  if (password && password.length < 8) {
    return {
      message: "Password must be at least 8 characters",
      status: true,
    };
  }

  if (
    password &&
    !/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)
  ) {
    return {
      message:
        "Password must include uppercase, lowercase, number and special character",
      status: true,
    };
  }

  return false;
};

export const validateConfirmPassword = (
  password,
  confirmPassword,
  isRequired = true
) => {
  if (!confirmPassword && isRequired) {
    return {
      message: "Please confirm your password",
      status: true,
    };
  }

  if (password !== confirmPassword) {
    return {
      message: "Passwords do not match",
      status: true,
    };
  }

  return false;
};

export const validateLocation = (location, isRequired = true) => {
  if (!location && isRequired) {
    return {
      message: "Location is required",
      status: true,
    };
  }

  return false;
};

export const validateRole = (role, isRequired = true) => {
  if (!role && isRequired) {
    return {
      message: "Please select a role",
      status: true,
    };
  }

  return false;
};

export const validateCode = (code, isRequired = true) => {
  if (!code && isRequired) {
    return {
      message: "Verification code is required",
      status: true,
    };
  }

  if (code && !/^[0-9]{4,6}$/.test(code)) {
    return {
      message: "Invalid verification code",
      status: true,
    };
  }

  return false;
};

export const validateWebsite = (website, isRequired = false) => {
  if (!website && isRequired) {
    return {
      message: "Website URL is required",
      status: true,
    };
  }

  if (
    website &&
    !/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
      website
    )
  ) {
    return {
      message: "Please enter a valid URL",
      status: true,
    };
  }

  return false;
};

export const validateSocialMedia = (url, isRequired = false) => {
  if (!url && isRequired) {
    return {
      message: "Social media link is required",
      status: true,
    };
  }

  if (
    url &&
    !/^(https?:\/\/)?(www\.)?(facebook|twitter|instagram|linkedin|youtube)\.com\/.*/.test(
      url
    )
  ) {
    return {
      message: "Please enter a valid social media URL",
      status: true,
    };
  }

  return false;
};

export const validateDate = (date, isRequired = false) => {
  if (!date && isRequired) {
    return {
      message: "Date is required",
      status: true,
    };
  }

  return false;
};

export const validateRegNo = (regNo, isRequired = true) => {
  if (!regNo && isRequired) {
    return {
      message: "Registration number is required",
      status: true,
    };
  }

  return false;
};

export const validateOrganizationType = (type, isRequired = true) => {
  if (!type && isRequired) {
    return {
      message: "Organization type is required",
      status: true,
    };
  }

  return false;
};

export const validateSkills = (skills, isRequired = true) => {
  if ((!skills || skills.length === 0) && isRequired) {
    return {
      message: "Please select at least one skill",
      status: true,
    };
  }

  return false;
};
