<!-- README in Deutsch -->

**🌍 Languages**: 中文 | [English](README_EN.md) | [日本語](README_JP.md) | [Español](README_ES.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [한국어](README_KR.md)


# 🌙 Dream Speicher-Integrationssystem

> Automatisiertes Speicherverwaltungssystem — konsolidiert Kurzzeitspeicher in Langzeitspeicher und hält MEMORY.md schlank und effizient.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Übersicht

Dream ist ein automatisiertes Speicher-Integrationssystem. Es liest regelmäßig Kurzzeitspeicher-Dateien aus dem `memory/`-Verzeichnis, nutzt KI zur Extraktion wertvoller Informationen und fügt diese automatisch der Langzeitspeicher-Datei `MEMORY.md` hinzu. Intelligentes Beschneiden hält die Datei kompakt.

Inspiriert vom Speicherverwaltungsmechanismus von Claude Code, angepasst an das Speichersystem von OpenClaw.

## Kernfunktionen

| Funktion | Beschreibung |
|------|------|
| KI-gestützte Analyse | Verwendet das qwen3.6-plus-Modell zur Analyse von Kurzzeitspeicher und Extraktion von 3-5 hochwertigen Langzeiterinnerungen |
| Automatische Integration | Fügt Analyseergebnisse in strukturiertem Format zu MEMORY.md hinzu |
| Automatisches Backup | Sichert MEMORY.md automatisch vor jedem Schreibvorgang, um Datenverlust zu verhindern |
| Inhaltsvalidierung | Überspringt leere oder zu kurze Inhalte (<100 Zeichen), um ungültige Schreibvorgänge zu verhindern |
| Intelligentes Beschneiden | Dual-Engine aus KI + Regeln zur automatischen Identifizierung und Entfernung veralteter oder niedrigprioritärer Abschnitte |

## Ausführungsablauf

```
Phase 1 ── Kurzzeitspeicher lesen
   │           Alle .md-Dateien im memory/-Verzeichnis scannen
   ▼
Phase 2 ── KI-gestützte Analyse
   │           Großes Modell aufrufen, um wertvolle Langzeiterinnerungen zu extrahieren
   ▼
Phase 3 ── Integration in Langzeitspeicher
   │           MEMORY.md sichern → Strukturiertes Anhängen → Inhaltsvalidierung
   ▼
Phase 4 ── Intelligentes Beschneiden
               Automatisches Beschneiden, wenn die Datei 25KB oder 200 Zeilen überschreitet
```

## Schnellstart

### 1. Konfiguration

Umgebungsvariablen setzen:

```bash
export DREAM_API_KEY="your-api-key-here"
```

Optionale Umgebungsvariablen:

| Variable | Beschreibung | Standardwert |
|------|------|--------|
| `DREAM_API_KEY` | API-Schlüssel (erforderlich) | — |
| `DREAM_MODEL` | KI-Modell | `qwen3.6-plus` |
| `DREAM_API_URL` | API-Adresse | `https://coding.dashscope.aliyuncs.com/v1` |
| `DREAM_MEMORY_DIR` | Speicherverzeichnis | `./memory` |
| `DREAM_LOG_FILE` | Protokolldatei | `./dream.log` |

### 2. Manuelle Ausführung

```bash
node executor.js
```

### 3. Geplante Ausführung (Empfohlen)

Tägliche automatische Ausführung um 5:00 Uhr über crontab:

```bash
crontab -e
# Folgende Zeile hinzufügen
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

## Projektstruktur

```
dream-system/
├── executor.js          # Hauptausführer (4-Phasen-Pipeline)
├── aiAnalyzer.js        # KI-Analysemodul (ruft großes Modell zur Speicherextraktion auf)
├── pruner.js            # Intelligentes Beschneidungsmodul (KI + Regeln Dual-Engine)
├── config.js            # Konfigurationsverwaltung
├── scripts/
│   └── cleanup-before-release.sh  # Bereinigungsskript vor Veröffentlichung
└── docs/
    └── RELEASE_CHECKLIST.md       # Veröffentlichungs-Checkliste
```

## Modulbeschreibung

### executor.js — Hauptausführer

4-Phasen-Pipeline: Kurzzeitspeicher lesen → KI-Analyse → Integration in Langzeitspeicher → Intelligentes Beschneiden. Überspringt die Ausführung automatisch, wenn keine neuen Kurzzeitspeicher vorhanden sind.

### aiAnalyzer.js — KI-Analyse

Ruft das große Modell auf, um den Inhalt von Kurzzeitspeicher-Dateien zu analysieren und strukturierte Informationen wie Titel, Inhalt, Kategorie und Priorität zu extrahieren. Wenn kein API-Schlüssel konfiguriert ist, wird die KI-Analyse ohne Fehler übersprungen.

### pruner.js — Intelligentes Beschneiden

- **Auslösebedingung**: MEMORY.md überschreitet 25KB oder 200 Zeilen
- **KI-Modus**: Ruft das große Modell auf, um jeden Abschnitt zu analysieren und Lösch-/Beibehaltungsempfehlungen zu generieren
- **Regelmodus**: Automatischer Fallback auf regelbasiertes Beschneiden, wenn KI nicht verfügbar ist (niedrige Priorität +7 Tage, mittlere Priorität +30 Tage, temporäre Inhalte +1 Tag)
- **Sicheres Schreiben**: Backup vor dem Schreiben → Schreiben in temporäre Datei → Prüfung auf Nicht-Leerheit → Atomarer Ersatz

### config.js — Konfigurationsverwaltung

Zentralisierte Verwaltung von KI- und Systemkonfiguration, vollständig durch Umgebungsvariablen überschreibbar.

## Konfigurationsmethode

Empfohlen wird die Verwendung einer `.env`-Datei (bereits in `.gitignore` enthalten):

```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.6-plus
DREAM_API_URL=https://coding.dashscope.aliyuncs.com/v1
```

## Versionsverlauf

### v1.1.0 (2026-04-19)

- Standardmodell aktualisiert: `qwen3.5-plus` → `qwen3.6-plus`
- API-Adresse geändert zu `coding.dashscope.aliyuncs.com/v1`, unterstützt `DREAM_API_URL`-Umgebungsvariable
- `integrateMemories` vollständig implementiert: automatisches Backup + strukturiertes Anhängen + Inhaltsvalidierung
- KI-Analysepfad dynamisch aus baseUrl aufgebaut, kompatibel mit verschiedenen baseUrl-Formaten

### v1.0.0 (2026-04-03)

- Erste Veröffentlichung

## Lizenz

MIT
