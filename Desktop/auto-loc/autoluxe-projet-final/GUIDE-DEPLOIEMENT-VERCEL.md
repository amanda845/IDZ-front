# 🚀 GUIDE DE DÉPLOIEMENT VERCEL - AUTOLUXE

## ⚡ Déploiement Express (10 minutes)

Suivez ces étapes **dans l'ordre** pour déployer votre projet sans erreur.

---

## ✅ ÉTAPE 1 : Vérifier que votre code est sur GitHub

### 1.1 — Vérifier que tout est bien pushé

Ouvrez votre terminal dans le dossier du projet et tapez :

```bash
git status
```

**Si vous voyez des fichiers modifiés** :
```bash
git add .
git commit -m "Ajout de l'analyse d'architecture au README"
git push
```

**Si vous voyez "nothing to commit, working tree clean"** : ✅ Parfait, passez à l'étape 2.

---

## ✅ ÉTAPE 2 : Connecter Vercel à GitHub

### 2.1 — Aller sur Vercel

1. Allez sur https://vercel.com
2. Cliquez sur **"Sign Up"** ou **"Log In"**
3. Choisissez **"Continue with GitHub"** (ne créez PAS un compte email)
4. Autorisez Vercel à accéder à vos repos GitHub

### 2.2 — Importer votre projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Trouvez votre repository **"AUTO-LUXE"** dans la liste
3. Cliquez sur **"Import"**

---

## ✅ ÉTAPE 3 : Configurer le Projet (CRUCIAL)

### 3.1 — Paramètres de Build

Vercel devrait auto-détecter Vite. Vérifiez que ces valeurs sont correctes :

- **Framework Preset** : `Vite`
- **Root Directory** : `./` (laisser vide)
- **Build Command** : `npm run build` (ou laisser vide)
- **Output Directory** : `dist`
- **Install Command** : `npm install` (ou laisser vide)

### 3.2 — Ajouter les Variables d'Environnement (CRITIQUE ⚠️)

**C'est l'étape qui cause 90% des échecs de déploiement !**

1. **Scrollez jusqu'à la section "Environment Variables"**
2. Cliquez sur **"Add New"**

**Variable 1 :**
```
Key: VITE_SUPABASE_URL
Value: [Collez votre URL Supabase ici]
Environments: ✓ Production ✓ Preview ✓ Development
```

**Variable 2 :**
```
Key: VITE_SUPABASE_ANON_KEY
Value: [Collez votre clé Supabase ici]
Environments: ✓ Production ✓ Preview ✓ Development
```

#### 🔍 Comment trouver ces valeurs ?

1. Allez sur https://supabase.com
2. Ouvrez votre projet Autoluxe
3. Cliquez sur **"Project Settings"** (icône d'engrenage en bas à gauche)
4. Cliquez sur **"API"** dans le menu
5. Copiez :
   - **Project URL** → pour `VITE_SUPABASE_URL`
   - **anon public** → pour `VITE_SUPABASE_ANON_KEY`

**⚠️ IMPORTANT** : Cochez les 3 cases (Production, Preview, Development) pour CHAQUE variable.

---

## ✅ ÉTAPE 4 : Déployer

1. Une fois les variables ajoutées, cliquez sur **"Deploy"**
2. Attendez 1-2 minutes (vous verrez les logs de build en temps réel)
3. Si tout va bien, vous verrez **"Congratulations! 🎉"**

Votre site est maintenant en ligne à l'adresse :
```
https://autoluxe-[random-id].vercel.app
```

---

## ✅ ÉTAPE 5 : Configurer Supabase pour Autoriser Votre URL Vercel

**Sans cette étape, l'authentification ne fonctionnera PAS sur le site déployé !**

### 5.1 — Copier votre URL Vercel

Dans Vercel, après le déploiement, copiez l'URL complète (ex: `https://autoluxe-abc123.vercel.app`)

### 5.2 — Ajouter l'URL dans Supabase

1. Allez sur https://supabase.com → Votre projet Autoluxe
2. **Authentication** → **URL Configuration**
3. Dans **"Site URL"**, collez votre URL Vercel : `https://autoluxe-abc123.vercel.app`
4. Dans **"Redirect URLs"**, ajoutez : `https://autoluxe-abc123.vercel.app/**`
5. Cliquez sur **"Save"**

---

## ✅ ÉTAPE 6 : Tester Votre Site

Ouvrez votre URL Vercel dans un navigateur et testez :

1. **Page d'accueil** : Elle doit s'afficher correctement
2. **Browse Vehicles** : Les 12 voitures doivent apparaître
3. **Register** : Créer un compte
4. **Login** : Se connecter
5. **Reserve Now** : Faire une réservation avec upload de fichier
6. **Dashboard** : Voir la réservation

---

## 🐛 DÉPANNAGE

### ❌ Problème : "Build failed"

**Cause** : Variables d'environnement manquantes ou erreur TypeScript

**Solution** :
1. Vérifiez que vous avez bien ajouté les 2 variables (`VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`)
2. Allez dans **Deployments** → Cliquez sur le déploiement échoué
3. Lisez les logs (dernières lignes en rouge)
4. Si vous voyez "VITE_SUPABASE_URL is not defined" :
   - Allez dans **Settings** → **Environment Variables**
   - Ajoutez les variables
   - Retournez dans **Deployments** → **Redeploy**

### ❌ Problème : Le site s'affiche mais la connexion ne marche pas

**Cause** : Supabase n'autorise pas votre URL Vercel

**Solution** :
1. Supabase → **Authentication** → **URL Configuration**
2. Ajoutez votre URL Vercel dans "Site URL" et "Redirect URLs"
3. Essayez de vous reconnecter

### ❌ Problème : Les véhicules ne s'affichent pas

**Cause** : La base de données n'a pas été créée

**Solution** :
1. Supabase → **SQL Editor** → **New query**
2. Copiez TOUT le contenu de `supabase/schema.sql`
3. Collez et cliquez **Run**
4. Pareil pour `supabase/storage.sql`

---

## 📋 CHECKLIST FINALE

Avant de soumettre votre projet au professeur, vérifiez :

- [ ] Le site Vercel est accessible publiquement
- [ ] Vous pouvez créer un compte et vous connecter
- [ ] Les 12 voitures s'affichent dans le catalogue
- [ ] Vous pouvez créer une réservation avec upload de permis
- [ ] Le dashboard affiche vos réservations
- [ ] Vous avez mis à jour le fichier `LIVRAISON-PROJET-AUTOLUXE.md` avec :
  - Vos noms
  - L'URL Vercel réelle
  - L'URL GitHub réelle
- [ ] Vous avez testé avec un deuxième compte pour vérifier le RLS (chaque utilisateur ne voit que ses propres réservations)

---

## 🎯 URL À SOUMETTRE AU PROFESSEUR

Remplacez les valeurs suivantes dans le document `LIVRAISON-PROJET-AUTOLUXE.md` :

```
URL Vercel : https://autoluxe-[votre-id].vercel.app
URL GitHub : https://github.com/[votre-username]/AUTO-LUXE
```

Puis convertissez le fichier Markdown en PDF et envoyez-le !

---

**Bonne chance ! 🚀**
