import Common from "../../shared/ImportShared";

const EmailVerification = ({ formData, handleChange, handleVerify, error }) => {
  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Email Verification</h3>
      <form>
        <Common.Input
          setting={{
            name: "code",
            label: "Verification Code",
            width: "w-50",
            type: "text",
            placeholder: "Enter the code sent to your email",
          }}
          handleChange={handleChange}
          formData={formData}
        />
        {error && (
          <div className="text-red-500 text-sm md:text-lg font-sans mt-2">
            {error}
          </div>
        )}
        <div className="flex justify-center">
          <button
            type="button"
            className="w-1/2 bg-blue-500 text-white p-2 rounded cursor-pointer"
            onClick={handleVerify}
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
};

export default EmailVerification;
