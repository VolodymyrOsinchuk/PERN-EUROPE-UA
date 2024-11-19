const User = require("../models/user");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");

exports.register = async (req, res) => {
  try {
    const isFirstAccount = (await User.count()) === 0;
    req.body.role = isFirstAccount ? "admin" : "user";

    const { firstName, lastName, email, password, phoneNumber } = req.body;

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
    });

    await sendVerificationEmail(user.email, verificationToken);

    // Envoyer email de vérification (à implémenter)
    // sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      userId: user.id,
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
    const user = await User.findOne({ where: { email } });
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
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Mettre à jour la dernière connexion
    await user.update({ lastLogin: new Date() });

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la connexion", error: error.message });
  }
};

exports.verifyAccount = async (req, red) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ message: "Token invalide" });
    }

    // Marquer comme vérifié et effacer le token
    await user.update({
      isVerified: true,
      verificationToken: null,
    });

    res.json({ message: "Compte vérifié avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur de vérification", error: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ where: { verificationToken: token } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token de vérification invalide" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.status(200).json({ message: "Email vérifié avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la vérification de l'email",
      error: error.message,
    });
  }
};
