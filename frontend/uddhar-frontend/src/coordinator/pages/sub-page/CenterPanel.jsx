import Proptypes from "prop-types";
import DisasterSummary from "../../components/DisasterSummary";
import OrgTable from "../../components/OrgTable";
import WeatherCard from "../../components/WeatherCard";

const CenterPanel = ({ Event, weatherData }) => {
  return (
    <div className="flex flex-col my-5">
      {/* <Toaster position="bottom-right" richColors /> */}
      {Event}
      <div className="flex justify-center gap-[10px]">
        <WeatherCard weatherData={weatherData} />
        <DisasterSummary type="flood" />
      </div>
      {/* <div className="flex justify-center h-150 w-full bg-green my-10">
          <Map />
          <MapLeftOperation />
        </div> */}
      <OrgTable />
      {/* <TableWithPagination currentEvent={currentEvent}/> */}
    </div>
  );
};
export default CenterPanel;

CenterPanel.propTypes = {
  Event: Proptypes.element,
  weatherData: Proptypes.object,
};
