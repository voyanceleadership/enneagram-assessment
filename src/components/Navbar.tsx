import { FC } from 'react'

const Navbar: FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <a href="/" className="font-bold text-xl text-blue-600">
            Enneacademy
          </a>

          {/* Navigation Links */}
          <div className="flex space-x-8">
          <a href="/assessment" className="text-gray-600 hover:text-blue-600 transition-colors">
  Enneagram Assessment
</a>
            <a href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">
              eCourses
            </a>
            <a href="/store" className="text-gray-600 hover:text-blue-600 transition-colors">
              Store
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar