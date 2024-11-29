import PropTypes from "prop-types";
import { HeroSection } from "../components";
const Publications = (props) => {
  return (
    <>
      <HeroSection
        title="Публікації"
        typedStrings={[
          "Корисні статті, дослідження та матеріали про життя українців у Європі",
        ]}
        subtitle="Корисні статті, дослідження та матеріали про життя українців у Європі"
        buttonText="Читати статті"
        buttonLink="/публікації"
        textAlign="left"
      />
      <h1>Publications</h1>;
    </>
  );
};
Publications.propTypes = {};
export default Publications;
