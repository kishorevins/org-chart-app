import { Routes, Route } from 'react-router-dom'
import OrgChart from './pages/OrgChart'
import OrgChartUp from './pages/OrgChartUp'
import OrgChartPyramid from './pages/OrgChartPyramid'
import OrgChartRoadmap from './pages/OrgChartRoadmap'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<OrgChart />} />
        <Route path="/upward" element={<OrgChartUp />} />
        <Route path="/pyramid" element={<OrgChartPyramid />} />
        <Route path="/roadmap" element={<OrgChartRoadmap />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
