import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { properties } from '../data/properties'

// 家賃を「¥128,000 / 月」の形式に整える
const formatRent = (rent) => `¥${rent.toLocaleString('ja-JP')} / 月`

// 物件一覧画面（ログイン後に表示）
export default function Properties() {
  const { user } = useAuth()
  const navigate = useNavigate()

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

      <main className="card-grid">
        {properties.map((p) => (
          <article key={p.id} className="card">
            <h2>{p.name}</h2>
            <p className="rent">{formatRent(p.rent)}</p>
            <p className="area">{p.area}</p>
          </article>
        ))}
      </main>
    </div>
  )
}
