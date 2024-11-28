import PropTypes from "prop-types";
import { HeroSection } from "../components";

const News = (props) => {
  return (
    <>
      <HeroSection
        title="Останні Новини"
        typedStrings={["Актуальна інформація для українців в Європі"]}
        subtitle="Актуальна інформація для українців в Європі"
        // backgroundImage="/path/to/news-background.jpg"
        textColor="white"
      />
    </>
  );
};
News.propTypes = {};
export default News;
