import { useState } from 'react'

const EMPTY = { name: '', rent: '', area: '', layout: '' }

// 物件の登録・編集で共通して使うフォーム
// initialValues があれば編集、なければ新規登録として動く
export default function PropertyForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initialValues ? { ...initialValues, rent: String(initialValues.rent) } : EMPTY
  )
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 入力欄の値を更新する
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // 前後の空白を除き、家賃は数値に変換して送る
      await onSubmit({
        name: values.name.trim(),
        rent: Number(values.rent),
        area: values.area.trim(),
        layout: values.layout.trim(),
      })
      // 新規登録のときは次の入力のためにフォームを空にする
      if (!initialValues) setValues(EMPTY)
    } catch (err) {
      setError('保存に失敗しました：' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <label>
        物件名
        <input name="name" value={values.name} onChange={handleChange} maxLength={100} required />
      </label>
      <label>
        家賃（円）
        <input
          name="rent"
          type="number"
          min="0"
          step="1"
          value={values.rent}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        エリア名
        <input name="area" value={values.area} onChange={handleChange} maxLength={100} required />
      </label>
      <label>
        間取り
        <input
          name="layout"
          value={values.layout}
          onChange={handleChange}
          placeholder="例：1LDK"
          maxLength={20}
          required
        />
      </label>

      {error && <p className="message error">{error}</p>}

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? '保存中...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  )
}
