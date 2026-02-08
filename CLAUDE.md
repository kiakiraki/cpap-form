# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CPAPデータ入力フォームのWebアプリケーション。Cloudflare Workers上で動作し、バックエンドAPIとして別のWorker（`health-sync-api`）にService Bindingで接続する。

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono (Web framework)
- **Frontend**: 静的HTML + Tailwind CSS (CDN) + Vanilla JS
- **Language**: TypeScript
- **Build/Deploy**: Wrangler

## Commands

```bash
npm run dev       # ローカル開発サーバー起動 (wrangler dev)
npm run deploy    # Cloudflare Workersへデプロイ (wrangler deploy)
```

## Architecture

```
public/index.html  → 静的フォームUI（Cloudflare Workers Assetsとして配信）
src/index.ts       → Hono APIサーバー（POST /api/cpap のみ）
```

- `public/` ディレクトリはWrangler Assetsとして配信される（`wrangler.toml` の `[assets]` 設定）
- `src/index.ts` がWorkerのエントリーポイント。フォームから受け取ったCPAPデータを `HEALTH_SYNC_API` Service Binding経由でバックエンドに転送する

## Bindings (wrangler.toml)

- `HEALTH_SYNC_API`: Service Binding → `health-sync-api` Worker
- `HEALTH_SYNC_API_KEY`: Secret（`wrangler secret put` で設定）。バックエンドAPIの認証用Bearerトークン

## Form Fields

- `recorded_date`: 記録日（date, required）
- `ahi`: 無呼吸低呼吸指数（number, required）
- `ai`: 無呼吸指数（number, optional）
- `leak`: リーク量 L/min（number, optional）
- `usage_hours`: 使用時間（number, optional, 0-24）
- `notes`: メモ（text, optional）
