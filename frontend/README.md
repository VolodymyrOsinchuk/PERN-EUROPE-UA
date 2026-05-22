# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Voici 10 NewsAPI liées à l’Ukraine avec la langue ukrainienne, d’après les sources trouvées :

NewsAPI Ukraine top headlines — filtre pays ua pour les actualités d’Ukraine.

NewsAPI Ukraine breaking news — articles et titres en temps réel depuis l’Ukraine.

NewsData.io Ukraine world news — endpoint avec country=ua et category=world.

NewsData.io Ukraine top news — endpoint avec country=ua et category=top.

World News API Ukraine news — supporte le code pays ua.

World News API langue ukrainienne — filtre de langue uk pour les contenus en ukrainien.

GNews Ukraine top headlines — endpoint country=ua.

GNews Ukraine nation news — catégorie nation pour l’Ukraine.

GNews Ukraine world news — catégorie world pour l’Ukraine.

NewsAPI sources Ukraine — agrégateurs et sources d’actualité ukrainiennes listées dans des bases de sources.

Architecture
Pour un projet PERN, garde ce flux simple :

Un cron job appelle l’API de news toutes les X minutes/heures.

Le backend normalise et déduplique les articles.

Sequelize enregistre les nouvelles entrées dans PostgreSQL.

React appelle ton API REST locale pour afficher la liste.

Choix de l’API
Pour des news sur les Ukrainiens en Europe, tu peux partir sur une requête de type :

country=ua pour l’Ukraine,

language=uk si tu veux du contenu en ukrainien,

ou source-country=eu si tu veux des news liées à l’Europe.

Si ton besoin est vraiment “les Ukrainiens en Europe”, le mieux est souvent une recherche par mots-clés du type Ukrainians in Europe, refugees, diaspora, migration, puis filtrer par langue ou pays selon l’API choisie.

Backend Node
Tu peux créer une route de test pour lancer la synchro manuellement, puis la même logique dans le cron. Une structure simple :

js
// services/newsService.js
import axios from "axios";

export async function fetchNews() {
const url = "https://newsapi.org/v2/top-headlines?country=ua&apiKey=YOUR_KEY";
const { data } = await axios.get(url);
return data.articles;
}
Puis dans le cron :

js
import cron from "node-cron";
import { fetchNews } from "./services/newsService.js";
import { News } from "./models/index.js";

cron.schedule("0 _/6 _ \* \*", async () => {
try {
const articles = await fetchNews();

    for (const article of articles) {
      await News.findOrCreate({
        where: { url: article.url },
        defaults: {
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          imageUrl: article.urlToImage,
          publishedAt: article.publishedAt,
          sourceName: article.source?.name,
        },
      });
    }

} catch (error) {
console.error("News sync failed:", error);
}
});
Le principe findOrCreate évite les doublons, ce qui est important pour les cron jobs.

Modèle Sequelize
Un modèle minimal peut ressembler à ça :

js
const News = sequelize.define("News", {
title: DataTypes.STRING,
description: DataTypes.TEXT,
content: DataTypes.TEXT,
url: { type: DataTypes.STRING, unique: true },
imageUrl: DataTypes.STRING,
publishedAt: DataTypes.DATE,
sourceName: DataTypes.STRING,
});
Le champ url unique est utile pour bloquer les doublons lors des récupérations répétées.

Route API
Expose ensuite tes news via Express :

js
app.get("/api/news", async (req, res) => {
const news = await News.findAll({
order: [["publishedAt", "DESC"]],
limit: 100,
});

res.json(news);
});
Ça te permet de garder React simple et de centraliser la logique métier côté serveur.

React
Dans React, il suffit d’appeler ton backend :

js
useEffect(() => {
fetch("/api/news")
.then((res) => res.json())
.then(setNews)
.catch(console.error);
}, []);
Ensuite tu affiches les cartes d’articles avec titre, source, date et lien. Cette approche est plus propre que d’appeler l’API de news directement depuis le front, surtout pour protéger ta clé API.

Points importants
Mets la clé API dans .env, jamais dans React.

Ajoute une gestion d’erreur et des logs dans le cron.

Pense à la déduplication par url ou title + publishedAt.

Si tu déploies sur plusieurs serveurs, il faut éviter que plusieurs cron jobs tournent en même temps.

Je peux te donner maintenant un squelette complet PERN prêt à copier-coller avec :

modèle Sequelize,

cron job,

route Express,

composant React,

et fichier .env.

Voici un guide complet pour connecter ton stack PERN à une API d'actualités avec un cron job et un affichage React.

Architecture globale
NewsAPI (ou GNews) → Node.js Cron Job → PostgreSQL (Sequelize) → Express API → React

