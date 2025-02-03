import {Hero, PastDisaster, MapSection, LogoScroll} from "../Public";
import {ongoingDisaster, organizations} from "../data/Data";

const Landing = () => {

  return (
    <>
      <Hero/>
      <PastDisaster ongoingDisaster={ongoingDisaster}/>
      <MapSection/>
      <LogoScroll organizations={organizations}/>
    </>
  );
};
export default Landing;
