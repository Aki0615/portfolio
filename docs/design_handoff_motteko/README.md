# Handoff: Motteko Detail Screen

## Overview
ポートフォリオ内の「制作物」セクションに表示する、ハッカソン作品 **Motteko**（忘れ物通知アプリ）の詳細スクリーン。アプリの背景・解決策・担当・受賞を、iPhone モックアップ + 4ブロックのストーリー + ダーク Stats バーで紹介します。

## About the Design Files
本パッケージに含まれる `motteko_screen.html` は、**意図された見た目とふるまいを示すデザインリファレンス（HTMLプロトタイプ）** であり、そのまま本番に投入するためのコードではありません。実装側のコードベース（React / Vue / Next.js / SwiftUI / native 等）に応じて、既存パターン・既存コンポーネント・既存デザインシステムに沿って **再実装** してください。新規コードベースであれば、最も適したフレームワークを選定してください。

## Fidelity
**High-fidelity (hifi)** — 配色・タイポ・余白・角丸・影・アニメーションは最終値。下記の Design Tokens / 寸法に従ってピクセル忠実に再現してください。

## Screen
### Motteko Detail Screen
- **Purpose**: Motteko 作品の詳細をストーリー形式で訴求する
- **Layout (desktop)**: max-width 1280px、外側カード `border-radius:32px`、padding `60px 56px 56px`、背景は淡いブルー → 白の縦グラデ `linear-gradient(180deg,#f6f8ff 0%,#fff 100%)`、四隅にぼかし円（右上 420px ブルー、左下 360px 薄ブルー）
- **Sections**（縦順）:
  1. **Header (`.md-head`)** — 中央寄せ。ピル型タグ → 巨大タイトル → サブテキスト
  2. **Two-column grid (`.md-grid`)** — `grid-template-columns:380px 1fr; gap:60px`
     - 左: iPhone モック + 浮遊 chip 3個
     - 右: ストーリー4ブロック（番号バッジ付き）
  3. **Stats bar (`.md-stats`)** — ダーク背景 6カラム、各セルを `1px rgba(255,255,255,.1)` で区切る
- **Responsive**: `max-width: 900px` で grid を 1col / stats を 2col に折り返す

## Components

### 1. Header (`.md-head`)
- Tag pill `.md-tag`: text "DEEP DIVE · CASE 01"、`background:#dbe3ff`、`color:#1C3CFF`、JetBrains Mono 11px / weight 700 / letter-spacing .25em、padding `6px 16px`、border-radius 20px
- Title `.md-title`: "Motteko." Inter 900 / `clamp(72px,9vw,128px)` / letter-spacing -.04em、`color:#1C3CFF`、末尾の `.` だけ `#0f1420`
- Sub `.md-sub`: 15px / line-height 1.85 / `#6b7380`、max-width 640px、`<b>` は ink

### 2. Phone Mockup (`.md-phone .phone`)
- Frame: 300px × aspect-ratio 9/19、`background:#0f1420`、padding 14px、border-radius 42px、shadow `0 30px 70px rgba(15,20,32,.30), 0 8px 20px rgba(15,20,32,.18), inset 0 0 0 2px #1a2030`
- Notch: 110×28、`background:#0a0e18`、border-radius 18px、上から 18px、中央
- Screen: 白、border-radius 30px、padding `42px 16px 14px`、内部は flex column gap 10px
- 内部要素（上から）:
  - `.ps-status`: "9:41" / 青ドット "●●●"
  - `.ps-h1`: "こんにちは、えいでんさん" Noto Sans JP 800 18px
  - `.ps-card.primary` (Today list): ブルーグラデ `135deg #1C3CFF→#3653ff`、内部に header (pill "今日の持ち物" + count "3 / 5") と list (5 items, on=学生証/鍵/イヤホン)。check icon は丸ボーダー、on で白塗り＆青チェックマーク
  - `.ps-card.alert`: `bg #fff8e6 border 1.5px #ffd966`、`!` アイコン 28px 円 `#ff9c2a`、タイトル "玄関を出ました"、サブ "水筒・傘を忘れていませんか？"
  - `.ps-tab`: 4 labels (Home/List/Alert/Profile)、`opacity .35`、on で `1` + `scale(1.1)`、上ボーダー `1px var(--line)`

