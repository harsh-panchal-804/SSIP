import React from 'react'
import themes from '../constants/themes.js'
import useThemeStore from '../store/useThemeStore'

const ThemeOptions = () => {
  const displayedThemes = themes.slice(0, 28)
  const { theme, setTheme } = useThemeStore()

  const col1 = displayedThemes.slice(0, 7)
  const col2 = displayedThemes.slice(7, 14)
  const col3 = displayedThemes.slice(14, 21)
  const col4 = displayedThemes.slice(21, 28)

  return (
    <div className="grid grid-cols-4 gap-8">
      {[col1, col2, col3, col4].map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-5">
          {column.map((th) => (
            <div
              className={`${theme === th ? "shadow-2xl border-amber-400 border-4" : ""} grid grid-cols-[auto,repeat(4,1fr)] rounded-md px-2 py-1 shadow-xl gap-2 hover:scale-125 transition-transform duration-300 cursor-pointer`}
              data-theme={th}
              onClick={() => setTheme(th)}
              key={th}
            >
              <p className="text-sm font-light uppercase">{th}</p>
              <div className="rounded h-5 w-5 bg-primary"></div>
              <div className="rounded h-5 w-5 bg-secondary"></div>
              <div className="rounded h-5 w-5 bg-accent"></div>
              <div className="rounded h-5 w-5 bg-neutral"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ThemeOptions
