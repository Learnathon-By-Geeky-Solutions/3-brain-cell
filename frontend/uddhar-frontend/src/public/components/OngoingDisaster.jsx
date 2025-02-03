const OngoingDisaster = () => {
  const data = this.props.OngoingDisaster;

  return (
    <>
      <div className="h-70 w-70 rounded-2xl text-center">
        <p className="text-2xl">Current Disaster</p>
        <div>
          {data.length > 0 ? (
            <div>
              <p>{data.title}</p>
              <p>{data.description}</p>
              <button>Follow Up</button>
            </div>
          ) : (
            <p>No current disaster</p>
          )}
        </div>
      </div>
    </>
  );
};
export default OngoingDisaster;
