"use client"

export default function DebugPage() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_ENV: process.env.NODE_ENV,
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Environment Variables Debug</h1>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Current Environment Variables:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(envVars, null, 2)}</pre>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Status Check:</h2>
          <div className="space-y-2">
            <p
              className={`p-2 rounded ${envVars.NEXT_PUBLIC_SUPABASE_URL ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              Supabase URL: {envVars.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing"}
            </p>
            <p
              className={`p-2 rounded ${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              Supabase Anon Key: {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
