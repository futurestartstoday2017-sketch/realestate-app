-- =========================================================
-- 不動産管理アプリ用テーブル（Supabase の SQL Editor で実行する）
-- =========================================================

-- 物件テーブル
create table if not exists public.properties (
  id          uuid primary key default gen_random_uuid(),
  -- 登録したユーザー（未指定ならログイン中のユーザーが自動で入る）
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 100),   -- 物件名
  rent        integer not null check (rent >= 0),                           -- 家賃（円）
  area        text not null check (char_length(area) between 1 and 100),   -- エリア名
  layout      text not null check (char_length(layout) between 1 and 20),  -- 間取り（例：1LDK）
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ユーザーごとの検索を速くするためのインデックス
create index if not exists properties_user_id_idx on public.properties (user_id);

-- 更新時に updated_at を自動で現在時刻にするトリガー
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------
-- 行レベルセキュリティ（RLS）
-- ---------------------------------------------------------
alter table public.properties enable row level security;

-- ログインユーザーにだけ操作権限を与える（未ログインの anon には与えない）
revoke all on public.properties from anon;
grant select, insert, update, delete on public.properties to authenticated;

-- 自分が登録した物件のみ表示できる
drop policy if exists "自分の物件を表示" on public.properties;
create policy "自分の物件を表示" on public.properties
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- 自分の物件としてのみ登録できる（他人の user_id では登録不可）
drop policy if exists "自分の物件を登録" on public.properties;
create policy "自分の物件を登録" on public.properties
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- 自分の物件のみ編集できる（所有者を他人に書き換えることも不可）
drop policy if exists "自分の物件を編集" on public.properties;
create policy "自分の物件を編集" on public.properties
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 自分の物件のみ削除できる
drop policy if exists "自分の物件を削除" on public.properties;
create policy "自分の物件を削除" on public.properties
  for delete to authenticated
  using ((select auth.uid()) = user_id);
