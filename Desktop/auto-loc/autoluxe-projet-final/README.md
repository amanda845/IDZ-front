# 🚗 AUTOLUXE — Luxury Car Rental Platform

A full-stack luxury vehicle rental web application built with React, TypeScript, TailwindCSS, Vite, and Supabase.

---

## 🎯 MAPPING DU THÈME : "AUTO-LOC" (Location Auto de Luxe)

Ce projet respecte strictement l'architecture imposée par le cours :

| Élément | Description | Implémentation Technique |
|---------|-------------|--------------------------|
| **Table A (Utilisateurs)** | Clients qui louent des véhicules | `profiles` (id, full_name, phone) — liée à Supabase Auth |
| **Table B (Ressources)** | Voitures de luxe disponibles à la location | `vehicles` (id, brand, model, category, year, price_per_day, available, image_url) |
| **Table C (Interactions)** | Réservations avec date/statut | `reservations` (id, user_id, vehicle_id, start_date, end_date, status, license_url, created_at) |
| **Fichier (Storage)** | Photo du permis de conduire | Bucket Supabase `licenses` (privé) — stocke les scans/photos des permis au format JPG/PNG/PDF |

**Flux utilisateur complet :**  
Inscription/Connexion (Auth) → Consultation du catalogue de véhicules (Table B) → Création d'une réservation avec upload du permis (Table C + Storage) → Visualisation des réservations personnelles dans le Dashboard (RLS activé).

---

## 🏛️ ANALYSE D'ARCHITECTURE CLOUD : Pourquoi Serverless ?

### 1️⃣ Vercel + Supabase vs Serveur Classique : L'Argument Financier (OPEX/CAPEX)

**Approche Traditionnelle (CAPEX)** : Un serveur physique local exige un investissement initial massif : achat de matériel (serveurs rack, routeurs, onduleurs), infrastructure de refroidissement, installation électrique renforcée, et espace physique dédié. Ces dépenses en capital (CAPEX) sont figées avant même le premier utilisateur. Pour Autoluxe, cela signifierait investir 10 000+ euros dès le jour 1, sans savoir si le service trouvera son marché.

**Approche Serverless (OPEX)** : Avec Vercel et Supabase, nous payons uniquement ce que nous consommons (dépenses opérationnelles). Supabase offre 500 Mo de base de données et 1 Go de stockage gratuits, amplement suffisants pour un MVP. Vercel permet 100 Go de bande passante mensuelle gratuitement. En phase de lancement, notre coût mensuel réel est de **0 euro**. Si Autoluxe décolle et atteint 10 000 utilisateurs, nous passons progressivement à un plan payant (~25$/mois pour Supabase Pro, ~20$/mois pour Vercel) — toujours infiniment moins qu'un data center local qui nécessiterait un serveur dédié à 200€/mois minimum, sans compter la maintenance.

**Verdict** : Le modèle OPEX élimine le risque financier au démarrage et aligne les coûts sur la croissance réelle.

### 2️⃣ Scalabilité Automatique : Vercel vs Data Center Physique

**Data Center Physique** : Imaginons qu'Autoluxe devienne viral un week-end (promotion sur les réseaux sociaux, article de presse). Avec un serveur local, trois scénarios catastrophiques :
- Le serveur surchauffe → panne totale → perte de clients
- Le trafic sature la bande passante → site ralenti/inaccessible
- Pour anticiper, nous devions *sur-dimensionner* (acheter un serveur 10× plus puissant "au cas où"), gaspillant 90% de sa capacité en temps normal

De plus, l'infrastructure physique impose des contraintes matérielles : climatisation 24/7 (pour éviter la surchauffe des processeurs), redondance électrique (onduleurs, groupes électrogènes), et intervention humaine pour ajouter de la RAM ou des disques durs.

**Vercel (Serverless)** : Chaque déploiement est automatiquement distribué sur un CDN global (edge network). Si 1 000 utilisateurs algériens accèdent simultanément au site, Vercel réplique instantanément l'application sur plusieurs serveurs proches d'Alger. Si le trafic retombe à 10 utilisateurs, les ressources se libèrent automatiquement. Aucune intervention humaine. Aucun gaspillage.

