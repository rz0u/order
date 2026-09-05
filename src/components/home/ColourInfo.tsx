'use client'

interface ColourInfoProps {
  /** Only renders for monthly themes */
  isMonthlyTheme: boolean
  /** e.g. 'month-09' */
  themeId: string
}

// Static lookup — mirrors globals.css values
const COLOUR_INFO: Record<string, { name: string; hex: string; mood: string }> = {
  'month-01': { name: 'Midnight Navy',   hex: '#1B3352', mood: 'Depth, stillness, new beginnings' },
  'month-02': { name: 'Lavender Purple', hex: '#9B7FD4', mood: 'Romance, imagination, softness' },
  'month-03': { name: 'Forest Green',    hex: '#4A7C59', mood: 'Growth, renewal, vitality' },
  'month-04': { name: 'Sky Blue',        hex: '#71B7D8', mood: 'Cleansing, optimism, movement' },
  'month-05': { name: 'Hot Pink',        hex: '#E85D8A', mood: 'Energy, bloom, celebration' },
  'month-06': { name: 'Golden Straw',    hex: '#E6C16E', mood: 'Light, abundance, transition' },
  'month-07': { name: 'Coral Red',       hex: '#E84B35', mood: 'Heat, boldness, peak summer' },
  'month-08': { name: 'Burnt Orange',    hex: '#C96623', mood: 'Warmth, ripening, late summer' },
  'month-09': { name: 'Olive',           hex: '#8A8B4A', mood: 'Harvest, earthy, contemplative' },
  'month-10': { name: 'Rust',            hex: '#B84A20', mood: 'Transition, warmth, letting go' },
  'month-11': { name: 'Deep Purple',     hex: '#4A3966', mood: 'Introspection, mystery, depth' },
  'month-12': { name: 'Dark Teal',       hex: '#1B4A40', mood: "Rest, reflection, year's end" },
}

export function ColourInfo({ isMonthlyTheme, themeId }: ColourInfoProps) {
  if (!isMonthlyTheme) return null

  const info = COLOUR_INFO[themeId]
  if (!info) return null

  return (
    <div
      className="text-[10px] leading-relaxed opacity-55"
      style={{ fontFamily: 'var(--font-sans)' }}
    >
      <div className="font-medium tracking-wide">{info.name}</div>
      <div className="uppercase tracking-widest text-[8px] mt-0.5">{info.hex}</div>
      <div className="mt-1 italic text-[9px] opacity-80">{info.mood}</div>
    </div>
  )
}
