'use client'

import { createClient } from '@/lib/supabase/client'
import { Smartphone, Sparkles } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { FloatingBackgroundIcons } from "@/app/components/organisms/FloatingBackgroundIcons"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const supabase = createClient()

    // Construct the callback URL
    const callbackUrl = `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl,
      },
    })

    if (error) {
      console.error('Error logging in:', error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-[#060913] font-sans">
      {/* Premium Tech Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Floating Doodles */}
      <FloatingBackgroundIcons />

      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-0 left-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-indigo-500/30 dark:bg-indigo-600/20 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0"></div>
      <div className="absolute bottom-[-10%] right-[-20%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-fuchsia-500/15 dark:bg-violet-600/10 blur-[130px] rounded-full animate-pulse mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-all duration-1000 z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[30vw] max-w-[900px] max-h-[400px] bg-blue-400/20 dark:bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-md">

        {/* Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Get Started
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Sign in to save your repurposed device projects and get expert guidance.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-slate-200 font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.68-2.33 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.68-.35-1.4-.35-2.09s.13-1.41.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Smartphone className="w-4 h-4" />
                Device History
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Sparkles className="w-4 h-4" />
                AI Solutions
              </div>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
