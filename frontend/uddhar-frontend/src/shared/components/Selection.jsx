const Selection = ({ setting, setFormData, formData, options, error }) => {
  const { name, label, width } = setting;

  // name is the key of the object in the formData
  const addValue = (e) => {
    const { name, value } = e.target;
    // Check if the value is not empty and not already in the array
    if (value && !formData[name].includes(value)) {
      setFormData({ ...formData, [name]: [...formData[name], value] });
    }
    // Reset select to initial placeholder
    e.target.value = "";
  };

  const removeValue = (valueToRemove) => {
    setFormData({
      ...formData,
      [name]: formData[name].filter((value) => value !== valueToRemove),
    });
  };

  return (
    <>
      <label htmlFor={name} className="block mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        onChange={addValue}
        className={`p-2 border rounded ${width ? width : "w-full"} mb-4 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        defaultValue=""
      >
        <option value="" disabled>
          Select a {label}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      {/* show selection */}
      <div className="mb-4">
        {formData[name] &&
          formData[name].map((value) => (
            <span
              key={value}
              className="inline-flex items-center bg-gray-200 rounded px-2 py-1 mr-2 mb-2"
            >
              {value}
              <button
                type="button"
                onClick={() => removeValue(value)}
                className="ml-1 text-red-500 cursor-pointer"
              >
                &#x2715;
              </button>
            </span>
          ))}
      </div>
    </>
  );
};

export default Selection;
