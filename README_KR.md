<!-- README in 한국어 -->

**🌍 Languages**: 中文 | [English](README_EN.md) | [日本語](README_JP.md) | [Español](README_ES.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [한국어](README_KR.md)


# 🌙 Dream 기억 통합 시스템

> 자동화된 기억 관리 시스템 — 단기 기억을 자동으로 장기 기억으로 통합하여 MEMORY.md 를 간결하고 효율적으로 유지합니다.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 개요

Dream 은 자동화된 기억 통합 시스템입니다. 주기적으로 `memory/` 디렉토리의 단기 기억 파일을 읽고, AI 를 사용하여 가치 있는 정보를 추출하며, 장기 기억 파일 `MEMORY.md` 에 자동으로 추가합니다. 스마트 가지치기로 파일 크기를 컴팩트하게 유지합니다.

Claude Code 의 기억 관리 메커니즘에서 영감을 받아 OpenClaw 의 기억 체계에 맞게 적응했습니다.

## 핵심 기능

| 기능 | 설명 |
|------|------|
| AI 스마트 분석 | qwen3.6-plus 모델을 사용하여 단기 기억을 분석하고 3-5 개의 고가치 장기 기억을 추출 |
| 자동 통합 | 분석 결과를 구조화된 형식으로 MEMORY.md 에 추가 |
| 자동 백업 | 쓰기 전 MEMORY.md 를 자동으로 백업하여 데이터 손실 방지 |
| 콘텐츠 검증 | 비어 있거나 너무 짧은 콘텐츠(<100 자)를 건너뛰어 잘못된 쓰기 방지 |
| 스마트 가지치기 | AI + 규칙 듀얼 엔진을 기반으로 만료되거나 낮은 우선순위의 섹션을 자동으로 식별 및 삭제 |

## 실행 흐름

```
Phase 1 ── 단기 기억 읽기
   │           memory/ 디렉토리의 모든 .md 파일 스캔
   ▼
Phase 2 ── AI 스마트 분석
   │           대형 모델을 호출하여 가치 있는 장기 기억 추출
   ▼
Phase 3 ── 장기 기억으로 통합
   │           MEMORY.md 백업 → 구조화된 추가 → 콘텐츠 검증
   ▼
Phase 4 ── 스마트 가지치기
               파일이 25KB 또는 200 줄을 초과할 때 자동으로 가지치기
```

## 빠른 시작

### 1. 설정

환경 변수 설정:

```bash
export DREAM_API_KEY="your-api-key-here"
```

선택적 환경 변수:

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `DREAM_API_KEY` | API 키 (필수) | — |
| `DREAM_MODEL` | AI 모델 | `qwen3.6-plus` |
| `DREAM_API_URL` | API 주소 | `https://coding.dashscope.aliyuncs.com/v1` |
| `DREAM_MEMORY_DIR` | 기억 디렉토리 | `./memory` |
| `DREAM_LOG_FILE` | 로그 파일 | `./dream.log` |

### 2. 수동 실행

```bash
node executor.js
```

### 3.定时 실행 (권장)

crontab 을 통해 매일 오전 5 시에 자동 실행:

```bash
crontab -e
# 다음 행 추가
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

## 프로젝트 구조

```
dream-system/
├── executor.js          # 메인 실행기 (4 단계 파이프라인)
├── aiAnalyzer.js        # AI 분석 모듈 (대형 모델을 호출하여 기억 추출)
├── pruner.js            # 스마트 가지치기 모듈 (AI + 규칙 듀얼 엔진)
├── config.js            # 설정 관리
├── scripts/
│   └── cleanup-before-release.sh  # 릴리스 전 정리 스크립트
└── docs/
    └── RELEASE_CHECKLIST.md       # 릴리스 체크리스트
```

## 모듈 설명

### executor.js — 메인 실행기

4 단계 파이프라인: 단기 기억 읽기 → AI 분석 → 장기 기억 통합 → 스마트 가지치기. 새로운 단기 기억이 없을 때 자동으로 실행을 건너뜁니다.

### aiAnalyzer.js — AI 분석

대형 모델을 호출하여 단기 기억 파일의 내용을 분석하고 제목, 내용, 카테고리, 우선순위 등의 구조화된 정보를 추출합니다. API 키가 설정되지 않은 경우 AI 분석을 건너뛰며 오류를 발생시키지 않습니다.

### pruner.js — 스마트 가지치기

- **트리거 조건**: MEMORY.md 가 25KB 또는 200 줄을 초과
- **AI 모드**: 대형 모델을 호출하여 각 섹션을 분석하고 삭제/유지 제안 생성
- **규칙 모드**: AI 를 사용할 수 없을 때 규칙 기반 가지치기로 자동 폴백 (낮은 우선순위 +7 일, 중간 우선순위 +30 일, 임시 콘텐츠 +1 일)
- **안전한 쓰기**: 쓰기 전 백업 → 임시 파일에 쓰기 → 비어 있지 않음 검증 → 원자적 교체

### config.js — 설정 관리

AI 설정과 시스템 설정을 중앙에서 관리하며, 모두 환경 변수로 재정의 가능.

## 설정 방법

`.env` 파일 사용을 권장합니다 (이미 `.gitignore` 에 포함됨):

```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.6-plus
DREAM_API_URL=https://coding.dashscope.aliyuncs.com/v1
```

## 버전 이력

### v1.1.0 (2026-04-19)

- 기본 모델 업그레이드: `qwen3.5-plus` → `qwen3.6-plus`
- API 주소를 `coding.dashscope.aliyuncs.com/v1` 로 변경, `DREAM_API_URL` 환경 변수 지원
- `integrateMemories` 완전 구현: 자동 백업 + 구조화된 추가 + 콘텐츠 검증
- AI 분석 경로를 baseUrl 에서 동적으로 구성하여 다양한 baseUrl 형식과 호환

### v1.0.0 (2026-04-03)

- 초기 버전 출시

## 라이선스

MIT
