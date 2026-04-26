import { useNavigate } from 'react-router-dom'
import { useDiary } from '../context/DiaryContext'
import EntryForm from '../components/EntryForm'

export default function NewEntry() {
  const { addEntry } = useDiary()
  const navigate = useNavigate()

  async function handleSubmit(data) {
    const id = addEntry(data)
    navigate(data.images?.length > 0 ? `/arrange/${id}` : `/entry/${id}`)
  }

  return (
    <div className="page">
      <h1 className="page-title">New Entry</h1>
      <p className="page-subtitle">What's on your mind?</p>
      <EntryForm onSubmit={handleSubmit} submitLabel="Save entry" />
    </div>
  )
}
