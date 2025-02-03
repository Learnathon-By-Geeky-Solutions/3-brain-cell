import {Hero, PastDisaster, MapSection, LogoScroll, Footer} from "../Public";
import {ongoingDisaster, organizations} from "../data/Data";

const Landing = () => {

  return (
    <>
      <Hero/>
      <PastDisaster ongoingDisaster={ongoingDisaster}/>
      <MapSection/>
      <LogoScroll organizations={organizations}/>
      <Footer/>
    </>
  );
};
export default Landing;
