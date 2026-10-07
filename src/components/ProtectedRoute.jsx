import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// ログインしている場合のみ子要素を表示し、未ログインならログイン画面へリダイレクトする
export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  // セッション確認中は何も判定しない（一瞬ログイン画面に飛ぶのを防ぐ）
  if (loading) {
    return <p className="loading">読み込み中...</p>
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}
