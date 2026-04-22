import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1>Welcome to Org Chart App</h1>
      <p>Visualize and manage your organization's structure.</p>
      <Link to="/org-chart">
        <button>View Org Chart</button>
      </Link>
    </div>
  )
}
