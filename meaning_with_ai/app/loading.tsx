export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce-gentle">🦉</div>
        <div className="text-blue-600 text-xl font-playful">Loading Visualize Dictionary...</div>
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
}
