# Audit de ton site (aucune modification faite)

## Verdict

**Score global : 52/100. Ton site n'est pas encore prêt pour de vrais utilisateurs.** Le cœur est solide : inscription, création d'annonce, photos Cloudinary et affichage. La sécurité de base est correcte : mots de passe hashés, cookie httpOnly, propriétaires vérifiés. Le design est cohérent.

Ce qui bloque :

1. ~~Plusieurs fonctions sont du décor et ne font rien : contact vendeur, formulaire de contact, signalement, boutons Google/Facebook, « s'inscrire à l'événement ».~~ ✅ **CORRIGÉ le 2026-10-05** — voir « Corrections réalisées » ci-dessous.
2. Des chiffres, témoignages et badges inventés sont affichés comme réels.
3. Les filtres de la page Annonces sont cassés.
4. Il n'y a ni « mot de passe oublié » ni renvoi d'email de vérification.
5. Une faille sur les messages privés.
6. La base ne se construit pas sur une base vide avec tes migrations.
7. La politique de confidentialité est incomplète.

**Limites de cette analyse.** J'ai lu le code, je n'ai rien exécuté. Je n'ai pas vu :

- `backend/index.js`
- `services/adExpirationSettingsService.js`
- `customFetch`, `AuthContext`, les layouts et les composants (Navbar, GridView…)
- `frontend/package.json`
- le `.env` et la config de déploiement

