import PropTypes from "prop-types";
import { HeroSection } from "../components";
const Contacts = (props) => {
  return (
    <>
      <HeroSection
        title="Контакти"
        typedStrings={["Зв'яжіться з нами. Ми завжди раді допомогти"]}
        subtitle="Зв'яжіться з нами. Ми завжди раді допомогти"
        buttonText="Надіслати повідомлення"
        buttonLink="/contact"
        textAlign="left"
      />
      <h1>Contacts</h1>;
    </>
  );
};
Contacts.propTypes = {};
export default Contacts;