### 3. Floating Chips (`.float-chip`)
- 3つのピル型 chip が phone 横に絶対配置 + `floatChip` 4s 上下バウンスアニメ（`translateY(0)→-8px`）
- c1: Geofence (top:60 left:-30) 白
- c2: Push通知 (top:200 right:-40) 白、delay 1.2s
- c3: 即時アラート (bottom:80 left:-10) ブルー塗り、delay 2.4s
- Padding `8px 14px`、border-radius 24px、shadow `0 12px 28px rgba(15,20,32,.16)`

### 4. Story Blocks (`.md-block` × 4)
- Container `.md-story`: flex column gap 32px
- 各ブロック: `padding-left:64px;position:relative`
- Number badge `.md-num`: 48×48、border-radius 14px、`background:#1C3CFF;color:#fff`、Inter 900 18px
- h3: Noto Sans JP 800 22px / line-height 1.4
- p: 14.5px / line-height 1.95 / `#6b7380`、`<b>` は ink
- 内容（コピー原文を変更しないこと）:
  - 01 背景 — 「忘れ物」って意外に取り返しがつかない
  - 02 解決策 — 出た瞬間に思い出させる
  - 03 担当 — Design / Front / Presentation
  - 04 結果 — サポーターズ賞 受賞

### 5. Stats Bar (`.md-stats`)
- `display:grid; grid-template-columns:repeat(6,1fr)`、`background:#0f1420`、`color:#fff`、border-radius 20px、overflow hidden
- 各セル: padding `22px 18px`、右ボーダー `1px rgba(255,255,255,.1)`（最終セルなし）
- Key `.k`: JetBrains Mono 10px / letter-spacing .2em / `rgba(255,255,255,.5)`
- Value `.v`: Inter/NotoSansJP 700 14px、margin-top 8px
- データ:
  | Key | Value |
  |---|---|
  | EVENT | 技育CAMP 2025 Vol.19 |
  | DATE | 2026.02.08 |
  | TEAM | 3名 / シス研1年生 |
  | ROLE | Design / Front / 発表 |
  | STACK | Flutter · Firebase · RasPi |
  | AWARD | サポーターズ賞 *(value 色 = `#1C3CFF`)* |

## Interactions & Behavior
- **Floating chips**: `floatChip 4s ease-in-out infinite` — `translateY(0) ↔ -8px`、3つを 0 / 1.2s / 2.4s でずらす
- **Hover (オプション)**: 元プロトでは `.md-block` 単体のホバーは未定義。実装側のパターンに従って良い
- **Phone モックの中身は静的**。実機データに差し替える場合は props 化推奨

## State Management
本スクリーンは静的。チェックリストの on/off やアラート表示状態を将来データバインドする想定で、以下を props 化すると拡張容易:
- `userName` (string)
- `items: { label: string; checked: boolean }[]`
- `alert: { title: string; subtitle: string } | null`

## Design Tokens
```
--blue       #1C3CFF
--blue-deep  #0a24c9
--blue-soft  #dbe3ff
--ink        #0f1420
--paper      #ffffff
--paper-2    #f6f7fb
--line       #e1e4ea
--muted      #6b7380
```
- Radius: 14 / 18 / 20 / 24 / 30 / 32 / 42
- Shadows:
  - card: `0 4px 16px rgba(15,20,32,.04)`
  - phone: `0 30px 70px rgba(15,20,32,.30), 0 8px 20px rgba(15,20,32,.18), inset 0 0 0 2px #1a2030`
  - chip: `0 12px 28px rgba(15,20,32,.16)`
  - chip blue: `0 12px 28px rgba(28,60,255,.4)`
- Fonts: `Inter` (400-900) / `Noto Sans JP` (400-900) / `JetBrains Mono` (400/500/700) — Google Fonts
- Type scale: title `clamp(72px,9vw,128px)`、h3 22px、body 14.5–15px、mono 10–11px

## Assets
画像は使用せず、すべて CSS / テキストラベルで構成。プロダクションでは Lucide / Material Icons などへ置き換えを検討してください。

## Files
- `motteko_screen.html` — 単独動作するデザインリファレンス（このスクリーンだけを表示）
- `Portfolio.html`（同梱、参考用）— ポートフォリオ全体の中での文脈を確認するための完全版