Les points qui en dépendent sont marqués ❓. Certains points (`createdBy`, `/users/stats`, création d'événement du dashboard) sont peut-être déjà corrigés chez toi. Si c'est le cas, dis-le-moi : les fichiers envoyés ne sont alors pas à jour.

### ✅ Corrections réalisées (2026-10-05)

Les 5 fonctions « décoratives » sont maintenant fonctionnelles :

1. **Contact vendeur** — envoi `POST /api/v1/messages` avec redirection `/login` si 401 ; **nouvelle page `/messages`** (liste des conversations, fil de discussion, réponse) ; badge « messages non lus » dans la navbar.
2. **Formulaire de contact** — `POST /api/v1/contact` sauvegarde en base (`contact_messages`), rate limit 5/heure/IP.
3. **Signalement** — `POST /api/v1/reports` sauvegarde en base (`reports`) ; admin : `GET /api/v1/reports` + `PATCH /api/v1/reports/:id/resolve`.
4. **Google / Facebook** — flux OAuth2 complet (code d'autorisation, state JWT signé, find-or-create par email, cookie JWT). Variables d'environnement requises : `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`. Redirect URIs à autoriser : `{BACKEND_URL}/api/v1/auth/google/callback` et `{BACKEND_URL}/api/v1/auth/facebook/callback`.
5. **« Зареєструватися на подію »** — `POST/DELETE /api/v1/events/:id/register`, table `event_registrations` (unique eventId+userId), UI état « Ви зареєстровані » + compteur de participants.

**Migrations ajoutées** (exécutées au démarrage via `npm start` / `npm run migrate`) : tables `reports`, `contact_messages`, `event_registrations` ; colonnes `provider`/`providerId` sur `users`.

---

## 1. Architecture expliquée simplement

Pense à un restaurant :

- **React** est la salle : ce que voit l'utilisateur.
- **`customFetch`** est le serveur qui porte les commandes.
- **Express** est la cuisine.
  - Les _routes_ sont le guichet de commande.
  - Les _middlewares_ sont les contrôles à l'entrée : connecté ? propriétaire ? admin ?
  - Les _controllers_ sont les cuisiniers.
- **Sequelize** décrit la forme des données.
- **PostgreSQL** est le frigo.
- **Cloudinary** stocke les photos et **Mailgun** envoie les emails.

**Connexion.** Tu te connectes, le serveur met un JWT dans un cookie httpOnly. À chaque requête, `authMiddleware` lit ce cookie. Les rôles sont `user`, `moderator` et `admin`.

**Backend.** Le schéma est routes → controllers → models, sans couche « services » (sauf pour l'expiration). C'est la bonne taille pour ton niveau. **Ne change rien à cette structure.**

**Frontend.** Tu utilises React Router en mode « data » : un _loader_ charge les données avant d'afficher la page, une _action_ traite un formulaire. Le design vient de MUI. Les pages sont réparties en trois zones : public, `/profile` et `/dashboard` (admin).

**Où est la complexité.** Ton projet contient une application d'annonces (le cœur) plus cinq mini-applications : actualités, événements, publications, forum et messagerie. Presque tous les bugs et les fausses fonctions viennent de ces extras.

---

## 2. Fonctionnalités

| Fonction                                               | État | Détail                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inscription + email de vérification                    | ⚠️   | Marche. Mais si l'email se perd ou expire (24 h), l'utilisateur est bloqué : il ne peut ni se réinscrire (« existe déjà ») ni renvoyer le lien.                                                                                                                                                 |
| Connexion / déconnexion                                | ⚠️   | Marche, mais l'email est sensible à la casse : sur mobile, « Jean@… » ≠ « jean@… ».                                                                                                                                                                                                             |
| Mot de passe oublié                                    | ❌   | Le lien pointe vers `#`. L'email de reset existe dans `emailService`, mais aucune route ne l'utilise.                                                                                                                                                                                           |
| Profil : modifier                                      | ⚠️   | Un téléphone vide (`""`) est très probablement refusé par la validation du modèle. À tester : enregistre ton profil sans téléphone. La « ville » d'inscription (`city`) n'est jamais affichée : le profil affiche `location`.                                                                   |
| Changer le mot de passe, supprimer le compte           | ✅   |                                                                                                                                                                                                                                                                                                 |
| Créer une annonce                                      | ⚠️   | Marche. Mais si une catégorie n'a aucune sous-catégorie, le bouton reste désactivé. Email et téléphone sont à retaper à chaque fois.                                                                                                                                                            |
| Modifier une annonce                                   | ⚠️   | La sous-catégorie n'est pas sauvegardée. L'étoile « photo principale » est ignorée. Le format du téléphone est incohérent.                                                                                                                                                                      |
| Supprimer une annonce                                  | ✅   | Sans confirmation côté dashboard.                                                                                                                                                                                                                                                               |
| Liste des annonces                                     | ⚠️   | Affiche **tout** : annonces `Inactive`, archivées et expirées incluses. Aucune pagination.                                                                                                                                                                                                      |
| Filtre catégorie                                       | ❌   | Le code compare `ad.category.slug`, mais ce champ n'existe pas. Le résultat est toujours vide.                                                                                                                                                                                                  |
| Filtre ville                                           | ❌   | Il compare le champ « adresse » (`location`), pas `ad.city`.                                                                                                                                                                                                                                    |
| Recherche                                              | ⚠️   | Cachée derrière le bouton « Фільтри ». La barre de l'accueil ne fait rien.                                                                                                                                                                                                                      |
| Détail d'une annonce                                   | ⚠️   | Badge « vérifié » et « sur le site depuis 2023 » codés en dur pour tout le monde.                                                                                                                                                                                                               |
| Contacter le vendeur                                   | ❌   | Le message est enregistré, mais **aucune page ne permet de le lire**. Répondre est aussi impossible (voir §4).                                                                                                                                                                                  |
| Signaler une annonce                                   | ❌   | Affiche « Скаргу надіслано » sans rien envoyer.                                                                                                                                                                                                                                                 |
| Favoris                                                | ❌   | N'existent pas. Les boutons « Зберегти » sont décoratifs.                                                                                                                                                                                                                                       |
| Expiration automatique                                 | ❓   | Le service est absent des fichiers reçus. S'il n'existe pas, `adExpirationSettingsController` fait planter le serveur au démarrage.                                                                                                                                                             |
| Événements                                             | ⚠️   | La liste ne mène pas à la fiche détail. Elle trie du plus ancien au plus récent, donc le passé s'affiche en premier. Le jour J, l'événement apparaît « terminé ». Le bouton « S'inscrire » ne fait rien. La création depuis le dashboard ne fait rien non plus (l'action ne gère que `delete`). |
| Publications                                           | ⚠️   | « Читати далі » ne mène nulle part. Le bouton « modifier » du propriétaire n'apparaît jamais (`createdBy` n'existe pas, il faut `userId`). Un `&` s'affiche `&amp;`.                                                                                                                            |
| Actualités                                             | ✅   | Lecture et CRUD admin OK.                                                                                                                                                                                                                                                                       |
| Forum                                                  | ⚠️   | Créer un sujet et répondre marchent. Aucun moyen de supprimer une réponse ou un sujet depuis l'interface (modération impossible).                                                                                                                                                               |
| Formulaire de contact                                  | ❌   | Affiche « Дякуємо ! » sans rien envoyer (l'appel API est commenté).                                                                                                                                                                                                                             |
| Admin : utilisateurs, annonces, catégories, actualités | ✅   | Suppressions sans confirmation.                                                                                                                                                                                                                                                                 |
| Admin : page « Адміністрування »                       | ❌   | Maintenance, cache et sauvegarde ne font rien. Les permissions sont fictives. « Ajouter » plante (`lastName: ""` est refusé par le modèle).                                                                                                                                                     |
| Dashboard : activité récente, Stats, Posts             | ⚠️   | Activité factice, graphique peu utile, données « mock » en secours.                                                                                                                                                                                                                             |
| Paramètres                                             | ❓   | Le front appelle `/admin/settings`. À vérifier : `settingsRouter` doit être monté sur ce chemin dans `index.js`.                                                                                                                                                                                |

---

## 3. Parcours utilisateur

1. **Inscription.** OK, mais il n'y a pas de renvoi d'email. Si Mailgun est dans la région EU et que `url` reste commenté, les emails échouent en silence et l'utilisateur voit quand même « Перевірте email ».
2. **Connexion.** OK. Le cookie dure 1 jour : l'utilisateur doit se reconnecter chaque jour. Sur iPhone/Safari, voir §4 (cookies cross-site).
3. **Profil.** Voir le bug du téléphone vide.
4. **Création d'annonce.** Fluide et agréable. Après publication, tu arrives sur l'onglet « Особиста інформація » au lieu de « Mes annonces ».
5. **Recherche et filtres.** Cassés (voir §2).
6. **Consultation.** OK, avec les faux badges.
7. **Contact.** Ne fonctionne pas pour le vendeur.
8. **Modification / suppression.** OK, avec les bugs notés plus haut.
9. **Déconnexion.** ✅

**Cas problématiques :**

- **Non connecté sur `/profile/create-ad`** : le formulaire s'affiche, l'utilisateur le remplit, puis reçoit une erreur 401 et perd tout.
- **Annonce d'un autre** : le backend refuse (`checkOwnership`) ✅.
- **Données invalides** : le backend renvoie `{error, details}`, mais le front lit `.message`. L'utilisateur voit seulement « Помилка публікації », sans savoir quel champ corriger.
- **Rechargement de page** : dépend des règles de réécriture de ton hébergeur (`/ads/12` ne doit pas donner 404) ❓.
- **API qui dort** (démarrage à froid d'un hébergeur gratuit) : les pages renvoient `[]`, donc « Нічого не знайдено » s'affiche au lieu d'une erreur. L'utilisateur croit qu'il n'y a pas d'annonces.
- **Annonce sans photo** : le détail gère ✅. La grille et la liste sont ❓.
- **Annonce incomplète** : bloquée par le backend ✅ (message peu clair).

---

## 4. Sécurité

🔴 **CRITIQUE**

- **Messages privés lisibles par tout utilisateur connecté.** Dans `messageController.getMessages`, on cherche la conversation par son numéro et on renvoie tous les messages, sans vérifier que l'utilisateur en fait partie. Quelqu'un peut essayer `/messages/1`, `/2`, `/3`… et lire les messages de tout le monde. `createMessage` permet aussi d'écrire dans la conversation d'un autre. _Correction : facile (vérifier `senderId` / `recipientId`), ou supprimer le module (voir §10)._

🟠 **IMPORTANT**

- **Emails de tous les auteurs exposés publiquement.**
  - `GET /adv` renvoie `user.email` de chaque annonce.
  - `GET /adv/:id` renvoie l'email et le téléphone du **compte**, pas seulement ceux de l'annonce.
  - `GET /events` expose `authorEmail`.
  - N'importe quel robot peut les collecter (spam, RGPD).
  - _Facile : retirer ces champs des `include`._
- **Cookies et CSRF** ❓ (dépend d'`index.js` et de ton déploiement).
  - Le cookie est `SameSite=None`.
  - Si front et API sont sur des domaines différents (ex. `xxx.vercel.app` + `yyy.onrender.com`), **Safari iPhone bloque ce cookie** : la connexion semble marcher mais l'utilisateur reste déconnecté.
  - `SameSite=None` ouvre aussi la porte au CSRF sur les routes multipart (création d'annonce, photo de profil).
  - _Solution simple : un seul domaine, `app.tonsite.com` + `api.tonsite.com`, avec cookie `SameSite=Lax`. Facile côté code, un peu de configuration DNS._
- **Aucune limite de création** (annonces, sujets, messages, événements) et aucune modération. Un compte vérifié peut spammer. _Facile : un `express-rate-limit` général et un plus strict sur les POST._
- **Mass assignment dans `publicationController`.** `updatePublication` fait `{...req.body}` : un utilisateur peut changer `userId` (voler une publication) ou `author` (se faire passer pour quelqu'un). _Facile : `pick([...])`, comme tu le fais déjà ailleurs._
- **Scripts destructeurs.** `cleanDb.js` et `seedData.js` font `sync({force:true})` si `NODE_ENV` n'est pas `production`. Si ton `.env.development` pointe vers une vraie base, tu la perds. `seedData` crée aussi un admin avec un mot de passe connu (`AdminPassword123!`). _Facile : garde-fou + confirmation._

🟡 **MOYEN**

- **Erreurs internes renvoyées au client** (`res.json({ error: error.message })`) : messages SQL/Sequelize visibles. Pas de gestionnaire d'erreurs global : une erreur multer renvoie du HTML.
- **Email.** Pas de `isEmail` dans le modèle User. Pas de minuscules : « A@x.com » et « a@x.com » sont deux comptes. Modifiable via `PUT /users/:id` sans re-vérification.
- **Uploads.** 10 Mo × 5 fichiers gardés en mémoire (risque de saturation, le front annonce 5 Mo). Le type MIME vient du client (un SVG passe). Le total ≤ 5 photos n'est pas contrôlé à la modification.
- **JWT 7 jours mais cookie 1 jour.** Le rôle est figé dans le token : un compte supprimé ou rétrogradé reste valide jusqu'à expiration.
- **`agreeToTerms` non exigé côté serveur** (seulement la case côté front).
- **Suppression de compte** : nom et email restent dans les événements, publications et sujets (`SET NULL` ne les efface pas). Problème RGPD.
- **Lien de vérification déjà utilisé** (préchargé par un antivirus ou une messagerie) : `VerifyAccount` renvoie vers `/register` avec une erreur alors que le compte est bon.

🟢 **FAIBLE**

- `/users/stats` ouvert à tout utilisateur connecté.
- `/current-user` et `getAllUsers` renvoient aussi `verificationToken` et `resetPasswordToken` (seul `password` est exclu).
- Énumération d'emails à l'inscription.
- `ca.pem` : c'est un certificat public, pas un secret. Il est inutile si tu utilises `DB_CA_CERT_BASE64`.
- Google Fonts et favicons Google/Facebook chargés depuis leurs serveurs (RGPD).
- Le prénom est inséré tel quel dans le HTML des emails.

✅ **Ce qui est bien :**

- bcrypt pour les mots de passe
- cookie httpOnly
- `JWT_SECRET` obligatoire au démarrage
- rate limit sur login et inscription
- `checkOwnership` et `checkSelfOrAdmin`
- liste blanche (`pick`) dans `createUser`
- pas de `dangerouslySetInnerHTML` (React échappe le texte)
- pas d'injection SQL visible (Sequelize paramètre les requêtes)
- SSL sur la base

---

## 5. Base de données

**La structure est adaptée à un site d'annonces. Rien à refaire.** Les tables, les clés étrangères et les index ajoutés par les migrations sont corrects.

| Problème                                                                                                                                                                                                                                                                                                                                                               | Gravité         | Correction                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| **`sync()` et migrations sont mélangés.** Les migrations supposent que les tables existent déjà : `20241219` ajoute une colonne à `advs`, `20260620120002` ajoute des index à `forum_replies`, etc. Il n'y a aucune migration qui crée `users`, `advs`, `forum_categories`, `adv_expiration_settings`… Sur une base **vide**, `npm start` (migrations d'abord) plante. | 🔴 pour la prod | Choisir une méthode : une migration « baseline » qui crée les tables, ou un premier `sync()` documenté. Moyenne. |
| La migration `20241219` met `ON DELETE CASCADE` sur `advs.subcategoryId`. Selon la façon dont ta vraie base a été créée, supprimer une sous-catégorie peut supprimer **toutes ses annonces** (et laisser les photos orphelines sur Cloudinary).                                                                                                                        | 🟠              | Vérifier avec `\d advs` dans psql ; passer à `SET NULL`. Facile.                                                 |
| Email unique mais sensible à la casse.                                                                                                                                                                                                                                                                                                                                 | 🟡              | Mettre en minuscules dans le code. Facile.                                                                       |
| Plusieurs champs pour la même idée : `status` / `isArchived` / `expirationDate` ; `users.state` / `city` / `location` ; sujet de forum avec `category` (texte) **et** `forumCategoryId`.                                                                                                                                                                               | 🟡              | Voir §10.                                                                                                        |
| Colonnes jamais utilisées : `resetPasswordToken`, `resetPasswordExpires` (tant que « mot de passe oublié » n'existe pas).                                                                                                                                                                                                                                              | 🟢              | Garder, elles serviront.                                                                                         |
| `views` s'incrémente à chaque GET (y compris le propriétaire et les robots).                                                                                                                                                                                                                                                                                           | 🟢              | Ignorable pour le MVP.                                                                                           |

**Requêtes N+1 :** je n'en vois pas (les `include` font des jointures). `getConversations` utilise `limit` dans un `include` hasMany, ce qui est probablement incorrect. Il est lié à la messagerie, dont je propose le remplacement.

---

## 6. Backend

| Constat                                    | Détail                                                                                                                                                                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ Async/await propre, `try/catch` partout |                                                                                                                                                                                                                              |
| ⚠️ Format d'erreur incohérent              | Tantôt `{error}`, tantôt `{message}`. Le front lit `.message`, donc il affiche souvent un toast générique. `Users.jsx` fait `toast.error(error?.response?.data?.message)` sans valeur par défaut : toast vide possible.      |
| ⚠️ Codes HTTP                              | Suppression : 204 ici, 200 là. Pas bloquant.                                                                                                                                                                                 |
| ⚠️ Validation                              | Uniquement dans les modèles. Rien ne vérifie la longueur du contenu d'un sujet ou d'une réponse de forum.                                                                                                                    |
| ⚠️ Photos supprimées deux fois             | Le hook `beforeDestroy` de `Adv` et `deleteAnnonce` appellent tous deux Cloudinary.                                                                                                                                          |
| ⚠️ `updateAnnonce`                         | Supprime les photos sur Cloudinary **avant** `adv.update`. Si la mise à jour échoue, la base pointe vers des images supprimées.                                                                                              |
| ⚠️ Pas de pagination, aucune route         |                                                                                                                                                                                                                              |
| ❌ Fichiers morts                          | `config/nodemailer.js` : il importe `nodemailer-mailgun-transport`, qui n'est pas dans `package.json` (planterait s'il était chargé). `scripts/initCategories.js` : entièrement commenté, mais présent dans les scripts npm. |
| ❓ Dépendances                             | `sharp`, `slugify`, `uuid`, `http-status-codes`, `express-validator`, `nodemailer` ne sont pas utilisés dans les fichiers que j'ai reçus. Vérifie avec `npx depcheck`. `nodemon` devrait être en `devDependencies`.          |

**Architecture proposée : la tienne, plus deux petits ajouts.**

1. Un middleware `errorHandler` unique qui répond toujours `{ message }`.
2. Une règle unique « une annonce est visible si `status='Active'`, non archivée et non expirée », écrite à un seul endroit.

---

## 7. Frontend

| Constat                             | Détail                                                                                                                                                                |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅                                  | Structure claire, loaders/actions cohérents, design homogène, breakpoints responsive utilisés.                                                                        |
| ⚠️ Trois façons d'appeler l'API     | Loaders/actions, `useFetcher`, et `customFetch` direct dans les composants (`ForumManager`, `AdExpirationSettings`). Pas grave, mais choisis une règle pour la suite. |
| ⚠️ Pas de lazy loading              | `App.jsx` importe toutes les pages d'un coup. Un visiteur télécharge le code du dashboard et de recharts.                                                             |
| ⚠️ Profil : retour des suppressions | `useActionData()` ne récupère pas les résultats d'un `fetcher.submit`. La suppression marche, mais aucun message de succès ou d'erreur ne s'affiche.                  |
| ⚠️ `dashboard/EditEvent.jsx`        | Utilise `<Grid item xs=…>` (ancienne syntaxe) alors que le reste utilise `size={{…}}`. La mise en page est probablement cassée ; à vérifier visuellement.             |
| ⚠️ Chemins d'images « legacy »      | La logique `public/uploads/adv/…` est répétée dans `Profile`, `EditAdPage` et ailleurs, alors que tout est maintenant sur Cloudinary (`photos[0]` est déjà une URL).  |
| ⚠️ Code dupliqué                    | Les constantes de design (`F_BODY`, `BLUE`, `inputSx`…) sont recopiées dans ~25 fichiers. `StepSection` est copié dans 5 fichiers.                                    |
| ⚠️ Code commenté                    | Plusieurs fichiers commencent par une ancienne version commentée.                                                                                                     |
| ❓ Routes protégées                 | `/profile/create-ad` et `/dashboard/*` : je n'ai pas vu les layouts.                                                                                                  |

**Bibliothèques :**

- `react-country-state-city` (utilisée à l'inscription et dans les formulaires d'annonce) → **à supprimer**. Elle charge toutes les villes du monde, et tes filtres utilisent une liste de 6 villes écrite à la main, qui ne correspond pas. Mets une liste statique des pays européens et un champ « Ville » libre.
- `recharts` → à supprimer avec la page Stats.
- `sanitize-html` (backend) → à supprimer (voir §10).
- Deux systèmes d'icônes : `@mui/icons-material` **et** la police « Material Icons » (`className="material-icons"`). Garde le premier.
- Je n'ai pas vu `frontend/package.json` : le `depcheck` s'impose aussi côté front.

---

## 8. UX/UI

**Points forts :** identité visuelle forte, formulaires en étapes avec progression, états vides soignés, publication facile (bouton flottant « + » et bouton du hero).

**Tes questions précises :**

| Question               | Réponse                                                                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Rechercher             | ⚠️ Barre cachée dans « Фільтри » ; celle de l'accueil est décorative.                                                                 |
| Publier                | ✅ Évident.                                                                                                                           |
| Contacter un vendeur   | ❌ Bouton visible mais inutile pour le vendeur. Le téléphone et l'email de l'annonce sont affichés, ce qui sauve un peu la situation. |
| Modifier / supprimer   | ✅ Onglet « Мої оголошення ».                                                                                                         |
| Savoir si c'est fiable | ❌ Badge « vérifié » faux pour tout le monde.                                                                                         |
| Infos importantes      | ✅ Prix, lieu, date, description. Prix toujours en € (pas de PLN/CZK).                                                                |

**Autres problèmes :**

- **Faux contenus** : « 12 000+ Українців », « 3 400+ оголошень », témoignages avec prénoms, équipe fictive (« Олена Ковальчук, CEO »), « Доступно на 6 мовах », actualités factices sur l'accueil. Sur un site de petites annonces, c'est une faute de confiance. En Europe, de faux témoignages peuvent aussi être juridiquement problématiques (je ne suis pas juriste).
- Boutons sociaux Google/Facebook sans action. Dialogue « signaler » et formulaire de contact qui mentent à l'utilisateur.
- Aucun indicateur de chargement entre deux pages. Avec un serveur qui dort, le clic « semble ne rien faire ».
- Aucune confirmation avant suppression dans le dashboard (supprimer une catégorie supprime ses sous-catégories).
- Dashboard avec libellés en français (« Catégorie », « Créer », forum) dans une interface ukrainienne.
- Accessibilité : texte gris `#94a3b8` sur blanc (contraste ≈ 2,6:1, trop faible), tailles de 10–11 px, certaines lignes cliquables ne sont pas utilisables au clavier (`Box onClick`).
- Politique de confidentialité visible mais incomplète (voir §11).

---

## 9. Performance

Rien de grave pour 100 annonces. Avant d'avoir du public :

- **Pas de pagination.** `/adv` renvoie toutes les annonces avec leur description complète, et le filtrage se fait dans le navigateur. Même chose pour actualités, publications et forum (contenus complets de 20 000 caractères dans les listes).
- **Pas de lazy loading** des routes (voir §7).
- **Images** : Cloudinary compresse (`quality:auto`), mais l'affichage en liste charge la taille d'origine. Un petit utilitaire qui insère `w_400` dans l'URL suffit pour les miniatures.
- **`react-country-state-city`** alourdit le bundle et les formulaires.
- **Démarrage à froid** : le script `keep-alive.js` laisse penser à un hébergeur gratuit. Prévois un indicateur de chargement.
- **Polices Google** : à héberger toi-même plus tard (`@fontsource`).

Solutions simples : pagination 20 par page avec « Charger plus », recherche côté serveur (`?q=&categoryId=&city=&page=`), `lazy` sur les routes `/dashboard` et `/profile`. Pas besoin de cache ni de Redis.

---

## 10. Simplification

| #   | AVANT                                                                                                                                                                                                                                                                               | APRÈS                                                                                                                        | GAIN                                                                                              | RISQUE                                                        |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Du code commenté dans ~15 fichiers (`App.jsx`, `Forum.jsx`, `Home.jsx`, `EditAdPage.jsx`, `Register.jsx`, `emailService.js`, `multer.js`…)                                                                                                                                          | Supprimer (git garde l'historique)                                                                                           | Fichiers 2 à 3 fois plus courts et lisibles                                                       | Nul                                                           |
| 2   | Fichiers morts : `pages/index.jsx` (barrel jamais importé), `Landing.jsx` (doublon de `Home.jsx`), `dashboard/Settings.jsx`, `dashboard/EditUser.jsx` (route sans loader, appelle `GET /users/:id` qui n'existe pas), `config/nodemailer.js`, `scripts/initCategories.js`, `ca.pem` | Supprimer                                                                                                                    | Moins de confusion                                                                                | Faible : vérifier que la Navbar ne pointe pas vers `/landing` |
| 3   | `profile/Events.jsx` et `profile/Publications.jsx` : les mêmes listes que les onglets du Profil                                                                                                                                                                                     | Garder les onglets, supprimer les pages                                                                                      | ~800 lignes en moins                                                                              | Faible : vérifier les liens de la Navbar                      |
| 4   | Page Admin avec maintenance/cache/backup/permissions factices, activité récente fictive, page Stats + recharts, données « mock » dans `Posts.jsx`                                                                                                                                   | Garder « liste des admins + changer le rôle »                                                                                | Plus de fausses fonctions, un paquet en moins                                                     | Faible                                                        |
| 5   | Boutons décor : Google/Facebook, « Зберегти », « Поділитися », « Зареєструватися » (événement), formulaire de contact factice, signalement factice                                                                                                                                  | Supprimer **ou** brancher réellement (voir §11)                                                                              | Honnêteté et confiance                                                                            | Nul                                                           |
| 6   | Messagerie : 2 tables, 1 controller, 1 router, aucune page pour la lire                                                                                                                                                                                                             | Un bouton « Écrire au vendeur » qui envoie **un email** via `emailService.sendMail` (avec le mail de l'acheteur en reply-to) | Pas de boîte de réception à construire, pas de faille IDOR, le vendeur reçoit vraiment le message | Les anciens messages sont perdus (aucun n'était lisible)      |
| 7   | Constantes de style copiées ~25 fois, `StepSection` ×5                                                                                                                                                                                                                              | Un fichier `theme` partagé                                                                                                   | ~1 500 lignes en moins                                                                            | Faible (changements visuels si mal fait)                      |
| 8   | Formulaires create/edit en double (événements ×4, publications ×2)                                                                                                                                                                                                                  | Un composant par entité                                                                                                      | ~600 lignes                                                                                       | Moyen ; à faire plus tard                                     |
| 9   | `sanitize-html` sur titre/contenu des publications                                                                                                                                                                                                                                  | Le supprimer : React échappe déjà le texte. Ça corrige aussi le bug `&amp;`                                                  | Un paquet et un bug en moins                                                                      | Faible tant que tu n'affiches jamais du HTML brut             |
| 10  | `react-country-state-city`                                                                                                                                                                                                                                                          | Liste statique de pays + ville en texte libre                                                                                | Bundle plus léger, filtres cohérents                                                              | Les villes ne sont plus normalisées (acceptable pour un MVP)  |
| 11  | Photos supprimées à la fois par le hook et le controller ; chemins d'images « legacy »                                                                                                                                                                                              | Garder le hook, utiliser `photos[0]` directement                                                                             | Moins de code                                                                                     | Faible                                                        |
| 12  | Trois statuts pour la visibilité (`status`, `isArchived`, `expirationDate`)                                                                                                                                                                                                         | Pas de changement de schéma ; une fonction unique `visibleAds`                                                               | Une règle, un endroit                                                                             | Nul                                                           |
| 13  | Deux systèmes d'icônes                                                                                                                                                                                                                                                              | Un seul (`@mui/icons-material`)                                                                                              | Moins de requêtes externes                                                                        | Faible, à faire progressivement                               |

**Si tu veux un MVP vraiment simple, une décision t'attend :** annonces + comptes + profil + contact vendeur + modération admin. Actualités, événements, publications et forum seraient **masqués de la Navbar** (pas supprimés). Cela retire environ la moitié des bugs de la liste. Les routes backend restent protégées, tu les rouvriras plus tard.

---

## 11. Mise en production

**OBLIGATOIRE AVANT LA MISE EN LIGNE**

- Fermer la faille des messages et remplacer la messagerie par un email au vendeur.
- « Mot de passe oublié » + renvoi de l'email de vérification.
- Liste publique : uniquement les annonces actives, non expirées, non archivées ; plus d'emails de comptes dans l'API.
- Filtres et recherche qui fonctionnent.
- Retirer tous les faux chiffres, témoignages, badges et boutons décor.
- Politique de confidentialité **complète** : `Policy.jsx` n'affiche que 2 sections sur 7, les sections 3 à 6 (utilisation, protection, cookies, modifications) sont absentes. Il faut aussi les CGU (mentionnées à l'inscription), des mentions légales et une vraie adresse de contact. Prévois une relecture juridique : je ne suis pas juriste.
- Un moyen réel de signaler une annonce (un simple email vers un admin suffit pour démarrer).
- Base déployable sur une base vide (voir §5) et **sauvegardes activées** chez ton fournisseur, avec un test de restauration.
- Front et API sur le même domaine (cookie `SameSite=Lax`), `trust proxy`, CORS strict, helmet, rate limit général ❓.
- Variables d'environnement de prod vérifiées : `JWT_SECRET` long, `CLIENT_URL` (sans lui, les liens d'email deviennent `undefined/verify-account/…`), région Mailgun, Cloudinary.
- Test complet **sur téléphone, sur l'URL de production**, y compris un rechargement sur `/ads/12`.
- Garde-fou sur `cleanDb.js` / `seedData.js`.

**FORTEMENT RECOMMANDÉ**

- Pagination serveur.
- `errorHandler` global avec un format d'erreur unique `{ message }`.
- Confirmations de suppression, indicateur de chargement, vrai état d'erreur quand l'API ne répond pas.
- Pré-remplir email et téléphone dans le formulaire d'annonce.
- Modération du forum si tu le gardes (suppression de réponses/sujets).
- Anonymiser les données à la suppression d'un compte.
- Surveillance : UptimeRobot (gratuit) + Sentry gratuit.
- `.env.example` et un README court.

**PLUS TARD** : favoris, notifications email, messagerie interne, SEO, multi-devises, traductions, tests automatisés, CAPTCHA, export RGPD, connexion Google, 2FA.

---

## 12. Notes

| Domaine          | Note       |
| ---------------- | ---------- |
| Sécurité         | **45**/100 |
| Backend          | **62**/100 |
| Frontend         | **55**/100 |
| Base de données  | **65**/100 |
| UX/UI            | **55**/100 |
| Performance      | **55**/100 |
| Architecture     | **60**/100 |
| Production       | **30**/100 |
| **SCORE GLOBAL** | **52**/100 |

**Pourquoi pas plus.** Le projet fonctionne en local sur le chemin « heureux ». Un vrai utilisateur le casserait en quelques minutes :

- un email perdu l'enferme, sans « mot de passe oublié » ni renvoi ;
- le filtre par catégorie ne renvoie rien ;
- le message envoyé au vendeur n'arrive jamais ;
- sur iPhone, il peut ne pas rester connecté ;
- les annonces expirées ou masquées restent visibles ;
- on ne peut pas déployer sur une base vide.

**Pourquoi pas moins.** Aucune de ces corrections ne demande de refaire l'architecture. Les P0 ci-dessous représentent environ 3 à 4 jours de travail guidé.

---

## 13. Plan de correction priorisé

**PHASE 1 — BLOQUANTS**

| Tâche                                                                                                            | Prio | Difficulté | Temps             | Fichiers                                                                              | Pourquoi                                   |
| ---------------------------------------------------------------------------------------------------------------- | ---- | ---------- | ----------------- | ------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1.1 Vérifier que l'utilisateur est participant avant de lire/écrire un message                                   | P0   | Facile     | 30 min            | `messageController.js`                                                                | Faille IDOR                                |
| 1.2 Remplacer « contacter » par un email au vendeur                                                              | P0   | Moyenne    | 2–3 h             | `messageController.js`, `emailService.js`, `AdDetailPage.jsx`                         | Le vendeur ne reçoit rien                  |
| 1.3 Liste/détail publics : actives, non expirées, non archivées ; retirer `user.email` et le téléphone du compte | P0   | Facile     | 1 h               | `advController.js`                                                                    | Annonces cachées visibles + fuite d'emails |
| 1.4 Base déployable sur base vide ; vérifier que le service d'expiration existe                                  | P0   | Moyenne    | 3 h               | `migrations/`, `package.json`, `services/`                                            | `npm start` plante sinon                   |
| 1.5 Mot de passe oublié + renvoi du lien de vérification                                                         | P0   | Moyenne    | 4 h               | `authController.js`, `authRouter.js`, `emailService.js`, `Login.jsx`, nouvelles pages | Comptes irrécupérables                     |
| 1.6 Réparer filtres et recherche (catégories venant de l'API, `ad.city`, barre visible, paramètres d'URL)        | P0   | Moyenne    | 3 h               | `Ads.jsx`, `Home.jsx`                                                                 | Cœur du site                               |
| 1.7 Retirer les faux contenus et boutons décor                                                                   | P0   | Facile     | 2 h               | `Landing`, `Home`, `About`, `Ads`, `AdDetailPage`, `Login`, `Dashboard`, `Events*`    | Confiance, honnêteté                       |
| 1.8 Politique de confidentialité complète, CGU, vraie page contact                                               | P0   | Moyenne    | 3 h + texte légal | `Policy.jsx`, `Contacts.jsx`                                                          | Légal                                      |

**PHASE 2 — SÉCURITÉ**

| Tâche                                                                                                                    | Prio | Difficulté | Temps  | Fichiers                                 | Pourquoi                               |
| ------------------------------------------------------------------------------------------------------------------------ | ---- | ---------- | ------ | ---------------------------------------- | -------------------------------------- |
| 2.1 Vérifier `index.js` : CORS strict, helmet, `trust proxy`, taille du body ; cookie `SameSite=Lax` avec domaine commun | P0   | Facile     | 1 h    | `index.js`, `authController.js`          | iPhone, CSRF, rate limit sur IP réelle |
| 2.2 Rate limit général + plus strict sur les créations                                                                   | P1   | Facile     | 1 h    | `rateLimiters.js`, routers               | Spam                                   |
| 2.3 Liste blanche des champs de publications                                                                             | P1   | Facile     | 20 min | `publicationController.js`               | Changement de propriétaire possible    |
| 2.4 Email en minuscules + `isEmail` (et normaliser l'existant)                                                           | P1   | Facile     | 45 min | `authController.js`, `user.js`           | Échecs de connexion sur mobile         |
| 2.5 Uploads : 5 Mo, jpeg/png/webp, total ≤ 5 photos                                                                      | P1   | Facile     | 45 min | `multer.js`, `advController.js`          | Mémoire, SVG                           |
| 2.6 Garde-fou sur `cleanDb.js` et `seedData.js`                                                                          | P1   | Facile     | 20 min | `scripts/`                               | Perte de données                       |
| 2.7 `errorHandler` global avec réponse `{ message }`                                                                     | P2   | Moyenne    | 2 h    | `index.js`, controllers, front           | Fuites d'erreurs, toasts inutiles      |
| 2.8 Re-vérifier le changement d'email, exiger `agreeToTerms` côté serveur, anonymiser à la suppression de compte         | P2   | Moyenne    | 3 h    | `userController.js`, `authController.js` | RGPD/sécurité                          |
| 2.9 `/users/stats` réservé aux admins, exclure les tokens des réponses                                                   | P2   | Facile     | 20 min | `userRouter.js`, `userController.js`     | Fuites mineures                        |

**PHASE 3 — BUGS**

| Tâche                                                                                                                                                   | Prio | Difficulté | Temps  | Fichiers                                                                    | Pourquoi                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---------- | ------ | --------------------------------------------------------------------------- | ------------------------------------ |
| 3.1 Profil : `""` → `null` pour le téléphone ; ville/`location`                                                                                         | P1   | Facile     | 45 min | `userController.js`, `Profile.jsx`                                          | Enregistrement refusé                |
| 3.2 Modification d'annonce : sauvegarder la sous-catégorie, l'ordre des photos, format du téléphone ; supprimer sur Cloudinary **après** la mise à jour | P1   | Moyenne    | 2 h    | `advController.js`, `EditAdPage.jsx`                                        | Champs perdus                        |
| 3.3 Création : catégorie sans sous-catégorie ; pré-remplir email/téléphone                                                                              | P1   | Facile     | 1 h    | `CreateAdPage.jsx`                                                          | Blocage possible                     |
| 3.4 `createdBy` → `userId`                                                                                                                              | P1   | Facile     | 10 min | `PublicationDetail.jsx`, `EventDetail.jsx`                                  | Bouton « modifier » absent           |
| 3.5 Liens liste → détail (publications, événements) ; tri des événements ; événement du jour                                                            | P1   | Facile     | 1 h    | `Publications.jsx`, `Events.jsx`, `eventController.js`                      | Pages inaccessibles                  |
| 3.6 Supprimer sanitize-html                                                                                                                             | P1   | Facile     | 30 min | `publicationController.js`, `utils/sanitize.js`                             | `&amp;` visible                      |
| 3.7 Création d'événement dashboard, ajout d'admin (nom vide), `createUser` non vérifié, page de vérification déjà utilisée                              | P2   | Facile     | 1 h    | `EventsManager.jsx`, `adminController.js`, `Admin.jsx`, `VerifyAccount.jsx` | Actions qui échouent ou ne font rien |
| 3.8 Retour visuel des suppressions du profil (`fetcher.data`)                                                                                           | P2   | Facile     | 30 min | `Profile.jsx`                                                               | Aucun message                        |
| 3.9 Syntaxe `Grid` de l'édition d'événement                                                                                                             | P3   | Facile     | 15 min | `dashboard/EditEvent.jsx`                                                   | Mise en page                         |

**PHASE 4 — SIMPLIFICATION** (voir §10)

| Tâche                                                                 | Prio | Difficulté | Temps | Fichiers                                 | Pourquoi          |
| --------------------------------------------------------------------- | ---- | ---------- | ----- | ---------------------------------------- | ----------------- |
| 4.1 Supprimer le code commenté                                        | P2   | Facile     | 1 h   | ~15 fichiers                             | Lisibilité        |
| 4.2 Supprimer les fichiers morts et dépendances inutiles (`depcheck`) | P2   | Facile     | 1 h   | cf. §10                                  | Moins de bruit    |
| 4.3 Réduire Admin, Dashboard, Stats, Posts                            | P2   | Facile     | 1–2 h | cf. §10                                  | Fausses fonctions |
| 4.4 Fichier de thème partagé                                          | P2   | Moyenne    | 3–4 h | pages front                              | −1 500 lignes     |
| 4.5 Remplacer `react-country-state-city`                              | P3   | Moyenne    | 2 h   | `Register`, `CreateAdPage`, `EditAdPage` | Bundle, cohérence |
| 4.6 Fusionner les formulaires create/edit                             | P3   | Moyenne    | 4 h   | `profile/*`                              | Doublons          |

**PHASE 5 — UX/UI**

| Tâche                                                             | Prio | Difficulté | Temps  | Fichiers          | Pourquoi                  |
| ----------------------------------------------------------------- | ---- | ---------- | ------ | ----------------- | ------------------------- |
| 5.1 Barre de chargement de navigation + vrai message d'erreur API | P1   | Facile     | 1 h    | layouts, loaders  | Serveur lent ou en veille |
| 5.2 Confirmation avant suppression (dashboard)                    | P2   | Facile     | 1 h    | managers          | Erreurs irréversibles     |
| 5.3 Redirection après création vers « Mes annonces »              | P2   | Facile     | 30 min | actions du profil | Clarté                    |
| 5.4 Contrastes et tailles de texte                                | P2   | Facile     | 1 h    | thème             | Accessibilité             |
| 5.5 Libellés uniformes (français → ukrainien)                     | P3   | Facile     | 30 min | managers          | Cohérence                 |

**PHASE 6 — PERFORMANCE**

| Tâche                                         | Prio | Difficulté | Temps | Fichiers                            | Pourquoi            |
| --------------------------------------------- | ---- | ---------- | ----- | ----------------------------------- | ------------------- |
| 6.1 Pagination + recherche côté serveur       | P1   | Moyenne    | 4 h   | `advController.js`, `Ads.jsx`       | Passage à l'échelle |
| 6.2 Listes sans contenu complet (extraits)    | P2   | Facile     | 1 h   | controllers news/publications/forum | Poids des réponses  |
| 6.3 Lazy loading des routes dashboard/profile | P2   | Facile     | 1 h   | `App.jsx`                           | Chargement initial  |
| 6.4 Miniatures Cloudinary                     | P2   | Facile     | 1 h   | petit utilitaire + listes           | Images lourdes      |
| 6.5 Polices hébergées par toi                 | P3   | Facile     | 1 h   | `index.html`                        | RGPD, vitesse       |

**PHASE 7 — PRODUCTION**

| Tâche                                                                                    | Prio | Difficulté | Temps  | Fichiers              | Pourquoi                     |
| ---------------------------------------------------------------------------------------- | ---- | ---------- | ------ | --------------------- | ---------------------------- |
| 7.1 Variables de prod, `.env.example`, domaine/HTTPS                                     | P0   | Facile     | 1 h    | config                | Liens d'email, cookie        |
| 7.2 Mailgun : domaine, région EU/US, SPF/DKIM, test réel                                 | P0   | Facile     | 1 h    | `config/mailgun.js`   | Emails de vérification       |
| 7.3 Sauvegardes + test de restauration                                                   | P0   | Facile     | 1 h    | hébergeur             | Perte de données             |
| 7.4 Test complet sur téléphone avec l'URL de prod                                        | P0   | Facile     | 2 h    | —                     | Cas réels                    |
| 7.5 Surveillance (UptimeRobot, Sentry)                                                   | P1   | Facile     | 1–2 h  | —                     | Savoir quand ça casse        |
| 7.6 README + procédure du premier admin (`ENABLE_ADMIN_BOOTSTRAP`, à désactiver ensuite) | P1   | Facile     | 30 min | `README`, `config.js` | Éviter une prise de contrôle |

---

## Pour continuer

Pour avancer, j'ai besoin que tu me dises **« OK »** pour démarrer par la tâche **1.1** (une seule petite modification, expliquée pas à pas, avec le test à faire). Dis-moi aussi si tu veux garder actualités, événements, publications et forum dans le MVP ou les masquer pour l'instant. Si tu peux m'envoyer `backend/index.js`, `services/adExpirationSettingsService.js`, `customFetch.js`, `AuthContext.jsx` et `frontend/package.json`, je pourrai lever les points marqués ❓.

Je peux aussi mettre cet audit dans un fichier `AUDIT.md` pour que tu le retrouves pendant les corrections.
