<!-- README in Français -->

**🌍 Languages**: 中文 | [English](README_EN.md) | [日本語](README_JP.md) | [Español](README_ES.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [한국어](README_KR.md)


# 🌙 Dream Système d'Intégration de Mémoire

> Système automatisé de gestion de mémoire — consolide les mémoires à court terme en mémoire à long terme, gardant MEMORY.md concis et efficace.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Aperçu

Dream est un système automatisé d'intégration de mémoire. Il lit périodiquement les fichiers de mémoire à court terme du répertoire `memory/`, utilise l'IA pour extraire des informations précieuses et les ajoute automatiquement au fichier de mémoire à long terme `MEMORY.md`. L'élagage intelligent maintient le fichier compact.

Inspiré du mécanisme de gestion de mémoire de Claude Code, adapté au système de mémoire d'OpenClaw.

## Fonctionnalités Principales

| Fonctionnalité | Description |
|------|------|
| Analyse Intelligente par IA | Utilise le modèle qwen3.6-plus pour analyser les mémoires à court terme et extraire 3-5 mémoires de haute valeur à long terme |
| Intégration Automatique | Ajoute les résultats d'analyse à MEMORY.md dans un format structuré |
| Sauvegarde Automatique | Sauvegarde automatique de MEMORY.md avant chaque écriture pour prévenir la perte de données |
| Validation du Contenu | Ignore le contenu vide ou trop court (<100 caractères) pour éviter les écritures invalides |
| Élagage Intelligent | Double moteur IA + règles pour identifier et supprimer automatiquement les sections obsolètes ou de faible priorité |

## Flux d'Exécution

```
Phase 1 ── Lecture de la Mémoire à Court Terme
   │           Analyse de tous les fichiers .md dans le répertoire memory/
   ▼
Phase 2 ── Analyse Intelligente par IA
   │           Appel du grand modèle pour extraire les mémoires à long terme utiles
   ▼
Phase 3 ── Intégration à la Mémoire à Long Terme
   │           Sauvegarde de MEMORY.md → Ajout structuré → Validation du contenu
   ▼
Phase 4 ── Élagage Intelligent
               Élagage automatique lorsque le fichier dépasse 25 Ko ou 200 lignes
```

## Démarrage Rapide

### 1. Configuration

Définir les variables d'environnement :

```bash
export DREAM_API_KEY="your-api-key-here"
```

Variables d'environnement optionnelles :

| Variable | Description | Valeur par Défaut |
|------|------|--------|
| `DREAM_API_KEY` | Clé API (obligatoire) | — |
| `DREAM_MODEL` | Modèle d'IA | `qwen3.6-plus` |
| `DREAM_API_URL` | Adresse API | `https://coding.dashscope.aliyuncs.com/v1` |
| `DREAM_MEMORY_DIR` | Répertoire de mémoire | `./memory` |
| `DREAM_LOG_FILE` | Fichier journal | `./dream.log` |

### 2. Exécution Manuelle

```bash
node executor.js
```

### 3. Exécution Planifiée (Recommandé)

Exécution automatique quotidienne à 5h00 via crontab :

```bash
crontab -e
# Ajouter la ligne suivante
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

## Structure du Projet

```
dream-system/
├── executor.js          # Exécuteur principal (pipeline en 4 phases)
├── aiAnalyzer.js        # Module d'analyse IA (appelle le grand modèle pour extraire la mémoire)
├── pruner.js            # Module d'élagage intelligent (double moteur IA + règles)
├── config.js            # Gestion de la configuration
├── scripts/
│   └── cleanup-before-release.sh  # Script de nettoyage pré-lancement
└── docs/
    └── RELEASE_CHECKLIST.md       # Liste de vérification de lancement
```

## Description des Modules

### executor.js — Exécuteur Principal

Pipeline en 4 phases : lecture de la mémoire à court terme → analyse IA → intégration à la mémoire à long terme → élagage intelligent. Saute automatiquement l'exécution lorsqu'il n'y a pas de nouvelles mémoires à court terme.

### aiAnalyzer.js — Analyse IA

Appelle le grand modèle pour analyser le contenu des fichiers de mémoire à court terme et extraire des informations structurées telles que le titre, le contenu, la catégorie et la priorité. Si aucune clé API n'est configurée, l'analyse IA est ignorée sans erreur.

### pruner.js — Élagage Intelligent

- **Condition de déclenchement** : MEMORY.md dépasse 25 Ko ou 200 lignes
- **Mode IA** : Appelle le grand modèle pour analyser chaque section et générer des recommandations de suppression/conservation
- **Mode Règles** : Bascule automatique vers l'élagage basé sur des règles lorsque l'IA n'est pas disponible (faible priorité +7 jours, priorité moyenne +30 jours, contenu temporaire +1 jour)
- **Écriture Sécurisée** : Sauvegarde avant écriture → écriture dans un fichier temporaire → vérification non vide → remplacement atomique

### config.js — Gestion de la Configuration

Gestion centralisée de la configuration IA et système, entièrement remplaçable via des variables d'environnement.

## Méthode de Configuration

Il est recommandé d'utiliser un fichier `.env` (déjà dans `.gitignore`) :

```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.6-plus
DREAM_API_URL=https://coding.dashscope.aliyuncs.com/v1
```

## Historique des Versions

### v1.1.0 (2026-04-19)

- Modèle par défaut mis à niveau : `qwen3.5-plus` → `qwen3.6-plus`
- Adresse API changée en `coding.dashscope.aliyuncs.com/v1`, prend en charge la variable d'environnement `DREAM_API_URL`
- `integrateMemories` entièrement implémenté : sauvegarde automatique + ajout structuré + validation du contenu
- Chemin d'analyse IA construit dynamiquement, compatible avec différents formats de baseUrl

### v1.0.0 (2026-04-03)

- Version initiale

## Licence

MIT