Supabase fonctionne de même : la base PostgreSQL scale verticalement (plus de CPU/RAM) et horizontalement (réplication read-only) sans qu'on touche une ligne de code. Le storage s'adapte à la demande.

**Verdict** : La scalabilité "élastique" du cloud élimine le sur-dimensionnement et garantit la disponibilité 24/7 sans équipe DevOps.

### 3️⃣ Données Structurées vs Non-Structurées dans Autoluxe

**Données Structurées (PostgreSQL)** :  
Tout ce qui peut être organisé en tables relationnelles avec des types définis :
- Les profils utilisateurs (texte : nom, téléphone ; UUID : identifiant)
- Les véhicules (texte : marque/modèle ; numérique : prix ; booléen : disponible)
- Les réservations (dates : start_date/end_date ; statut : enum 'pending'/'confirmed'/'cancelled')

Ces données doivent supporter des requêtes complexes (ex : "Trouver toutes les voitures disponibles entre le 15 et le 20 mai sous 300€/jour"). SQL excelle dans ce cas.

**Données Non-Structurées (Storage)** :  
Les fichiers binaires impossibles à modéliser en colonnes :
- Photos des permis de conduire (JPG/PNG) : chaque fichier a une taille et un format différents
- Potentiellement : photos des voitures, contrats PDF signés, vidéos de présentation

Ces fichiers sont stockés dans le bucket `licenses` avec seulement leur URL référencée dans la table structurée (`reservations.license_url`). Impossible de "requêter" le contenu d'une image avec SQL — on stocke donc l'objet brut et on l'indexe via une clé étrangère.

**Verdict** : Supabase combine PostgreSQL (structuré) et Storage (non-structuré) en un seul service, évitant de jongler entre AWS S3, RDS, et EC2.

---

## 📋 TABLE OF CONTENTS

