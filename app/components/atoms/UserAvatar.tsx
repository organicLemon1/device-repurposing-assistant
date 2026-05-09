'use client'

import React from 'react'
import { LogOut, Settings, History } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface UserAvatarProps {
  user: {
    email?: string
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  }
}

export function UserAvatar({ user }: UserAvatarProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const avatarUrl = user.user_metadata?.avatar_url

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full transition-all active:scale-90 hover:opacity-80"
      >
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{name}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-500 truncate">{user.email}</p>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <History className="w-4 h-4 text-slate-400" />
                My Projects
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </button>
            </div>
            <div className="p-2 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
