const { User } = require("../models/user");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");
const { createJWT, verifyJWT } = require("../utils/tokenUtils");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const { normalizePhone } = require("../utils/normalizePhone");

exports.register = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Відсутні дані для реєстрації" });
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

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "Електронна пошта, пароль, ім'я та прізвище обов'язкові",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Пароль має містити щонайменше 8 символів",
      });
    }

    const isFirstAccount =
      config.features.enableAdminBootstrap && (await User.count()) === 0;
    const role = isFirstAccount ? "admin" : "user";

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Користувач вже існує" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber: normalizePhone(phoneNumber),
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      country: country || null,
      // FIX: save "city" from register form — was sent but never stored
      city: city || null,
      agreeToTerms: agreeToTerms === true || agreeToTerms === "on",
      role,
    });

    const testEmailSent = await sendVerificationEmail(
      user.email,
      firstName,
      verificationToken,
    );
    console.log("🚀 ~ тестовий email надіслано:", testEmailSent);

    res.status(201).json({
      message: "Користувача успішно створено. Перевірте електронну пошту.",
      userId: user.id,
    });
  } catch (error) {
    console.error("Помилка під час реєстрації:", error);
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Помилка валідації",
        details: error.errors.map((e) => e.message),
      });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Email вже використовується" });
    }
    res
      .status(500)
      .json({ message: "Помилка під час реєстрації", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Електронна пошта та пароль обов'язкові" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Невірні облікові дані" });
    }

    const isMatch = await bcrypt.compare(password, user.dataValues.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Невірні облікові дані" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Будь ласка, підтвердіть свій акаунт" });
    }

    const token = createJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await user.update({ lastLogin: new Date() });

    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Користувач увійшов в систему",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        // FIX: include city in login response for profile display
        city: user.city,
        country: user.country,
        state: user.state,
      },
    });
  } catch (error) {
    console.error("Помилка під час входу:", error);
    res
      .status(500)
      .json({ message: "Помилка під час входу", error: error.message });
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ message: "Користувач вийшов із системи" });
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({ message: "Невірний токен підтвердження" });
    }

    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      return res.status(410).json({ message: "Термін дії токена минув" });
    }

    await user.update({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    res.status(200).json({ message: "Електронну пошту успішно підтверджено" });
  } catch (error) {
    console.error("Помилка під час підтвердження:", error);
    res
      .status(500)
      .json({ message: "Помилка під час підтвердження", error: error.message });
  }
};

/* ──────────────────────────────────────────────────────────
   OAuth Google / Facebook — flux code d'autorisation
   Pas de dépendance supplémentaire : requêtes fetch directes
   ────────────────────────────────────────────────────────── */

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000; // 10 minutes

const createOAuthState = (provider) =>
  createJWT({ oauthState: provider, ts: Date.now() });

const verifyOAuthState = (token) => {
  const decoded = verifyJWT(token);
  if (!decoded?.oauthState) throw new Error("État OAuth invalide");
  if (Date.now() - decoded.ts > OAUTH_STATE_TTL_MS) {
    throw new Error("État OAuth expiré");
  }
  return decoded.oauthState;
};

const issueSessionCookie = (res, user) => {
  const token = createJWT({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    sameSite: "none",
  });
};

// Trouve ou crée l'utilisateur depuis un profil social
const findOrCreateSocialUser = async ({
  provider,
  providerId,
  email,
  name,
  picture,
}) => {
  if (!email) throw new Error("Aucun email fourni par le fournisseur");

  let user = await User.findOne({ where: { email } });

  if (!user) {
    const nameParts = (name || "").trim().split(/\s+/).filter(Boolean);
    // firstName/lastName ont une validation len [2, 50] dans le modèle
    const firstName =
      nameParts[0] && nameParts[0].length >= 2
        ? nameParts[0]
        : "Utilisateur";
    const lastName =
      nameParts.slice(1).join(" ").trim().length >= 2
        ? nameParts.slice(1).join(" ").trim()
        : "Utilisateur";

    user = await User.create({
      firstName,
      lastName,
      email,
      // Mot de passe aléatoire (hashé par le hook beforeCreate) —
      // la connexion passe uniquement par le fournisseur OAuth
      password: crypto.randomBytes(32).toString("hex"),
      profilePicture: picture || null,
      provider,
      providerId: providerId || null,
      isVerified: true, // l'email est vérifié par le fournisseur
      agreeToTerms: true,
    });
  } else {
    // Compte existant : mémorise le fournisseur
    await user.update({
      provider,
      providerId: providerId || user.providerId,
      lastLogin: new Date(),
    });
  }

  return user;
};