1. [Mapping du Thème](#-mapping-du-thème--auto-loc-location-auto-de-luxe)
2. [Analyse d'Architecture Cloud](#️-analyse-darchitecture-cloud--pourquoi-serverless-)
3. [Prerequisites](#-step-0-prerequisites-install-these-first)
4. [Project Setup](#-step-1-get-the-project-running-locally)
5. [Supabase Setup](#-step-2-supabase-setup-database--auth)
6. [Environment Variables](#-step-3-connect-your-app-to-supabase)
7. [Run Locally](#-step-4-run-the-app-locally)
8. [Deploy to Vercel](#-step-5-deploy-to-vercel)
9. [Push to GitHub](#-step-6-push-to-github)
10. [GitHub Workflow](#-step-7-how-to-work-with-github-daily)
11. [Troubleshooting](#-troubleshooting)

---

## ✅ STEP 0: Prerequisites — Install These First

You need these tools installed on your computer before anything else.

### 1. Install Node.js (version 18 or higher)

Go to: https://nodejs.org
Download the **LTS** version and install it.

Verify installation:
```bash
node --version   # should show v18.x.x or higher
npm --version    # should show 9.x.x or higher
```

### 2. Install Git

Go to: https://git-scm.com/downloads
Download and install for your operating system.

Verify installation:
```bash
git --version   # should show git version 2.x.x
```

### 3. Create accounts (free)

- **Supabase**: https://supabase.com (click "Start for free")
- **GitHub**: https://github.com (click "Sign up")
- **Vercel**: https://vercel.com (click "Sign up" — use your GitHub account)

---

## 🛠 STEP 1: Get the Project Running Locally

### 1.1 — Extract the project

If you downloaded this as a ZIP file, extract it to a folder on your computer.
Example: `C:\Projects\autoluxe` (Windows) or `~/Projects/autoluxe` (Mac/Linux)

### 1.2 — Open a terminal in the project folder

**Windows**: Open the `autoluxe` folder → hold Shift + right-click → "Open PowerShell window here"
**Mac**: Open Terminal → type `cd ~/Projects/autoluxe` → press Enter
**VS Code**: Open the folder in VS Code → press `` Ctrl+` `` (backtick) to open terminal

### 1.3 — Install dependencies

In the terminal, run:
```bash
npm install
```

This downloads all packages. It may take 1–2 minutes. You'll see a `node_modules` folder appear.

---

## 🗄 STEP 2: Supabase Setup (Database & Auth)

### 2.1 — Create a new Supabase project

1. Go to https://supabase.com and log in
2. Click **"New project"**
3. Choose your organization (or create one)
4. Fill in:
   - **Name**: `autoluxe`
   - **Database Password**: choose a strong password and **save it somewhere safe**
   - **Region**: pick the one closest to you
5. Click **"Create new project"**
6. Wait 1–2 minutes for it to set up

### 2.2 — Run the database schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Open the file `supabase/schema.sql` from this project
4. Copy ALL the content
5. Paste it into the SQL Editor
6. Click the green **"Run"** button (or press Ctrl+Enter)
7. You should see "Success. No rows returned" — this is correct!

### 2.3 — Set up storage

1. Still in SQL Editor, click **"New query"** again
2. Open the file `supabase/storage.sql` from this project
3. Copy ALL the content and paste it
4. Click **"Run"**

### 2.4 — Enable Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Make sure **Email** is enabled (it should be by default)
3. For development, go to **Authentication** → **Settings**
4. Under "Email Auth", you may want to turn OFF "Confirm email" while testing
   (This lets you log in without clicking a confirmation email)

### 2.5 — Verify your setup

1. Click **"Table Editor"** in the sidebar
2. You should see 3 tables: `profiles`, `vehicles`, `reservations`
3. Click on `vehicles` — you should see 12 sample cars already inserted!

---

## 🔑 STEP 3: Connect Your App to Supabase

### 3.1 — Get your Supabase credentials

1. In Supabase dashboard, click **"Project Settings"** (gear icon, bottom left)
2. Click **"API"** in the settings menu
3. You'll see:
   - **Project URL**: looks like `https://abcdefghijkl.supabase.co`
   - **anon public key**: a long string starting with `eyJ...`
4. Copy both of these

### 3.2 — Create your .env file

In your project folder, create a new file called `.env` (note: no extension, just `.env`).

**Windows**: In terminal: `copy .env.example .env`
**Mac/Linux**: In terminal: `cp .env.example .env`

Then open `.env` in any text editor and fill it in:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-full-key
```

Replace with YOUR actual values from step 3.1.

> ⚠️ IMPORTANT: Never share this file or commit it to GitHub. The `.gitignore` file already excludes it.

---

## ▶️ STEP 4: Run the App Locally

In your terminal (inside the project folder), run:
```bash
npm run dev
```

You should see output like:
```
  VITE v5.x.x  ready in 500ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open your browser and go to: **http://localhost:3000**

🎉 Your Autoluxe app is running!

### Test it:
1. Click "Register Now" → create an account
2. Check the vehicles page — you should see 12 cars
3. Click "Reserve Now" on any car → try booking it
4. Check your Dashboard

### Stop the server:
Press `Ctrl + C` in the terminal.

---

## 🚀 STEP 5: Deploy to Vercel

### 5.1 — Push to GitHub first (do Step 6 first)

Vercel deploys from GitHub, so complete Step 6 first, then come back here.

### 5.2 — Deploy to Vercel

1. Go to https://vercel.com and log in with your GitHub account
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your `autoluxe` repository
4. Vercel will auto-detect Vite. Settings should be:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Scroll down to **"Environment Variables"**
6. Add these two variables:
   - `VITE_SUPABASE_URL` → your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
7. Click **"Deploy"**
8. Wait ~2 minutes

Your site will be live at `https://autoluxe-xxx.vercel.app`! 🎉

### 5.3 — Update Supabase allowed URLs

For auth to work on your live domain:
1. In Supabase → **Authentication** → **URL Configuration**
2. Add your Vercel URL to **"Site URL"**: `https://autoluxe-xxx.vercel.app`
3. Add to **"Redirect URLs"**: `https://autoluxe-xxx.vercel.app/**`
4. Click Save

---

## 📦 STEP 6: Push to GitHub

### 6.1 — Create a GitHub repository

1. Go to https://github.com and log in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `autoluxe`
   - **Description**: "Luxury car rental platform"
   - **Visibility**: Public or Private (your choice)
   - ❌ Do NOT check "Initialize with README" (we already have one)
4. Click **"Create repository"**
5. Copy the repository URL (looks like `https://github.com/yourusername/autoluxe.git`)

### 6.2 — Connect your local project to GitHub

In your terminal (inside the project folder), run these commands ONE BY ONE:

```bash
# Initialize git (if not already done)
git init

# Tell git your name and email (first time only)
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit: Autoluxe luxury car rental app"

# Connect to your GitHub repository (replace URL with yours)
git remote add origin https://github.com/yourusername/autoluxe.git

# Push to GitHub
git branch -M main
git push -u origin main
```

GitHub may ask for your username and password.
For password: use a **Personal Access Token** (not your regular password):
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → check "repo" scope → Generate → copy the token
3. Use this token as your password when git asks

### 6.3 — Verify

Go to `https://github.com/yourusername/autoluxe` — you should see all your files!

---

## 🔄 STEP 7: How to Work with GitHub Daily

### Basic workflow — Make changes and save them

Every time you make changes to your code:

```bash
# 1. See what files changed
git status

# 2. Add all changes
git add .

# 3. Save with a message describing what you did
git commit -m "Add feature: improved vehicle filters"

# 4. Push to GitHub
git push
```

### Useful Git commands explained:

```bash
git status              # See which files have changed
git diff                # See exactly what changed
git log --oneline       # See history of commits
git add .               # Stage ALL changed files
git add filename.tsx    # Stage ONE specific file
git commit -m "message" # Save changes with a description
git push                # Upload to GitHub
git pull                # Download latest changes from GitHub
```

### If something breaks — go back to a previous version:

```bash
# See commit history
git log --oneline

# Undo the last commit (keeps your changes)
git reset --soft HEAD~1

# Undo the last commit (DISCARDS your changes — be careful!)
git reset --hard HEAD~1
```

### Working on a new feature (branches):

```bash
# Create a new branch
git checkout -b feature/new-feature-name

# Work on your code...

# Push the new branch
git push -u origin feature/new-feature-name

# When done, merge back to main
git checkout main
git merge feature/new-feature-name
git push
```

---

## 🔧 Troubleshooting

### "Cannot find module" or "Module not found"
```bash
rm -rf node_modules
npm install
```

### "VITE_SUPABASE_URL is not defined"
- Make sure you created the `.env` file (not `.env.example`)
- Make sure it's in the ROOT of the project (same folder as `package.json`)
- Restart the dev server: Ctrl+C then `npm run dev`

### "Failed to fetch" or Supabase errors
- Check your Supabase URL and key in `.env` — no spaces, no quotes
- Make sure you ran `schema.sql` in Supabase SQL Editor
- Check Supabase dashboard → API → confirm the URL matches

### "Port 3000 already in use"
```bash
# Kill the process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
# Mac/Linux:
lsof -ti:3000 | xargs kill
```

### Build errors on Vercel
- Make sure you added environment variables in Vercel dashboard
- Go to Vercel → your project → Settings → Environment Variables

### Auth not working on live site
- Add your Vercel URL to Supabase Auth → URL Configuration (see Step 5.3)

---

## 📁 Project Structure

```
autoluxe/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── VehicleCard.tsx
│   │   ├── VehicleGrid.tsx
│   │   ├── ReservationForm.tsx
│   │   └── DashboardTable.tsx
│   ├── pages/               # Full page components
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── VehiclesPage.tsx
│   │   ├── ReservationPage.tsx
│   │   └── DashboardPage.tsx
│   ├── hooks/
│   │   └── useAuth.tsx      # Auth context & hook
│   ├── lib/
│   │   └── supabase.ts      # Supabase client
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── App.tsx              # Routes
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── supabase/
│   ├── schema.sql           # Database tables + RLS + seed data
│   ├── storage.sql          # Storage bucket setup
│   └── functions/
│       └── create-reservation/
│           └── index.ts     # Edge function
├── .env.example             # Template for env vars
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json              # Vercel routing config
└── vite.config.ts
```

---

## 🎨 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | Frontend framework |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Supabase | Database, Auth, Storage |
| Lucide React | Icons |
| Vercel | Hosting |

---

## 🚀 Quick Commands Reference

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally

git add .            # Stage changes
git commit -m "msg"  # Commit
git push             # Push to GitHub
git pull             # Pull latest from GitHub
```

---

Built with ❤️ — Autoluxe 2025
