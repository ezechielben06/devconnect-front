# DevConnect Bénin — Plateforme Communautaire des Développeurs et Entreprises Tech

> **Projet officiel d'excellence technologique conçu et développé pour le Challenge National CADEV 2026.**  
> **Auteurs :** **NV TEAM**  
> • **Gbenagnon Narcisse AVLESSI** — *Lead Architecte Front-End & UI/UX*  
> • **Mahukpègo Vertueux NOUKPO** — *Lead Architecte Back-End & Systèmes Distribués*  
> **Cadre Légal & Réglementaire :** Conformité stricte à la **Loi N° 2017-20** portant Code du Numérique en République du Bénin et directives de l'**Autorité de Protection des Données Personnelles (APDP)**.

---

## Sommaire

1. [Vision et Objectifs Stratégiques](#1-vision-et-objectifs-stratégiques)
2. [Cadre Légal & Souveraineté Numérique (APDP Bénin)](#2-cadre-légal--souveraineté-numérique-apdp-bénin)
3. [Stack Technique & Choix d'Architecture](#3-stack-technique--choix-darchitecture)
4. [Détail Exhaustif des Modules Front-End](#4-détail-exhaustif-des-modules-front-end)
   - [4.1. Authentification & Stepper d'Inscription en 3 Étapes](#41-authentification--stepper-dinscription-en-3-étapes)
   - [4.2. Fil d'Actualité Social & Stories Éphémères (24h)](#42-fil-dactualité-social--stories-éphémères-24h)
   - [4.3. Éditeur de Code Embarqué & Coloration VS Code Dark+](#43-éditeur-de-code-embarqué--coloration-vs-code-dark)
   - [4.4. Annuaire des Développeurs & Système de Relations](#44-annuaire-des-développeurs--système-de-relations)
   - [4.5. Marketplace des Missions & Devis en FCFA](#45-marketplace-des-missions--devis-en-fcfa)
   - [4.6. Messagerie Instantanée, Groupes & Messages Éphémères](#46-messagerie-instantanée-groupes--messages-éphémères)
   - [4.7. Espace d'Entraide Technique & Forum Q&A](#47-espace-dentraide-technique--forum-qa)
   - [4.8. Moteur de Recherche Globale Instantanée (Cmd+K)](#48-moteur-de-recherche-globale-instantanée-cmdk)
   - [4.9. Profil Personnel & Paramètres de Confidentialité](#49-profil-personnel--paramètres-de-confidentialité)
   - [4.10. Gestion des Cookies & Consentement Granulaire](#410-gestion-des-cookies--consentement-granulaire)
   - [4.11. Support Hors-Ligne & Progressive Web App (PWA)](#411-support-hors-ligne--progressive-web-app-pwa)
5. [Spécifications Techniques Back-End (Laravel Sanctum & Reverb)](#5-spécifications-techniques-back-end-laravel-sanctum--reverb)
   - [5.1. Routes de l'API REST](#51-routes-de-lapi-rest)
   - [5.2. Événements Temps Réel (WebSockets Reverb)](#52-événements-temps-réel-websockets-reverb)
6. [Ergonomie, Gestion du Scroll & Design System](#6-ergonomie-gestion-du-scroll--design-system)
7. [Structure Complète des Dossiers et Fichiers](#7-structure-complète-des-dossiers-et-fichiers)
8. [Guide d'Installation, Exécution & Déploiement](#8-guide-dinstallation-exécution--déploiement)

---

## 1. Vision et Objectifs Stratégiques

**DevConnect Bénin** est la plateforme unifiée de référence dédiée aux ingénieurs logiciels, architectes systèmes, data scientists, concepteurs d'interfaces et recruteurs technologiques au Bénin et dans l'espace UEMOA.

### Les défis résolus sur le terrain local :
1. **Valorisation 100% en Francs CFA (FCFA / XOF) :** Fin des frictions de conversion de devises étrangères inadaptées à l'économie locale. Tous les tarifs horaires (TJM), forfaits et budgets de projets sont rigoureusement libellés en FCFA.
2. **Partage technique haute fidélité :** Intégration d'un véritable sous-système de coloration syntaxique conforme au thème officiel **Visual Studio Code Dark+**, permettant l'échange de snippets de code exécutables (HTML, CSS, TypeScript, JavaScript, Python, Go, Java, PHP, Rust, SQL, Dart, etc.).
3. **Mise en relation et opportunités réelles :** Passerelle directe entre les donneurs d'ordres (entreprises, scale-ups, institutions) et les talents certifiés avec gestion d'invitations professionnelles en temps réel.
4. **Fluidité 60 FPS et frugalité logicielle :** Conçu pour tourner sans saccade même sur des réseaux mobiles 3G/4G intermittents à Cotonou, Porto-Novo, Abomey-Calavi ou Parakou.

---

## 2. Cadre Légal & Souveraineté Numérique (APDP Bénin)

Conformément aux dispositions de la **Loi N° 2017-20 du 20 avril 2018 portant Code du Numérique en République du Bénin**, DevConnect intègre dès sa conception les principes de *Privacy by Design* :

* **Consentement Granulaire :** Aucun cookie non essentiel n'est déposé sans l'accord explicite de l'utilisateur. Les cookies strictement nécessaires à la sécurité de session et aux jetons anti-CSRF restent verrouillés pour garantir l'intégrité de la plateforme.
* **Droit au Masquage & Protection de la Vie Privée :** Chaque développeur dispose de curseurs indépendants pour masquer ou afficher publiquement son numéro de téléphone, sa date de naissance et sa situation matrimoniale.
* **Portabilité & Droit à l'Oubli :** Possibilité d'exporter en un clic l'intégralité de ses données au format JSON structuré ou de purger définitivement son compte depuis l'espace *Paramètres*.

---

## 3. Stack Technique & Choix d'Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DevConnect Front-End                   │
│  React 19 • TypeScript Strict • Tailwind CSS v4 • Motion   │
└──────────────┬───────────────────────────────┬──────────────┘
               │ HTTP / JSON (Sanctum)         │ WebSockets (Reverb)
               ▼                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      DevConnect Back-End                    │
│   Laravel 13 REST API • Reverb WS Server • MySQL • Redis    │
└─────────────────────────────────────────────────────────────┘
```

* **React 19 (React DOM 19) :** Exploitation des hooks modernes, transitions asynchrones optimistes (`useOptimistic`), gestion fine du cycle de vie sans dépendances externes encombrantes.
* **TypeScript 5.8 / 7.0 :** Typage statique strict sur l'intégralité des modèles métier, interfaces d'API, événements et composants.
* **Vite 6 / 8 :** Environnement de compilation et serveur de développement ultra-rapide avec Hot Module Replacement (HMR).
* **Tailwind CSS v4 :** Feuilles de style atomiques natives `@import "tailwindcss";`, gestion dynamique du mode sombre (`.dark`), absence de fichier CSS séparé redondant.
* **Motion (Motion/React) :** Orchestration fluide des micro-interactions, animations d'apparition des modales, stepper d'inscription et transitions de stories.
* **PrismJS :** Moteur de coloration syntaxique multi-langages avec grammaires préchargées reproduisant l'expérience de l'éditeur VS Code.
* **Axios :** Client HTTP configuré avec `withCredentials: true` et intercepteur automatique du jeton `XSRF-TOKEN` pour Laravel Sanctum.
* **Laravel Echo & Pusher JS :** Bridge WebSocket connecté au serveur Reverb sur le port 8080 pour la messagerie instantanée et les notifications push.

---

## 4. Détail Exhaustif des Modules Front-End

### 4.1. Authentification & Stepper d'Inscription en 3 Étapes
* **Composant source :** `src/components/auth/AuthModal.tsx`
* **Fonctionnalités :**
  * **Étape 1 — Identité :** Saisie du prénom et du nom de famille. Le nom de famille est automatiquement converti et persisté en **MAJUSCULES strictes** (règle administrative nationale CADEV 2026, ex: `Josué AFFAGNON`).
  * **Étape 2 — Coordonnées & Indicatif International :** Sélecteur de pays avec mise à jour automatique de l'indicatif (+229 Bénin, +228 Togo, +225 Côte d'Ivoire, +221 Sénégal, etc.) et **détection heuristique de l'opérateur mobile béninois** selon le préfixe téléphonique saisi (*MTN Bénin*, *Moov Africa Bénin*, *Celtiis Bénin*).
  * **Étape 3 — Sécurité & Validation APDP :** Mot de passe renforcé avec jauge visuelle de robustesse (longueur minimale 8 caractères, majuscule, chiffre, caractère spécial), confirmation de mot de passe, date de naissance, situation matrimoniale et cases à cocher obligatoires pour les CGU et la charte de confidentialité.
  * **Animation de défilement :** Transitions fluides de droite à gauche avec retour en arrière possible sans perte des données saisies.

### 4.2. Fil d'Actualité Social & Stories Éphémères (24h)
* **Composant source :** `src/components/feed/SocialFeedModule.tsx`, `src/components/feed/CreateStoryModal.tsx`
* **Fonctionnalités :**
  * **Publications riches :** Partage de textes, de snippets de code VS Code, de sondages interactifs à choix multiples et de tags thématiques (`#React19Bénin`, `#FintechCFA`, `#CADEV2026`).
  * **Règle stricte des 15 minutes d'édition :** L'auteur peut modifier son post pendant un délai maximal de 15 minutes. Passé ce délai, le bouton d'édition se verrouille automatiquement avec mention explicite du délai expiré.
  * **Suppression avec restauration (Undo) :** En cas de suppression d'un post, un toast d'alerte permet l'annulation immédiate pour restaurer la publication sans rechargement.
  * **Épinglage de post :** Possibilité d'épingler une publication prioritaire au sommet de son profil ou du fil.
  * **Stories 24h :** Visualiseur plein écran au format smartphone 9:16 avec sélection de clichés tech prédéfinis ou téléversement local de photos/vidéos depuis la galerie.

### 4.3. Éditeur de Code Embarqué & Coloration VS Code Dark+
* **Composant source :** `src/components/common/VSCodeEditor.tsx`, `src/components/common/CodeBlock.tsx`, `src/utils/codeHighlighter.ts`
* **Fonctionnalités :**
  * Thème officiel **Visual Studio Code Dark+** avec barre de titre macOS (trois boutons rouge/jaune/vert), onglet actif, nom de fichier modifiable, numérotation fidèle des lignes et indicateur de position curseur (*Ln X, Col Y*).
  * **Détection automatique du langage :** Analyse heuristique en direct identifiant les balises HTML, structures Go, imports Python, interfaces TypeScript ou requêtes SQL.
  * Bouton de copie en un clic avec retour visuel animé et gestion des erreurs de permissions de presse-papier.

### 4.4. Annuaire des Développeurs & Système de Relations
* **Composant source :** `src/components/matching/DeveloperMatchingModule.tsx`, `src/components/profile/DeveloperDetailModal.tsx`
* **Fonctionnalités :**
  * Recherche multi-critères : par nom, stack technique, ville béninoise (*Cotonou, Porto-Novo, Parakou, Abomey-Calavi*) et statut de disponibilité (*Disponible, En mission, À l'écoute*).
  * Affichage transparent des taux horaires en FCFA/h et des scores de réputation vérifiés.
  * **Système d'invitations professionnelles :** Envoi d'invitations de mise en relation, suivi des demandes en attente, acceptation ou refus direct dans le widget latéral.
  * **Modale d'inspection de profil :** Consultation complète sans rupture de page, badges de certification, liens directs WhatsApp, GitHub et LinkedIn.

### 4.5. Marketplace des Missions & Devis en FCFA
* **Composant source :** `src/components/projects/ProjectsModule.tsx`
* **Fonctionnalités :**
  * Catalogue des missions professionnelles à pourvoir (Frontend, Backend, DevOps, IA, Mobile Fintech).
  * Fourchettes budgétaires claires en FCFA (ex: *3 500 000 à 5 000 000 FCFA*), délais de livraison et niveau de séniorité attendu (*Junior, Intermédiaire, Senior/Lead*).
  * Formulaire de publication d'une nouvelle mission avec calcul de budget et formulaire de candidature directe.

### 4.6. Messagerie Instantanée, Groupes & Messages Éphémères
* **Composant source :** `src/components/chat/ChatModule.tsx`
* **Fonctionnalités :**
  * Salons publics thématiques (`#react-benin`, `#fintech-momo-uemoa`, `#missions-freelance-fcfa`) et création de sous-groupes privés avec modération administrateur.
  * **Gestion des permissions de groupe :** Mode « Seuls les admins publient » pour les canaux d'annonces officielles et protection des métadonnées du groupe.
  * **Messages éphémères programmables :** Configuration de la durée de disparition automatique (*15 minutes, 24 heures, 7 jours*).
  * **Réactions émojis uniques :** Une seule réaction active autorisée par membre par message avec toggle d'activation/désactivation.
  * **Fonds d'écran personnalisables :** Thème *Blueprint Architecte*, *Matrice Cyber Cotonou*, *Coucher de Soleil Haie Vive*, *Nuit Étoilée Porto-Novo* ou motif géométrique inspiré du tissu Wax.

### 4.7. Espace d'Entraide Technique & Forum Q&A
* **Composant source :** `src/components/qa/QAModule.tsx`
* **Fonctionnalités :**
  * Plateforme de questions/réponses communautaire sur les défis d'ingénierie (React 19, microservices, intégration des webhooks Mobile Money, conformité BCEAO/APDP).
  * Vote ascendant optimiste avec incrémentation immédiate du score et identification de la solution validée/acceptée par l'auteur.

### 4.8. Moteur de Recherche Globale Instantanée (Cmd+K)
* **Composant source :** `src/components/search/GlobalSearchModal.tsx`
* **Fonctionnalités :**
  * Raccourci clavier universel `Cmd+K` ou `Ctrl+K`.
  * Indexation et recherche simultanée sur 6 dimensions : Développeurs, Missions FCFA, Snippets de code VS Code, Sujets Q&A, Salons de discussion et Publications du Feed.
  * Historique des recherches récentes mémorisé et suggestions dynamiques des hashtags tendances au Bénin.

### 4.9. Profil Personnel & Paramètres de Confidentialité
* **Composant source :** `src/components/profile/UserProfileModule.tsx`, `src/components/settings/SettingsModal.tsx`
* **Fonctionnalités :**
  * Édition complète du profil, avatar, spécialité, ville de résidence, TJM en FCFA, bio bilingue (FR/EN) et liens de réseaux sociaux.
  * Sécurité : visualisation des sessions actives par type d'appareil et localisation, activation de la double authentification (2FA).
  * Export des données personnelles au format JSON certifié conforme aux normes de l'APDP Bénin.

### 4.10. Gestion des Cookies & Consentement Granulaire
* **Composant source :** `src/components/cookies/CookieConsentBanner.tsx`
* **Fonctionnalités :**
  * Bannière de consentement respectant les dispositions du Code du Numérique béninois.
  * Séparation stricte entre cookies essentiels indésactivables (sécurité de session CSRF) et cookies optionnels de confort (thème, devises, mesure de fluidité).

### 4.11. Support Hors-Ligne & Progressive Web App (PWA)
* **Composants sources :** `public/sw.js`, `public/manifest.webmanifest`, `src/components/common/PWAInstallModal.tsx`
* **Fonctionnalités :**
  * Service Worker avec stratégie de mise en cache *Stale-While-Revalidate* pour les ressources statiques et *Network-First* pour les données dynamiques.
  * Installation en mode autonome (*standalone*) sur smartphone Android, iPhone/iPad (iOS) et ordinateur PC/Mac avec raccourcis directs.

---

## 5. Spécifications Techniques Back-End (Laravel Sanctum & Reverb)

### 5.1. Routes de l'API REST

| Domaine | Méthode | URL | Description & Comportement |
| :--- | :---: | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/register` | Inscription avec validation du nom en majuscules et indicatif pays |
| **Auth** | `POST` | `/api/v1/auth/login` | Connexion par email/téléphone (limite de 5 essais/min) |
| **Auth** | `POST` | `/api/v1/auth/logout` | Révocation de la session active |
| **Auth** | `GET` | `/api/v1/auth/me` | Vérification de la session connectée et profil de l'utilisateur |
| **Auth** | `GET` | `/api/v1/auth/sessions` | Liste des terminaux et sessions actives |
| **Auth** | `DELETE` | `/api/v1/auth/sessions/:id` | Déconnexion à distance d'une session ciblée |
| **Profil** | `GET` | `/api/v1/users/:id` | Consultation d'un profil développeur (champs privés filtrés) |
| **Profil** | `PATCH` | `/api/v1/me/profile` | Mise à jour des informations personnelles et curseurs de visibilité |
| **Profil** | `POST` | `/api/v1/me/avatar` | Téléversement de la photo de profil (conversion WebP 400x400) |
| **Profil** | `PATCH` | `/api/v1/me/settings` | Enregistrement des préférences (thème, langue, visibilité) |
| **Feed** | `GET` | `/api/v1/feed` | Récupération paginée par curseur (`?cursor=...&per_page=15`) |
| **Feed** | `POST` | `/api/v1/posts` | Publication d'un post avec texte, snippet VS Code ou sondage |
| **Feed** | `PATCH` | `/api/v1/posts/:id` | Modification d'un post (**verrouillage strict après 15 min**) |
| **Feed** | `DELETE` | `/api/v1/posts/:id` | Suppression d'un post (soft delete) |
| **Feed** | `PATCH` | `/api/v1/posts/:id/pin`| Épinglage/Détachement d'une publication |
| **Interactions** | `POST` | `/api/v1/posts/:id/reactions` | Réaction émotionnelle unique par membre (`like`, `fire`, etc.) |
| **Interactions** | `POST` | `/api/v1/posts/:id/poll/vote` | Enregistrement d'un vote unique à un sondage |
| **Interactions** | `POST` | `/api/v1/posts/:id/comments` | Ajout d'un commentaire (support des réponses imbriquées) |
| **Interactions** | `POST` | `/api/v1/comments/:id/reactions`| Réaction sous commentaire avec protection anti-spam |
| **Interactions** | `POST` | `/api/v1/posts/:id/bookmark` | Enregistrement dans les favoris |
| **Chat** | `GET` | `/api/v1/conversations` | Liste des salons publics et groupes privés de l'utilisateur |
| **Chat** | `POST` | `/api/v1/conversations` | Création d'une room privée ou d'un groupe |
| **Chat** | `GET` | `/api/v1/conversations/:id/messages` | Récupération paginée des messages avec curseur `?before=:id` |
| **Chat** | `POST` | `/api/v1/conversations/:id/messages` | Envoi d'un message avec extraction de code et TTL éphémère |
| **Chat** | `PATCH` | `/api/v1/conversations/:id/messages/:msgId` | Modification d'un message (**autorisée pendant 15 min**) |
| **Chat** | `POST` | `/api/v1/conversations/:id/messages/:msgId/reactions` | Réaction émoji unique par message |
| **Relations** | `POST` | `/api/v1/relations/request` | Envoi d'une invitation de mise en relation |
| **Relations** | `POST` | `/api/v1/relations/:id/accept` | Acceptation d'une invitation professionnelle |
| **Relations** | `POST` | `/api/v1/relations/:id/reject` | Refus d'une invitation |
| **Relations** | `DELETE` | `/api/v1/relations/:userId` | Retrait d'un contact de son réseau |
| **Recherche** | `GET` | `/api/v1/search` | Recherche universelle 6 dimensions (`?q=...&category=...`) |
| **Stories** | `GET` | `/api/v1/stories` | Liste des stories actives des dernières 24 heures |
| **Stories** | `POST` | `/api/v1/stories` | Publication d'une story multimédia (TTL 24h) |

---

### 5.2. Événements Temps Réel (WebSockets Reverb)

```
Canal de Présence / Public : presence-feed
├── .post.published          -> Nouvelle publication ajoutée au flux
├── .post.reaction_updated   -> Compteurs de réactions recalculés
├── .post.updated            -> Modification du texte (fenêtre 15 min)
└── .post.deleted            -> Retrait d'une publication supprimée

Canal Privé : private-conversations.{conversationId}
├── .message.sent            -> Nouveau message reçu (texte/code/éphémère)
├── .message.updated         -> Message édité par son auteur
├── .message.deleted         -> Message purgé du salon
├── .message.reaction_updated-> Réaction émoji basculée
├── .user.typing             -> Indicateur de saisie en temps réel
└── .user.seen               -> Accusé de lecture mis à jour

Canal Privé Utilisateur : private-users.{userId}
├── .notification.pushed     -> Notification cloche (mention, candidature FCFA)
├── .relation.requested      -> Invitation de connexion reçue
└── .relation.accepted       -> Confirmation d'extension de réseau
```

---

## 6. Ergonomie, Gestion du Scroll & Design System

### 6.1. Verrouillage Universel du Défilement (`useBodyScrollLock`)
Pour éliminer les sauts d'écran disgracieux et le défilement de fond lors de l'ouverture de modales superposées (authentification, cookies, aperçu de stories, détails de développeur), le hook `useBodyScrollLock` implémente un **compteur de référence global** :
* Désactivation stricte de `overflow: hidden` et `touch-action: none` sur `document.body` et `document.documentElement`.
* Support parfait de l'empilement de plusieurs fenêtres modales sans conflit de libération.
* Rétablissement instantané du défilement natif dès la fermeture du dernier calque.

### 6.2. Règle Zéro-Pill & Alignement Strict des Boutons
* Les boutons d'action comportant des icônes de navigation (notamment « Continuer vers mes coordonnées », « Finaliser mon inscription » ou « Se connecter ») utilisent les directives Tailwind `flex flex-row flex-nowrap whitespace-nowrap` pour garantir un alignement horizontal parfait sur les téléphones étroits (320px et 360px) comme sur les moniteurs 4K.
* Typographie soignée combinant **Outfit** pour les titrages géométriques, **Plus Jakarta Sans** pour le texte courant et **JetBrains Mono** pour les extraits de code et les montants financiers en FCFA.

---

## 7. Structure Complète des Dossiers et Fichiers

```text
.
├── README.md                       # Documentation technique intégrale (Français)
├── bun.lock                        # Fichier de verrouillage Bun / dépendances
├── index.html                      # Point d'entrée HTML5 avec métadonnées SEO & PWA
├── metadata.json                   # Métadonnées officielles du projet AI Studio
├── package.json                    # Définition des dépendances et scripts npm
├── tsconfig.json                   # Configuration TypeScript strict (ES2022 / React-JSX)
├── vite.config.ts                  # Configuration du bundler Vite, Tailwind CSS & PWA
├── public/                         # Ressources statiques et manifestes PWA
│   ├── favicon.svg                 # Favicon vectoriel officiel DevConnect
│   ├── icon.svg                    # Icône vectorielle du logo
│   ├── icon-192.png                # Icône PWA 192x192
│   ├── icon-512.png                # Icône PWA 512x512
│   ├── manifest.json               # Manifeste PWA standard
│   ├── manifest.webmanifest        # Manifeste moderne multi-navigateurs
│   ├── sw.js                       # Service Worker haute disponibilité (mode hors-ligne)
│   └── assets/                     # Visuels, diagrammes et médias de l'application
└── src/                            # Code source applicatif
    ├── App.tsx                     # Orchestrateur racine des modales et vues
    ├── api.ts                      # Client API Axios configuré pour Laravel Sanctum
    ├── echo.ts                     # Configuration WebSocket Laravel Echo / Reverb
    ├── index.css                   # Styles globaux, polices et directives Tailwind v4
    ├── main.tsx                    # Montage React 19 dans le DOM
    ├── canvas/
    │   └── FluidWebGLCanvas.tsx    # Toile d'ambiance atmosphérique WebGL fluide
    ├── components/                 # Composants d'interface modulaires
    │   ├── BootLoader.tsx          # Animation de démarrage avec tracé du D officiel
    │   ├── DevConnectLogo.tsx      # Composant SVG du logo pixelisé animé
    │   ├── ai/
    │   │   └── AIAssistantDrawer.tsx   # Tiroir d'assistance technique et revue de code
    │   ├── auth/
    │   │   └── AuthModal.tsx       # Stepper d'inscription en 3 étapes & connexion
    │   ├── chat/
    │   │   └── ChatModule.tsx      # Salons temps réel, groupes et coloration VS Code
    │   ├── common/
    │   │   ├── BrandLogo.tsx       # Logo et wordmark typographique de marque
    │   │   ├── CodeBlock.tsx       # Bloc de code statique avec coloration PrismJS
    │   │   ├── FaqModal.tsx        # Foire aux questions interactive avec recherche
    │   │   ├── Footer.tsx          # Pied de page avec filigrane interactif 3D
    │   │   ├── MathematicalGrain.tsx # Texture de grain procédurale anti-banding
    │   │   ├── PWAInstallModal.tsx # Guide d'installation autonome iOS/Android/PC
    │   │   ├── SplashScreen.tsx    # Écran de transition cyberpunk
    │   │   ├── TopBar.tsx          # Barre de navigation capsule verre liquide
    │   │   └── VSCodeEditor.tsx    # Éditeur de code interactif temps réel
    │   ├── cookies/
    │   │   └── CookieConsentBanner.tsx # Bandeau de consentement conforme APDP Bénin
    │   ├── feed/
    │   │   ├── CreateStoryModal.tsx# Création de stories 24h avec galerie
    │   │   └── SocialFeedModule.tsx# Fil d'actualité, publications et sondages
    │   ├── feedback/
    │   │   └── ExperienceFeedbackModal.tsx # Recueil d'avis sur l'expérience utilisateur
    │   ├── legal/
    │   │   └── LegalModal.tsx      # CGU, politique APDP Bénin et mentions NV TEAM
    │   ├── matching/
    │   │   └── DeveloperMatchingModule.tsx # Annuaire des ingénieurs et relations
    │   ├── profile/
    │   │   ├── DeveloperDetailModal.tsx # Modale d'inspection de profil détaillé
    │   │   └── UserProfileModule.tsx   # Espace profil et personnalisation
    │   ├── projects/
    │   │   └── ProjectsModule.tsx  # Marketplace des missions rémunérées en FCFA
    │   ├── qa/
    │   │   └── QAModule.tsx        # Forum d'entraide technique et votes
    │   ├── search/
    │   │   └── GlobalSearchModal.tsx # Recherche universelle indexée (Cmd+K)
    │   ├── settings/
    │   │   └── SettingsModal.tsx   # Paramètres de compte, sessions 2FA et vie privée
    │   ├── sitemap/
    │   │   └── SitemapModal.tsx    # Plan du site avec navigation clavier
    │   ├── team/
    │   │   └── NVTeamModal.tsx     # Présentation officielle de la NV TEAM
    │   └── ui/                     # Bibliothèque de composants atomiques
    │       ├── Avatar.tsx          # Avatar avec statut de présence et initiales
    │       ├── Badge.tsx           # Badges d'état et étiquettes technologiques
    │       ├── Button.tsx          # Boutons polymorphes avec états de chargement
    │       ├── Card.tsx            # Cartes interactives style verre dépoli
    │       ├── EmptyState.tsx      # États vides avec illustration et action
    │       ├── Input.tsx           # Champs de saisie accessibles
    │       ├── Modal.tsx           # Boîtes de dialogue accessibles avec piège de focus
    │       ├── Skeleton.tsx        # Squelettes de chargement avec animation shimmer
    │       └── Textarea.tsx        # Zones de texte multi-lignes redimensionnables
    ├── context/
    │   └── AppContext.tsx          # État global réactif (Auth, Thème, Navigation)
    ├── hooks/
    │   ├── useBodyScrollLock.ts    # Verrouillage universel du défilement d'arrière-plan
    │   ├── useBoot.ts              # Orchestration des tâches de préchauffage au boot
    │   └── usePWAInstall.ts        # Capture de l'événement d'installation PWA
    ├── lib/
    │   ├── boot-tasks.ts           # Liste des tâches de démarrage (polices, icônes)
    │   └── bootstrap.ts            # Moteur d'exécution des promesses de boot
    ├── services/
    │   ├── apiContract.ts          # Contrat d'interface et implémentation mock réactive
    │   ├── mockData.ts             # Données réalistes béninoises (profils, posts, FCFA)
    │   └── translationService.ts   # Moteur de traduction instantanée FR <-> EN
    ├── types/
    │   └── index.ts                # Définitions strictes des types TypeScript
    └── utils/
        ├── codeHighlighter.ts      # Analyseur heuristique et grammaires PrismJS
        ├── formatters.ts           # Formatage des devises FCFA et casse des noms
        └── texte.ts                # Nettoyage typographique et troncature
```

---

## 8. Guide d'Installation, Exécution & Déploiement

### 8.1. Prérequis
* **Node.js :** Version 18.x, 20.x ou 22.x
* **Gestionnaire de paquets :** `npm`, `pnpm` ou `bun`

### 8.2. Variables d'Environnement (`.env`)
Créez un fichier `.env` à la racine du projet front-end en vous basant sur `.env.example` :

```env
# URL du backend Laravel Sanctum
VITE_API_URL="http://localhost:8000"

# Configuration du serveur WebSocket Reverb
VITE_REVERB_APP_KEY="tjrv8tckfd85kckiu9ee"
VITE_REVERB_HOST="localhost"
VITE_REVERB_PORT="8080"
VITE_REVERB_SCHEME="http"
```

### 8.3. Installation des Dépendances
```bash
npm install
```

### 8.4. Lancement en Mode Développement
```bash
npm run dev
```
L'application démarre immédiatement sur `http://localhost:3000`.

### 8.5. Vérification du Typage TypeScript (Lint)
```bash
npm run lint
```
Cette commande exécute le compilateur TypeScript sans émission de fichiers (`tsc --noEmit`) pour garantir l'absence totale d'erreurs de type ou d'imports orphelins.

### 8.6. Compilation pour la Production
```bash
npm run build
```
Les fichiers statiques minifiés et optimisés pour le déploiement en production sont générés dans le répertoire `dist/`.

### 8.7. Prévisualisation du Bundle de Production
```bash
npm run preview
```

---

*DevConnect Bénin — Conçu avec rigueur et passion par la **NV TEAM** pour le Challenge National CADEV 2026.*
