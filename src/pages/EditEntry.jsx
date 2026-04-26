import { useParams, useNavigate } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import EntryForm from '../components/EntryForm'

export default function EditEntry() {
  const { id } = useParams()
  const { getEntry, updateEntry } = useDiary()
  const navigate = useNavigate()
  const entry = getEntry(id)

  if (!entry) {
    return (
      <div className="page">
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Entry not found</div>
        </div>
      </div>
    )
  }

  async function handleSubmit(data) {
    updateEntry(id, data)
    navigate(data.images?.length > 0 ? `/arrange/${id}` : `/entry/${id}`)
  }

  return (
    <div className="page">
      <EntryForm initial={entry} onSubmit={handleSubmit} submitLabel="Save changes" />
    </div>
  )
}
