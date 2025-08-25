// "use client"

// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Navbar } from "@/components/navbar"
// import { CreditsDisplay } from "@/components/credits-display"
// import { useAuth } from "@/lib/auth-context"
// import { getCreditInfo, type CreditInfo } from "@/lib/credits"
// import { toast } from "sonner"
// import { User, Mail, School, Calendar, Heart, TrendingUp, Clock, Star } from "lucide-react"
// import Link from "next/link"

// export default function DashboardPage() {
//   const { user, profile, loading, signOut } = useAuth()
//   const router = useRouter()
//   const [creditInfo, setCreditInfo] = useState<CreditInfo>({
//     used: 0,
//     dailyLimit: 5,
//     plan: "GUEST",
//     remaining: 5,
//   })

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/signin")
//     }
//   }, [user, loading, router])

//   useEffect(() => {
//     const fetchCreditInfo = async () => {
//       if (user) {
//         const info = await getCreditInfo(user.id)
//         setCreditInfo(info)
//       }
//     }
//     fetchCreditInfo()
//   }, [user])

//   const handleSignOut = async () => {
//     try {
//       await signOut()
//       toast.success("Signed out successfully! 👋")
//       router.push("/")
//     } catch (error) {
//       toast.error("Failed to sign out")
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
//         <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
//       </div>
//     )
//   }

//   if (!user) {
//     return null
//   }

//   const getPlanBadgeColor = () => {
//     switch (creditInfo.plan) {
//       case "PRO":
//         return "bg-gradient-to-r from-yellow-400 to-orange-400 text-white"
//       case "FREE":
//         return "bg-gradient-to-r from-blue-400 to-purple-400 text-white"
//       default:
//         return "bg-gray-100 text-gray-700"
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
//       <Navbar />

//       <main className="container mx-auto px-4 py-16">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold font-playful text-gray-800 mb-4">Welcome to Your Dashboard! 🎉</h1>
//             <p className="text-lg text-gray-600 font-playful">Your personalized learning hub</p>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Profile Card */}
//             <div className="lg:col-span-2">
//               <Card className="shadow-xl rounded-3xl border-2 border-blue-200 mb-8">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 font-playful text-blue-700">
//                     <User className="w-5 h-5" />
//                     Your Profile
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <Mail className="w-4 h-4 text-gray-500" />
//                     <span className="font-playful">{user.email}</span>
//                   </div>

//                   {profile?.full_name && (
//                     <div className="flex items-center gap-3">
//                       <User className="w-4 h-4 text-gray-500" />
//                       <span className="font-playful">{profile.full_name}</span>
//                     </div>
//                   )}

//                   {profile?.school && (
//                     <div className="flex items-center gap-3">
//                       <School className="w-4 h-4 text-gray-500" />
//                       <span className="font-playful">{profile.school}</span>
//                     </div>
//                   )}

//                   {profile?.age && (
//                     <div className="flex items-center gap-3">
//                       <Calendar className="w-4 h-4 text-gray-500" />
//                       <span className="font-playful">{profile.age} years old</span>
//                     </div>
//                   )}

//                   <div className="flex items-center gap-3">
//                     <Star className="w-4 h-4 text-gray-500" />
//                     <span className={`px-3 py-1 rounded-full text-sm font-playful ${getPlanBadgeColor()}`}>
//                       {creditInfo.plan} Plan
//                     </span>
//                   </div>

//                   <div className="pt-4 flex gap-3">
//                     <Button
//                       onClick={() => router.push("/profile")}
//                       className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-playful"
//                     >
//                       Edit Profile ✏️
//                     </Button>
//                     {creditInfo.plan !== "PRO" && (
//                       <Button
//                         onClick={() => router.push("/pricing")}
//                         className="flex-1 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 font-playful"
//                       >
//                         Upgrade to Pro 👑
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Quick Actions */}
//               <Card className="shadow-xl rounded-3xl border-2 border-green-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 font-playful text-green-700">
//                     <Heart className="w-5 h-5" />
//                     Quick Actions
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid md:grid-cols-2 gap-4">
//                   <Button
//                     onClick={() => router.push("/")}
//                     className="rounded-xl bg-gradient-to-r from-green-500 to-blue-500 font-playful h-12"
//                   >
//                     🔍 Search Words
//                   </Button>

//                   <Button
//                     onClick={() => router.push("/history")}
//                     variant="outline"
//                     className="rounded-xl border-2 border-purple-200 font-playful h-12"
//                   >
//                     📚 View History
//                   </Button>

//                   <Button
//                     onClick={() => router.push("/favorites")}
//                     variant="outline"
//                     className="rounded-xl border-2 border-pink-200 font-playful h-12"
//                   >
//                     ⭐ My Favorites
//                   </Button>

//                   <Button
//                     onClick={() => router.push("/pricing")}
//                     variant="outline"
//                     className="rounded-xl border-2 border-yellow-200 font-playful h-12"
//                   >
//                     💎 Upgrade Plan
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Credits & Stats Sidebar */}
//             <div className="space-y-6">
//               {/* Credits Display */}
//               <CreditsDisplay />

//               {/* Daily Stats */}
//               <Card className="shadow-xl rounded-3xl border-2 border-purple-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 font-playful text-purple-700">
//                     <TrendingUp className="w-5 h-5" />
//                     Today's Activity
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="font-playful text-gray-600">Searches Used</span>
//                     <span className="font-bold font-playful text-purple-600">{creditInfo.used}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="font-playful text-gray-600">Words Learned</span>
//                     <span className="font-bold font-playful text-green-600">{creditInfo.used}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="font-playful text-gray-600">Plan Status</span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-playful ${getPlanBadgeColor()}`}>
//                       {creditInfo.plan}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Plan Benefits */}
//               <Card className="shadow-xl rounded-3xl border-2 border-yellow-200">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 font-playful text-yellow-700">
//                     <Clock className="w-5 h-5" />
//                     Plan Benefits
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <span className="text-green-500">✅</span>
//                     <span className="font-playful text-sm">{creditInfo.dailyLimit} daily searches</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-green-500">✅</span>
//                     <span className="font-playful text-sm">AI-powered definitions</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-green-500">✅</span>
//                     <span className="font-playful text-sm">Visual illustrations</span>
//                   </div>
//                   {creditInfo.plan === "PRO" && (
//                     <>
//                       <div className="flex items-center gap-2">
//                         <span className="text-green-500">✅</span>
//                         <span className="font-playful text-sm">Priority support</span>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-green-500">✅</span>
//                         <span className="font-playful text-sm">Advanced features</span>
//                       </div>
//                     </>
//                   )}
//                   {creditInfo.plan !== "PRO" && (
//                     <Button
//                       asChild
//                       size="sm"
//                       className="w-full mt-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 font-playful"
//                     >
//                       <Link href="/pricing">Upgrade for More! 🚀</Link>
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <Card className="shadow-xl rounded-3xl border-2 border-gray-200 mt-8">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2 font-playful text-gray-700">
//                 <Clock className="w-5 h-5" />
//                 Recent Activity
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-center py-8">
//                 <div className="text-6xl mb-4">📚</div>
//                 <p className="font-playful text-gray-600 mb-4">Start searching for words to see your activity here!</p>
//                 <Button
//                   onClick={() => router.push("/")}
//                   className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 font-playful"
//                 >
//                   Search Your First Word 🔍
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </main>
//     </div>
//   )
// }