const redirectToLoginError = (res) =>
  res.redirect(`${config.client.url}/login?error=oauth`);

/* ── Google ── */

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL =
  "https://openidconnect.googleapis.com/v1/userinfo";

exports.googleLogin = (req, res) => {
  const { clientId } = config.oauth.google;
  if (!clientId) {
    return res.status(501).json({
      error: "OAuth Google non configuré",
      message: "Définissez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET",
    });
  }

  const redirectUri = `${config.oauth.backendUrl}/api/v1/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state: createOAuthState("google"),
  });

  res.redirect(`${GOOGLE_AUTH_URL}?${params}`);
};

exports.googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return redirectToLoginError(res);
    if (verifyOAuthState(state) !== "google") return redirectToLoginError(res);

    const { clientId, clientSecret } = config.oauth.google;
    const redirectUri = `${config.oauth.backendUrl}/api/v1/auth/google/callback`;

    // 1. Échange du code contre un access token
    const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) throw new Error("Échec échange token Google");
    const tokens = await tokenRes.json();

    // 2. Profil utilisateur
    const profileRes = await fetch(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!profileRes.ok) throw new Error("Échec récupération profil Google");
    const profile = await profileRes.json();

    // 3. Trouve ou crée l'utilisateur, ouvre la session
    const user = await findOrCreateSocialUser({
      provider: "google",
      providerId: profile.sub,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
    });

    issueSessionCookie(res, user);
    res.redirect(`${config.client.url}/profile`);
  } catch (error) {
    console.error("googleCallback:", error);
    redirectToLoginError(res);
  }
};

/* ── Facebook ── */

const FB_API_VERSION = "v18.0";
const FB_DIALOG_URL = `https://www.facebook.com/${FB_API_VERSION}/dialog/oauth`;
const FB_GRAPH_URL = `https://graph.facebook.com/${FB_API_VERSION}`;

exports.facebookLogin = (req, res) => {
  const { appId } = config.oauth.facebook;
  if (!appId) {
    return res.status(501).json({
      error: "OAuth Facebook non configuré",
      message: "Définissez FACEBOOK_APP_ID et FACEBOOK_APP_SECRET",
    });
  }

  const redirectUri = `${config.oauth.backendUrl}/api/v1/auth/facebook/callback`;
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: redirectUri,
    state: createOAuthState("facebook"),
    scope: "email",
  });

  res.redirect(`${FB_DIALOG_URL}?${params}`);
};

exports.facebookCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return redirectToLoginError(res);
    if (verifyOAuthState(state) !== "facebook") return redirectToLoginError(res);

    const { appId, appSecret } = config.oauth.facebook;
    const redirectUri = `${config.oauth.backendUrl}/api/v1/auth/facebook/callback`;

    // 1. Échange du code contre un access token
    const tokenRes = await fetch(
      `${FB_GRAPH_URL}/oauth/access_token?${new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code,
      })}`,
    );
    if (!tokenRes.ok) throw new Error("Échec échange token Facebook");
    const { access_token: accessToken } = await tokenRes.json();

    // 2. Profil utilisateur
    const profileRes = await fetch(
      `${FB_GRAPH_URL}/me?${new URLSearchParams({
        fields: "id,name,email,picture",
        access_token: accessToken,
      })}`,
    );
    if (!profileRes.ok) throw new Error("Échec récupération profil Facebook");
    const profile = await profileRes.json();

    // 3. Trouve ou crée l'utilisateur, ouvre la session
    const user = await findOrCreateSocialUser({
      provider: "facebook",
      providerId: profile.id,
      email: profile.email,
      name: profile.name,
      picture: profile.picture?.data?.url || null,
    });

    issueSessionCookie(res, user);
    res.redirect(`${config.client.url}/profile`);
  } catch (error) {
    console.error("facebookCallback:", error);
    redirectToLoginError(res);
  }
};