1. Choix de l'API d'actualités
   NewsAPI (newsapi.org) est le plus simple, gratuit jusqu'à 100 req/jour.
   GNews.io est une bonne alternative avec un tier gratuit généreux.
   bashnpm install axios node-cron sequelize pg pg-hstore dotenv

2. Modèle Sequelize — models/Article.js
   jsconst { DataTypes } = require('sequelize');
   const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
id: {
type: DataTypes.UUID,
defaultValue: DataTypes.UUIDV4,
primaryKey: true,
},
title: { type: DataTypes.STRING, allowNull: false },
description: { type: DataTypes.TEXT },
url: { type: DataTypes.STRING, unique: true }, // évite les doublons
urlToImage: { type: DataTypes.STRING },
source: { type: DataTypes.STRING },
publishedAt: { type: DataTypes.DATE },
content: { type: DataTypes.TEXT },
}, {
tableName: 'articles',
timestamps: true,
});

module.exports = Article;

3. Service de récupération — services/newsFetcher.js
   jsconst axios = require('axios');
   const Article = require('../models/Article');

const QUERY = 'Ukrainiens Europe OR réfugiés ukrainiens OR Ukraine diaspora';

async function fetchAndStoreNews() {
try {
const { data } = await axios.get('https://newsapi.org/v2/everything', {
params: {
q: QUERY,
language: 'fr', // ou 'en'
sortBy: 'publishedAt',
pageSize: 20,
apiKey: process.env.NEWS_API_KEY,
},
});

    const articles = data.articles.filter(a => a.title && a.url);

    // bulkCreate avec ignoreDuplicates pour l'idempotence
    const created = await Article.bulkCreate(
      articles.map(a => ({
        title:       a.title,
        description: a.description,
        url:         a.url,
        urlToImage:  a.urlToImage,
        source:      a.source?.name,
        publishedAt: a.publishedAt,
        content:     a.content,
      })),
      { ignoreDuplicates: true }
    );

    console.log(`[newsFetcher] ${created.length} nouveaux articles insérés`);

} catch (err) {
console.error('[newsFetcher] Erreur:', err.message);
}
}

module.exports = fetchAndStoreNews;

4. Cron Job — jobs/newsCron.js
   jsconst cron = require('node-cron');
   const fetchAndStoreNews = require('../services/newsFetcher');

// Toutes les 6 heures : '0 _/6 _ \* _'
// Toutes les heures : '0 _ \* \* _'
// Toutes les minutes : '_ \* \* \* \*' (test seulement)

const startNewsCron = () => {
console.log('[Cron] Démarrage du job de news...');

// Exécution immédiate au démarrage
fetchAndStoreNews();

// Puis toutes les 6 heures
cron.schedule('0 _/6 _ \* \*', () => {
console.log(`[Cron] Récupération des news — ${new Date().toISOString()}`);
fetchAndStoreNews();
});
};

module.exports = startNewsCron;

5. Routes Express — routes/articles.js
   jsconst express = require('express');
   const router = express.Router();
   const { Op } = require('sequelize');
   const Article = require('../models/Article');

// GET /api/articles?page=1&limit=12&search=...
router.get('/', async (req, res) => {
const { page = 1, limit = 12, search = '' } = req.query;
const offset = (page - 1) \* limit;

const where = search
? { title: { [Op.iLike]: `%${search}%` } }
: {};

const { count, rows } = await Article.findAndCountAll({
where,
order: [['publishedAt', 'DESC']],
limit: parseInt(limit),
offset: parseInt(offset),
});

res.json({
total: count,
totalPages: Math.ceil(count / limit),
currentPage: parseInt(page),
articles: rows,
});
});

module.exports = router;

6. Point d'entrée — server.js
   jsrequire('dotenv').config();
   const express = require('express');
   const sequelize = require('./config/database');
   const articleRoutes = require('./routes/articles');
   const startNewsCron = require('./jobs/newsCron');

const app = express();
app.use(express.json());
app.use('/api/articles', articleRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
console.log('[DB] Connectée et synchronisée');
startNewsCron(); // ← lance le cron après la sync DB
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));
});

7. Côté React — hooks/useArticles.js + composant
   js// hooks/useArticles.js
   import { useState, useEffect } from 'react';
   import axios from 'axios';

export function useArticles({ page = 1, search = '' } = {}) {
const [data, setData] = useState({ articles: [], total: 0, totalPages: 0 });
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
setLoading(true);
axios.get('/api/articles', { params: { page, limit: 12, search } })
.then(res => setData(res.data))
.catch(err => setError(err.message))
.finally(() => setLoading(false));
}, [page, search]);

return { ...data, loading, error };
}
jsx// components/NewsGrid.jsx
import { useState } from 'react';
import { useArticles } from '../hooks/useArticles';

