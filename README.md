# Atrakt Backend

Backend du projet Atrakt construit avec [Motia](https://motia.dev) - un framework backend unifié pour APIs, événements et agents IA.

## 📋 Table des matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Développement](#développement)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
  - [Docker Local](#docker-local)
  - [Coolify (Production)](#coolify-production)
- [Variables d'environnement](#variables-denvironnement)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)

## 🔧 Prérequis

- **Node.js** >= 18.x
- **npm** >= 10.x
- **Docker** (pour le déploiement)
- **PostgreSQL** (base de données)

## 📦 Installation

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd atrakt-backend
```

### 2. Installer les dépendances

```bash
npm install
```

Cette commande va automatiquement :
- Installer les packages npm
- Exécuter `motia install` (via le hook postinstall)

### 3. Configurer les variables d'environnement

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Puis éditer `.env` avec vos valeurs (voir [Variables d'environnement](#variables-denvironnement))

## 🚀 Développement

### Démarrer le serveur de développement

```bash
npm run dev
```

Le serveur démarre sur http://localhost:3000

### Accéder au Workbench

Motia fournit une interface visuelle pour tester et débugger vos steps :

🔗 **http://localhost:3000**

### Générer les types TypeScript

```bash
npm run generate-types
```

### Builder le projet

```bash
npm run build
```

Compile tous les steps et crée les bundles optimisés dans le dossier `dist/`

## 📁 Structure du projet

```
atrakt-backend/
├── steps/                      # Steps Motia (API, Events, Cron)
│   └── petstore/
│       ├── api.step.ts        # Endpoint API POST /basic-tutorial
│       ├── notification.step.ts      # Gestion des notifications
│       ├── process-food-order.step.ts # Traitement des commandes
│       └── state-audit-cron.step.ts  # Tâche planifiée
│
├── src/                       # Code source partagé
│   └── services/             # Services métier
│       └── pet-store.ts      # Service de gestion des animaux
│
├── .env                       # Variables d'environnement (ne pas committer)
├── .env.example              # Template des variables d'environnement
├── Dockerfile                # Configuration Docker pour production
├── .dockerignore            # Fichiers exclus du build Docker
├── motia-workbench.json     # Configuration du Workbench Motia
├── package.json             # Dépendances et scripts npm
├── tsconfig.json            # Configuration TypeScript
└── tutorial.tsx             # Guide tutoriel (UI)
```

## 🐳 Déploiement

### Docker Local

#### 1. Construire l'image

```bash
docker build -t atrakt-backend:test .
```

#### 2. Lancer le container

```bash
docker run -d \
  --name atrakt-backend \
  -p 3000:3000 \
  --env-file .env \
  atrakt-backend:test
```

#### 3. Vérifier les logs

```bash
docker logs -f atrakt-backend
```

#### 4. Arrêter le container

```bash
docker stop atrakt-backend
docker rm atrakt-backend
```

### Utiliser le CLI Motia (recommandé)

Motia fournit des commandes facilitant le développement avec Docker :

```bash
# Build et run en une commande
npx motia docker run

# Avec options
npx motia docker run --port 3000
```

### Coolify (Production)

#### Prérequis
- Serveur avec Coolify installé
- Repository Git accessible par Coolify

#### Configuration dans Coolify

1. **Créer un nouveau service**
   - Type : `Dockerfile`
   - Repository : Votre repo Git

2. **Build Configuration**
   - Build Context : `/`
   - Dockerfile Path : `./Dockerfile`
   - Port exposé : `3000`

3. **Variables d'environnement**

   Configurer dans l'interface Coolify :
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://...
   OPENAI_API_KEY=sk-...
   DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
   ```

4. **Déployer**

   Coolify va automatiquement :
   - Cloner le repo
   - Builder l'image Docker
   - Démarrer le container
   - Configurer le reverse proxy

#### Architecture de déploiement

```
Internet
    ↓
[Coolify Reverse Proxy]
    ↓
[Container Atrakt Backend]
    ├── Port 3000
    ├── Motia Runtime
    └── PostgreSQL (externe)
```

## 🔐 Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```bash
# OpenAI API (pour les fonctionnalités IA)
OPENAI_API_KEY=sk-proj-...

# Discord Webhook (notifications)
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# App Settings
NODE_ENV=development  # ou 'production'
PORT=3000
```

### Variables requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://...` |
| `NODE_ENV` | Environnement d'exécution | `development` ou `production` |
| `PORT` | Port du serveur | `3000` |

### Variables optionnelles

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `OPENAI_API_KEY` | Clé API OpenAI | - |
| `DISCORD_WEBHOOK_URL` | URL du webhook Discord | - |

## 🌐 API Endpoints

### POST /basic-tutorial

Créer un animal et optionnellement une commande de nourriture.

**Request Body:**
```json
{
  "pet": {
    "name": "Fluffy",
    "photoUrl": "https://example.com/photo.jpg"
  },
  "foodOrder": {
    "id": "order-123",
    "quantity": 5
  }
}
```

**Response (200):**
```json
{
  "id": "pet-uuid",
  "name": "Fluffy",
  "photoUrl": "https://example.com/photo.jpg",
  "traceId": "trace-uuid",
  "createdAt": "2025-10-04T12:00:00Z"
}
```

## 🏗️ Architecture

### Flow principal : basic-tutorial

```
1. [API] POST /basic-tutorial
   ↓
2. Créer l'animal (pet-store service)
   ↓
3. [Event] Émettre 'process-food-order' (si commande)
   ↓
4. [Event Handler] Traiter la commande
   ↓
5. [Event] Émettre 'send-notification'
   ↓
6. [Event Handler] Envoyer notification Discord
```

### Steps Motia

#### 1. API Step (`api.step.ts`)
- **Type**: HTTP API Endpoint
- **Méthode**: POST
- **Path**: `/basic-tutorial`
- **Rôle**: Point d'entrée, création d'animal, émission d'événements

#### 2. Process Food Order (`process-food-order.step.ts`)
- **Type**: Event Handler
- **Topic**: `process-food-order`
- **Rôle**: Traitement des commandes de nourriture

#### 3. Notification (`notification.step.ts`)
- **Type**: Event Handler
- **Topic**: `send-notification`
- **Rôle**: Envoi de notifications (Discord, email, etc.)

#### 4. State Audit Cron (`state-audit-cron.step.ts`)
- **Type**: Scheduled Task (Cron)
- **Schedule**: Configurable
- **Rôle**: Audit périodique de l'état du système

## 🛠️ Commandes utiles

```bash
# Développement
npm run dev                    # Démarrer en mode dev
npm run build                  # Builder le projet
npm run generate-types         # Générer les types TS
npm run clean                  # Nettoyer les dépendances et builds

# Docker (via Motia CLI)
npx motia docker setup         # Initialiser Docker
npx motia docker run           # Builder et lancer le container
npx motia docker run --help    # Voir les options

# Docker (commandes natives)
docker build -t atrakt-backend .              # Builder l'image
docker run -d -p 3000:3000 atrakt-backend    # Lancer le container
docker ps                                     # Voir les containers actifs
docker logs -f atrakt-backend                # Voir les logs
docker stop atrakt-backend                   # Arrêter le container
```

## 📚 Ressources

- [Documentation Motia](https://motia.dev/docs)
- [API Reference](https://motia.dev/docs/api-reference)
- [Motia Cloud](https://motia.dev/docs/deployment-guide/motia-cloud)
- [Discord Community](https://discord.gg/motia)

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

[Votre licence ici]

---

**Construit avec ❤️ par l'équipe Atrakt**
