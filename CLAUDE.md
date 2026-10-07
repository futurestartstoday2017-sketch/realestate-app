# CLAUDE.md

このファイルは、本リポジトリで作業する Claude Code へのガイドです。

## プロジェクト概要

- 名称: realestate-app
- 目的: Supabase 認証付きの不動産管理 Web アプリ
- 技術スタック: React + Vite、React Router、Supabase（@supabase/supabase-js）

## ディレクトリ構成

- `src/lib/supabaseClient.js` — Supabase クライアント（`.env` の値を使用）
- `src/contexts/AuthContext.jsx` — ログイン状態（セッション）を全体に提供
- `src/components/ProtectedRoute.jsx` — 未ログイン時に `/login` へリダイレクト
- `src/pages/` — 画面（`Login` / `Signup` / `Properties`）
- `src/data/properties.js` — 物件一覧のダミーデータ

## 開発コマンド

- `npm install` — 依存パッケージのインストール
- `npm run dev` — 開発サーバー起動（http://localhost:5173）
- `npm run build` — 本番用ビルド

## 環境変数

- `.env` に `VITE_SUPABASE_URL` と `VITE_SUPABASE_PUBLISHABLE_KEY` を設定する（雛形は `.env.example`）
- `.env` は `.gitignore` 済み。コミットしないこと

## コーディング規約

- 既存コードのスタイル・命名・コメント量に合わせる
- コメント・ドキュメントは日本語で記述してよい
- 秘密情報（APIキー、パスワード、`.env` など）はコミットしない

## Git 運用ルール

- **コードを変更するたびに、コミットして GitHub にプッシュすること。**
  - 1つの論理的な変更ごとにコミットする（複数の無関係な変更をまとめない）
  - コミット後は `git push` でリモート（`origin`）に反映する
- コミットメッセージは変更内容が分かる簡潔な日本語または英語で書く
  - 例: `物件一覧画面に検索フィルターを追加`
- `main` ブランチへの force push は禁止
- プッシュ前に、テストやビルドがある場合は通ることを確認する
- プッシュが失敗した場合（認証エラー、競合など）は、勝手に解決せずユーザーに報告する
