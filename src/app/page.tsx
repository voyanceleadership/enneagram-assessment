import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-blue-50 to-white text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Discover Your True Self</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Enneacademy helps you understand yourself and others through the wisdom of the Enneagram. Take our assessment, explore in-depth content, and join a community of self-discovery.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors">
            Take the Assessment
          </button>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-4">Scientific Assessment</h3>
                <p className="text-gray-600">Discover your Enneagram type through our carefully crafted assessment tool.</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-4">Expert Content</h3>
                <p className="text-gray-600">Access in-depth articles, videos, and courses about the Enneagram.</p>
              </div>
              <div className="text-center p-6">
                <h3 className="text-xl font-semibold mb-4">Community</h3>
                <p className="text-gray-600">Connect with others on their journey of self-discovery.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}