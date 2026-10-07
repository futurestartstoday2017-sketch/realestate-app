import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import {
  createProperty,
  deleteProperty,
  fetchProperties,
  updateProperty,
} from '../lib/propertiesApi'
import PropertyForm from '../components/PropertyForm'

// 家賃を「¥128,000 / 月」の形式に整える
const formatRent = (rent) => `¥${rent.toLocaleString('ja-JP')} / 月`

// 物件一覧画面（ログイン後に表示）
export default function Properties() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  // 編集中の物件の ID（編集していなければ null）
  const [editingId, setEditingId] = useState(null)

  // 画面を開いたときに Supabase から物件一覧を取得する
  useEffect(() => {
    fetchProperties()
      .then(setProperties)
      .catch((err) => setError('物件の取得に失敗しました：' + err.message))
      .finally(() => setLoading(false))
  }, [])

  // 新規登録：登録できたら一覧の先頭に追加する
  const handleCreate = async (values) => {
    const created = await createProperty(values)
    setProperties((prev) => [created, ...prev])
  }

  // 編集：保存できたら一覧の該当物件を置き換える
  const handleUpdate = async (id, values) => {
    const updated = await updateProperty(id, values)
    setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)))
    setEditingId(null)
  }

  // 削除：確認ダイアログで OK のときだけ削除する
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return
    try {
      await deleteProperty(property.id)
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    } catch (err) {
      setError('削除に失敗しました：' + err.message)
    }
  }

  // ログアウトしてログイン画面へ戻る
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="properties-page">
      <header className="header">
        <h1>物件一覧</h1>
        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button className="logout" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <h2>物件を登録</h2>
          <PropertyForm submitLabel="登録する" onSubmit={handleCreate} />
        </section>

        {error && <p className="message error">{error}</p>}

        {loading ? (
          <p className="loading">読み込み中...</p>
        ) : properties.length === 0 ? (
          <p className="empty">登録されている物件はありません。上のフォームから登録してください。</p>
        ) : (
          <div className="card-grid">
            {properties.map((p) =>
              editingId === p.id ? (
                // 編集中の物件はカードの代わりに編集フォームを表示する
                <article key={p.id} className="card">
                  <PropertyForm
                    initialValues={p}
                    submitLabel="保存する"
                    onSubmit={(values) => handleUpdate(p.id, values)}
                    onCancel={() => setEditingId(null)}
                  />
                </article>
              ) : (
                <article key={p.id} className="card">
                  <h3>{p.name}</h3>
                  <p className="rent">{formatRent(p.rent)}</p>
                  <p className="area">
                    {p.area}
                    <span className="layout">{p.layout}</span>
                  </p>
                  <div className="card-actions">
                    <button className="secondary" onClick={() => setEditingId(p.id)}>
                      編集
                    </button>
                    <button className="danger" onClick={() => handleDelete(p)}>
                      削除
                    </button>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </main>
    </div>
  )
}
