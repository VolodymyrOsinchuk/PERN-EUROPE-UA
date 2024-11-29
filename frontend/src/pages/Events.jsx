import PropTypes from "prop-types";
import { HeroSection } from "../components";
const Events = (props) => {
  return (
    <>
      <HeroSection
        title="Афіша Подій"
        typedStrings={["Культурні заходи та зустрічі діаспори"]}
        subtitle="Простір для спілкування, обміну досвідом та підтримки"
        buttonText="Переглянути події"
        buttonLink="/events"
        textAlign="left"
      />
      <h1>Events</h1>;
    </>
  );
};
Events.propTypes = {};
export default Events;
