# Budgeto

Application de gestion de budget personnel — Nuxt 3, Vue 3 (Composition API), Tailwind CSS et MongoDB/Mongoose. Pensée mobile-first avec une mise en page desktop, multi-utilisateur (chacun a son propre compte et ses propres données).

## Fonctionnalités

- **Cycles mensuels** : démarrage d'un nouveau mois avec salaire, date de réception et dépenses fixes à valider.
- **Journal** : dépenses spontanées et épargne, ajout rapide en ligne, regroupement par jour, historique dépliable.
- **Revenus** : suivi séparé des entrées d'argent (salaire, virements...).
- **Factures / dépenses régulières** : abonnements, assurances, remboursements, avec case à cocher pour suivre les paiements effectués.
- **Projets d'épargne** : cagnottes avec objectif, progression, icône et couleur personnalisées.
- **Tableau de bord** : vue d'ensemble du mois (revenus/dépenses/factures/épargne), jauge circulaire du reste à dépenser, répartition des sorties, courbe de rythme de dépense, activité récente.
- **Paramètres** : gestion des catégories de dépenses, nom et mot de passe du compte.
- **Comptes multi-utilisateurs** : chaque personne crée son propre compte ; les données de chacun sont totalement isolées.

## Stack technique

| Domaine | Choix |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com/) (Vue 3, Composition API, `<script setup>`) |
| Style | [Tailwind CSS](https://tailwindcss.com/) |
| Base de données | MongoDB via [Mongoose](https://mongoosejs.com/) |
| Authentification | Sessions par cookie signé ([`h3`](https://h3.unjs.io/) `useSession`), mots de passe hashés avec `bcryptjs` |
| Icônes | [lucide-vue-next](https://lucide.dev/) |
| Déploiement cible | Vercel (routes `/server/api` en fonctions serverless) |

## Démarrage

### Prérequis

- Node.js 18+
- Une base MongoDB accessible (Atlas ou instance locale)

### Installation

```bash
npm install
```

### Configuration

Copie `.env.example` en `.env` et renseigne les deux variables :

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | Chaîne de connexion vers ta base MongoDB (ex. cluster Atlas). L'app se connecte à une base nommée `budgeto`. |
| `SESSION_SECRET` | Chaîne aléatoire longue utilisée pour signer les cookies de session. Génère-en une avec `openssl rand -hex 32` ou `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. **Change-la après un redémarrage** : les variables d'environnement ne sont lues qu'au démarrage du serveur, pas rechargées à chaud. |

Ces deux variables sont obligatoires — le serveur renvoie une erreur explicite si l'une d'elles manque.

### Lancer en développement

```bash
npm run dev
```

L'application est accessible sur http://localhost:3000. Crée un compte depuis `/register` : la première personne à s'inscrire sur une base de données qui contient déjà des données (créées avant la mise en place des comptes) en hérite automatiquement, sans rien supprimer.

## Scripts disponibles

```bash
npm run dev       # serveur de développement
npm run build     # build de production (Nitro)
npm run generate  # génération statique
npm run preview   # prévisualiser un build de production en local
```

Aucune suite de tests ni script de lint n'est configurée à ce jour.

## Déploiement

Prévu pour [Vercel](https://vercel.com/) : les routes `/server/api` s'exécutent en mode serverless et se connectent à MongoDB via `MONGODB_URI`. Dans les paramètres du projet Vercel, définis `MONGODB_URI` et `SESSION_SECRET` comme variables d'environnement (jamais dans le code ni dans un fichier commité).

## Structure du projet

```
components/   composants Vue, groupés par domaine (dashboard, journal, projets, parametres, layout, ui)
composables/  état partagé + logique métier (useCycle, useAuth, useProjets, useTransactions, useCategories, useTheme)
layouts/      layout principal (nav + contenu) et layout minimal pour /login et /register
middleware/   garde d'authentification globale (redirige vers /login si non connecté)
pages/        une page par route (voir tableau ci-dessous)
server/api/   endpoints Nitro (CRUD par ressource + authentification)
server/models/  schémas Mongoose
server/utils/   connexion MongoDB, utilitaires d'authentification (hash, session)
```

| Route | Contenu |
|---|---|
| `/` | Tableau de bord |
| `/journal` | Dépenses spontanées et épargne |
| `/income` | Revenus |
| `/bills` | Dépenses régulières / factures |
| `/projects` | Projets d'épargne |
| `/settings` | Catégories, nom du compte, mot de passe |
| `/login`, `/register` | Authentification |

Pour un guide d'architecture plus détaillé (conventions, pièges connus, décisions de conception), voir `CLAUDE.md` — ce fichier n'est pas versionné, il reste local.
