import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-8 lg:px-12 py-8 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
