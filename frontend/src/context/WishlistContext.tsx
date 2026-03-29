import { createContext, use, useContext, useEffect, useState, type ReactNode } from 'react'

type WishlistContextType = {
  wishlist: number[]
  setWishlist: React.Dispatch<React.SetStateAction<number[]>>
  toggleWishlist: (id: number) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {

  // wishlist von localStorage holen, falls vorhanden, sonst leeres Array
  const [wishlist, setWishlist] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []

    const saved = localStorage.getItem('wishlist')
    if (!saved) return []

    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Fehler beim Parsen der Wunschliste:', error);
      return [];
    }
  });

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    )
  }

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const clearWishlist = () => {
    setWishlist([])
    localStorage.removeItem('wishlist')
  }

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