export default function NewsGrid() {
const [page, setPage] = useState(1);
const [search, setSearch] = useState('');
const { articles, totalPages, loading } = useArticles({ page, search });

return (

<div>
<input
placeholder="Rechercher..."
value={search}
onChange={e => { setSearch(e.target.value); setPage(1); }}
/>

      {loading ? <p>Chargement...</p> : (
        <div className="grid">
          {articles.map(article => (
            <article key={article.id}>
              {article.urlToImage && <img src={article.urlToImage} alt="" />}
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <small>{article.source} — {new Date(article.publishedAt).toLocaleDateString('fr-FR')}</small>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Lire →</a>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i + 1)} disabled={page === i + 1}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>

);
}

8. Variables d'environnement — .env
   envNEWS_API_KEY=ta_clé_newsapi
   DATABASE_URL=postgresql://user:password@localhost:5432/mabase
   PORT=5000

Points clés à retenir
SujetDétailDoublonsunique: true sur url + ignoreDuplicates: true dans bulkCreateFréquence cron0 _/6 _ \* \* = toutes les 6h, respecte le quota NewsAPI gratuitIdempotenceLe job peut tourner N fois sans créer de doublonsProxy ReactAjoute "proxy": "http://localhost:5000" dans package.json ReactProductionRemplace node-cron par pg-boss ou un worker séparé sur un serveur dédié
Tu veux que je génère le composant React complet avec un design soigné, ou un exemple avec GNews à la place de NewsAPI ?Vous avez dit : fait moi la liste des 10 NewsAPI en langue ukrainienfait moi la liste des 10 NewsAPI en langue ukrainien19 maiClaude a répondu : Voici la liste des 10 APIs de news qui supportent la langue ukrainienne (uk), avec leurs spécificités :Web recherchéWeb recherchéVoici la liste des 10 APIs de news qui supportent la langue ukrainienne (uk), avec leurs spécificités :

⚠️ Note importante sur les codes
uk = code ISO 639-1 de la langue ukrainienne
ua = code ISO 3166-1 du pays Ukraine
— Ne pas les confondre dans tes paramètres d'API ! TECHNOLEX

Les 10 APIs avec support ukrainien (language=uk)
#APITier gratuitLangue ukParamètre1NewsAPI.org100 req/j✅ Ouilanguage=uk2NewsData.io200 req/j✅ Ouilanguage=uk3GNews.io100 req/j✅ Ouilang=uk4Mediastack500 req/mois✅ Ouilanguages=uk5World News API1000 req/mois✅ Ouilanguage=uk6TheNewsAPI.com100 req/j✅ Ouilanguage=uk7Currents API600 req/j✅ Ouilanguage=uk8SerpAPI (Google News)100 req/mois✅ Ouihl=uk&gl=ua9EventRegistry (AYLIEN)100 req/j✅ Ouilang=ukr10GDELT Project♾️ Illimité (gratuit)✅ Ouisourcelang=ukr

Détail des 3 meilleures pour ton cas
🥇 NewsData.io — recommandé
Le paramètre pays est country=ua et pour la langue ukrainienne c'est language=uk. Exemple : https://newsdata.io/api/1/latest?country=ua&language=uk&apikey=CLE NewsData.io
jsaxios.get('https://newsdata.io/api/1/latest', {
params: {
country: 'ua',
language: 'uk', // ukrainien
q: 'українці Європа', // requête en ukrainien
apikey: process.env.NEWSDATA_KEY
}
})

🥈 World News API — le plus complet
Le code langue de l'Ukraine est uk, à utiliser dans le paramètre language. Il surveille 16 sources ukrainiennes et génère plus de 600 articles par jour. L'historique remonte au 1er janvier 2022. Worldnewsapi
jsaxios.get('https://api.worldnewsapi.com/search-news', {
params: {
'source-country': 'ua',
language: 'uk',
text: 'українці Європа',
'api-key': process.env.WORLDNEWS_KEY
}
})

🥉 GDELT Project — gratuit illimité
Pas de clé API, pas de limite, accès BigQuery ou requêtes directes. Idéal pour un cron job intensif.
jsaxios.get('https://api.gdeltproject.org/api/v2/doc/doc', {
params: {
query: 'українці Європа sourcelang:ukr',
mode: 'artlist',
maxrecords: 25,
format: 'json'
}
})

Adaptation du cron job pour l'ukrainien
js// services/newsFetcher.js — version ukrainienne
const QUERY_UK = 'українці Європа OR українські біженці OR діаспора';

const { data } = await axios.get('https://newsdata.io/api/1/latest', {
params: {
q: QUERY_UK,
language: 'uk', // ← langue ukrainienne
country: 'ua',
apikey: process.env.NEWSDATA_KEY,
}
});
