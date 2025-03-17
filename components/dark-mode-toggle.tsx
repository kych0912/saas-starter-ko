'use client'

import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle('dark')
        isDark ?
        document.documentElement.style.setProperty('color-scheme', 'dark') :
        document.documentElement.style.removeProperty('color-scheme')
        document.cookie = `next-sass-starter-theme=${isDark ? 'dark' : 'light'}; SameSite=Lax; Path=/;`
    }

    return (
        <button onClick={toggleTheme} className="">
            <Sun size={32} className="hidden dark:block" />
            <Moon size={32} className="block dark:hidden" />
        </button>
    )
}