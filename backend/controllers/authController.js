const { User } = require("../models/user");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");
const { createJWT } = require("../utils/tokenUtils");

exports.register = async (req, res) => {
  try {
    const isFirstAccount = (await User.count()) === 0;
    console.log("🚀 ~ exports.register= ~ isFirstAccount:", isFirstAccount);
    // req.body.role = isFirstAccount ? "admin" : "user";

    if (isFirstAccount) {
      req.body.role === "admin";
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      country,
      city,
      agreeToTerms,
    } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Générer un token de vérification
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Créer l'utilisateur
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      verificationToken,
      country,
      city,
      agreeToTerms,
    });

    await sendVerificationEmail(user.email, firstName, verificationToken);

    // Envoyer email de vérification (à implémenter)
    // sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: user.id,
      token: verificationToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'inscription",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({
      where: { email },
      // attributes: {
      //   exclude: ["password"],
      // },
    });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    // Vérifier le mot de passe
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérifier si le compte est vérifié
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Veuillez vérifier votre compte" });
    }

    // Générer un token JWT
    const token = createJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Mettre à jour la dernière connexion
    await user.update({ lastLogin: new Date() });

    const oneDay = 1000 * 60 * 60 * 24;

    const userLogin = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    res.cookie("token", token, userLogin, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ msg: "user logged in", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({ msg: "user logged out!" });
};

exports.verifyEmail = async (req, res) => {
  // console.log("Headers reçus:", req.headers);
  // console.log("Paramètres de requête:", req.params);
  console.log("Corps de la requête:", req.body);
  console.log("Début de verifyEmail");
  console.log("Token reçu:", req.params.token);
  try {
    const { token } = req.params;
    console.log("Recherche de l'utilisateur avec le token:", token);
    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });
    console.log("Résultat de la recherche:", user);

    if (!user) {
      console.log("Aucun utilisateur trouvé avec ce token");
      return res
        .status(400)
        .json({ message: "Token de vérification invalide" });
    }

    console.log("Utilisateur trouvé, mise à jour...");
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    console.log("Utilisateur mis à jour avec succès");

    res.status(200).json({ message: "Email vérifié avec succès" });
  } catch (error) {
    console.error("Erreur dans verifyEmail:", error);
    res.status(500).json({
      message: "Erreur lors de la vérification de l'email",
      error: error.message,
    });
  }
};
