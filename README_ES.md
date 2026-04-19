<!-- README in Español -->

**🌍 Languages**: 中文 | [English](README_EN.md) | [日本語](README_JP.md) | [Español](README_ES.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [한국어](README_KR.md)


# 🌙 Dream Sistema de Integración de Memoria

> Sistema automatizado de gestión de memoria — consolida memorias a corto plazo en memoria a largo plazo, manteniendo MEMORY.md conciso y eficiente.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Descripción General

Dream es un sistema automatizado de integración de memoria. Periódicamente lee los archivos de memoria a corto plazo del directorio `memory/`, utiliza IA para extraer información valiosa y la añade automáticamente al archivo de memoria a largo plazo `MEMORY.md`. El recorte inteligente mantiene el archivo compacto.

Inspirado en el mecanismo de gestión de memoria de Claude Code, adaptado al sistema de memoria de OpenClaw.

## Funciones Principales

| Función | Descripción |
|------|------|
| Análisis Inteligente con IA | Usa el modelo qwen3.6-plus para analizar memorias a corto plazo y extraer 3-5 memorias de alto valor a largo plazo |
| Integración Automática | Añade los resultados del análisis a MEMORY.md en formato estructurado |
| Respaldo Automático | Realiza un respaldo automático de MEMORY.md antes de cada escritura para prevenir pérdida de datos |
| Validación de Contenido | Omite contenido vacío o demasiado corto (<100 caracteres) para evitar escrituras inválidas |
| Recorte Inteligente | Motor dual basado en IA + reglas para identificar y eliminar automáticamente secciones obsoletas o de baja prioridad |

## Flujo de Ejecución

```
Fase 1 ── Lectura de Memoria a Corto Plazo
   │           Escanea todos los archivos .md en el directorio memory/
   ▼
Fase 2 ── Análisis Inteligente con IA
   │           Llama al modelo grande para extraer memorias valiosas a largo plazo
   ▼
Fase 3 ── Integración a Memoria a Largo Plazo
   │           Respaldo de MEMORY.md → Adición estructurada → Validación de contenido
   ▼
Fase 4 ── Recorte Inteligente
               Recorte automático cuando el archivo supera 25KB o 200 líneas
```

## Inicio Rápido

### 1. Configuración

Establece las variables de entorno:

```bash
export DREAM_API_KEY="your-api-key-here"
```

Variables de entorno opcionales:

| Variable | Descripción | Valor por Defecto |
|------|------|--------|
| `DREAM_API_KEY` | Clave API (obligatoria) | — |
| `DREAM_MODEL` | Modelo de IA | `qwen3.6-plus` |
| `DREAM_API_URL` | Dirección API | `https://coding.dashscope.aliyuncs.com/v1` |
| `DREAM_MEMORY_DIR` | Directorio de memoria | `./memory` |
| `DREAM_LOG_FILE` | Archivo de registro | `./dream.log` |

### 2. Ejecución Manual

```bash
node executor.js
```

### 3. Ejecución Programada (Recomendado)

Ejecución automática diaria a las 5:00 AM mediante crontab:

```bash
crontab -e
# Añadir la siguiente línea
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

## Estructura del Proyecto

```
dream-system/
├── executor.js          # Ejecutor principal (pipeline de 4 fases)
├── aiAnalyzer.js        # Módulo de análisis con IA (llama al modelo grande para extraer memoria)
├── pruner.js            # Módulo de recorte inteligente (motor dual IA + reglas)
├── config.js            # Gestión de configuración
├── scripts/
│   └── cleanup-before-release.sh  # Script de limpieza pre-lanzamiento
└── docs/
    └── RELEASE_CHECKLIST.md       # Lista de verificación de lanzamiento
```

## Descripción de Módulos

### executor.js — Ejecutor Principal

Pipeline de 4 fases: lectura de memoria a corto plazo → análisis con IA → integración a memoria a largo plazo → recorte inteligente. Omite automáticamente la ejecución cuando no hay nuevas memorias a corto plazo.

### aiAnalyzer.js — Análisis con IA

Llama al modelo grande para analizar el contenido de los archivos de memoria a corto plazo y extraer información estructurada como título, contenido, categoría y prioridad. Si no hay clave API configurada, omite el análisis con IA sin generar error.

### pruner.js — Recorte Inteligente

- **Condición de activación**: MEMORY.md supera 25KB o 200 líneas
- **Modo IA**: Llama al modelo grande para analizar cada sección y generar recomendaciones de eliminar/mantener
- **Modo Reglas**: Degradación automática a recorte basado en reglas cuando la IA no está disponible (baja prioridad +7 días, prioridad media +30 días, contenido temporal +1 día)
- **Escritura Segura**: Respaldo antes de escribir → escribir a archivo temporal → verificar que no esté vacío → reemplazo atómico

### config.js — Gestión de Configuración

Gestión centralizada de configuración de IA y del sistema, totalmente reemplazable mediante variables de entorno.

## Método de Configuración

Se recomienda usar un archivo `.env` (ya incluido en `.gitignore`):

```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.6-plus
DREAM_API_URL=https://coding.dashscope.aliyuncs.com/v1
```

## Historial de Versiones

### v1.1.0 (2026-04-19)

- Modelo por defecto actualizado: `qwen3.5-plus` → `qwen3.6-plus`
- Dirección API cambiada a `coding.dashscope.aliyuncs.com/v1`, soporta variable de entorno `DREAM_API_URL`
- `integrateMemories` implementado completamente: respaldo automático + adición estructurada + validación de contenido
- Ruta de análisis con IA construida dinámicamente, compatible con diferentes formatos de baseUrl

### v1.0.0 (2026-04-03)

- Lanzamiento inicial

## Licencia

MIT
