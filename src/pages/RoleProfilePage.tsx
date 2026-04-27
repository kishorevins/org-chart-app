import { useParams, useNavigate } from 'react-router-dom'
import { ROLE_FILE_MAP } from '../data/roleFileMap'
import './RoleProfilePage.css'

export default function RoleProfilePage() {
  const { roleId } = useParams<{ roleId: string }>()
  const navigate = useNavigate()
  const fileUrl = roleId ? ROLE_FILE_MAP[roleId] : undefined

  if (!fileUrl) {
    return (
      <div className="role-profile-missing">
        <p>Role profile not found.</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    )
  }

  return (
    <div className="role-profile-page">
      <button className="role-profile-back" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <iframe
        src={fileUrl}
        className="role-profile-iframe"
        title="Role Profile"
      />
    </div>
  )
}
