<!-- README in 日本語 -->

**🌍 Languages**: 中文 | [English](README_EN.md) | [日本語](README_JP.md) | [Español](README_ES.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [한국어](README_KR.md)


# 🌙 Dream 記憶統合システム

> 自動化された記憶管理システム — 短期記憶を自動的に長期記憶へ統合し、MEMORY.md をシンプルかつ効率的に保ちます。

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 概要

Dream は自動化された記憶統合システムです。定期的に `memory/` ディレクトリ下の短期記憶ファイルを読み取り、AI によって価値のある情報を抽出し、長期記憶ファイル `MEMORY.md` に自動的に追記します。スマート剪定（プルーニング）によってファイルサイズをコンパクトに保ちます。

設計のインスピレーションは Claude Code の記憶管理メカニズムに由来し、OpenClaw の記憶体系に適応しています。

## コア機能

| 機能 | 説明 |
|------|------|
| AI 智能分析 | qwen3.6-plus モデルを使用して短期記憶を分析し、3〜5 件の高価値な長期記憶を抽出 |
| 自動統合 | 分析結果を構造化された形式で MEMORY.md に追記 |
| 自動バックアップ | 書き込み前に MEMORY.md を自動的にバックアップし、データの消失を防止 |
| コンテンツ検証 | 空の内容または短すぎる内容（<100 文字）をスキップし、無効な書き込みを防止 |
| 智能剪定 | AI + ルールのデュアルエンジンに基づき、期限切れまたは低優先度のセクションを自動的に識別・削除 |

## 実行フロー

```
Phase 1 ── 短期記憶の読み取り
   │           memory/ ディレクトリ内の全 .md ファイルをスキャン
   ▼
Phase 2 ── AI 智能分析
   │           大規模モデルを呼び出して価値のある長期記憶を抽出
   ▼
Phase 3 ── 長期記憶への統合
   │           MEMORY.md をバックアップ → 構造化追記 → コンテンツ検証
   ▼
Phase 4 ── 智能剪定
               ファイルが 25KB または 200 行を超えると自動的に剪定
```

## クイックスタート

### 1. 設定

環境変数を設定します：

```bash
export DREAM_API_KEY="your-api-key-here"
```

オプションの環境変数：

| 変数 | 説明 | デフォルト値 |
|------|------|--------|
| `DREAM_API_KEY` | API キー（必須） | — |
| `DREAM_MODEL` | AI モデル | `qwen3.6-plus` |
| `DREAM_API_URL` | API アドレス | `https://coding.dashscope.aliyuncs.com/v1` |
| `DREAM_MEMORY_DIR` | 記憶ディレクトリ | `./memory` |
| `DREAM_LOG_FILE` | ログファイル | `./dream.log` |

### 2. 手動実行

```bash
node executor.js
```

### 3. 定时実行（推奨）

crontab で毎日午前 5 時に自動実行：

```bash
crontab -e
# 以下の行を追加
0 5 * * * cd /path/to/dream-system && node executor.js >> logs/dream.log 2>&1
```

## プロジェクト構造

```
dream-system/
├── executor.js          # 主実行器（4 ステージパイプライン）
├── aiAnalyzer.js        # AI 分析モジュール（大規模モデルを呼び出して記憶を抽出）
├── pruner.js            # 智能剪定モジュール（AI + ルールのデュアルエンジン）
├── config.js            # 設定管理
├── scripts/
│   └── cleanup-before-release.sh  # リリース前クリーンアップスクリプト
└── docs/
    └── RELEASE_CHECKLIST.md       # リリースチェックリスト
```

## モジュール説明

### executor.js — 主実行器

4 ステージパイプライン：短期記憶の読み取り → AI 分析 → 長期記憶への統合 → 智能剪定。新しい短期記憶がない場合は自動的に実行をスキップします。

### aiAnalyzer.js — AI 分析

大規模モデルを呼び出して短期記憶ファイルの内容を分析し、タイトル、内容、カテゴリ、優先度などの構造化情報を抽出します。API キーが設定されていない場合は AI 分析をスキップし、エラーにはなりません。

### pruner.js — 智能剪定

- **トリガー条件**：MEMORY.md が 25KB または 200 行を超える
- **AI モード**：大規模モデルを呼び出して各セクションを分析し、削除/保持の提案を生成
- **ルールモード**：AI が利用できない場合はルールベースの剪定に自動フォールバック（低優先度 +7 日、中優先度 +30 日、一時コンテンツ +1 日）
- **安全な書き込み**：書き込み前にバックアップ → 一時ファイルに書き込み → 空でないことを検証 → アトミック置換

### config.js — 設定管理

AI 設定とシステム設定を一元管理し、すべて環境変数での上書きに対応。

## 設定方法

`.env` ファイルの使用を推奨（すでに `.gitignore` に含まれています）：

```bash
DREAM_API_KEY=your-api-key-here
DREAM_MODEL=qwen3.6-plus
DREAM_API_URL=https://coding.dashscope.aliyuncs.com/v1
```

## バージョン履歴

### v1.1.0 (2026-04-19)

- デフォルトモデルをアップグレード：`qwen3.5-plus` → `qwen3.6-plus`
- API アドレスを `coding.dashscope.aliyuncs.com/v1` に変更、`DREAM_API_URL` 環境変数をサポート
- `integrateMemories` の完全実装：自動バックアップ + 構造化追記 + コンテンツ検証
- AI 分析パスを動的にベース URL から構築し、異なる baseUrl 形式に対応

### v1.0.0 (2026-04-03)

- 初期バージョンリリース

## ライセンス

MIT
