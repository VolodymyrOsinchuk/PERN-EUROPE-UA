import PropTypes from "prop-types";
import { HeroSection } from "../components";
const Forum = (props) => {
  return (
    <>
      <HeroSection
        title="Форум"
        typedStrings={["Простір для спілкування, обміну досвідом та підтримки"]}
        subtitle="Простір для спілкування, обміну досвідом та підтримки"
        buttonText="Приєднатися до дискусії"
        buttonLink="/forum"
        textAlign="left"
      />
      <h1>Forum</h1>;
    </>
  );
};
Forum.propTypes = {};
export default Forum;
