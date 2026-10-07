import { supabase } from './supabaseClient'

// 物件テーブルへの CRUD 操作をまとめたモジュール
// ※ どのユーザーの物件を扱えるかは Supabase 側の RLS で制御している

const TABLE = 'properties'
const COLUMNS = 'id, name, rent, area, layout, created_at'

// 一覧取得（SELECT）：新しく登録した順に並べる
export async function fetchProperties() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(COLUMNS)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// 新規登録（INSERT）：user_id はテーブルの既定値でログイン中のユーザーが入る
export async function createProperty(values) {
  const { data, error } = await supabase.from(TABLE).insert(values).select(COLUMNS).single()
  if (error) throw error
  return data
}

// 編集（UPDATE）
export async function updateProperty(id, values) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(values)
    .eq('id', id)
    .select(COLUMNS)
    .single()
  if (error) throw error
  return data
}

// 削除（DELETE）
export async function deleteProperty(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) throw error
}
