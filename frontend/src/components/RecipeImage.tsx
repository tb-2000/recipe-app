import { useState } from 'react'
import GetSas from './GetSas'
import { useEffect } from 'react'

export default function RecipeImage({ rezept }: { rezept:any }) {
  const [currentSasUrl, setCurrentSasUrl] = useState<string>(rezept.sasurl);
  const [currentExpires, setCurrentExpires] = useState<string>(rezept.sasurlexpires)

  function IsSasValid(rezept:any):boolean {
    if(!rezept.sasurl) return false
    const expires = new Date(rezept.sasurlexpires)
    const now = new Date()
    return expires > now
  }

  useEffect(() => {
    if (!IsSasValid(rezept)) {
      // GetSas expects filename and a callback
      console.log("invalid SAS, need new one!")
      GetSas(rezept.filename, (newSasUrl: string) => {
        setCurrentSasUrl(newSasUrl);
      }, (newExpires: string) => setCurrentExpires(newExpires));
    } else {
      console.log("already got SAS: ", rezept.sasurl)
      setCurrentSasUrl(rezept.sasurl);
    }
  }, [currentSasUrl, currentExpires]);

  return (
    <div>
      <img
        src={currentSasUrl}
        alt="Rezept Foto"
        style={{ maxWidth: 400, objectFit: 'contain' }}
        onError={(e) => {
          console.error("Bild konnte nicht geladen werden", e)
          console.log("Versuche, neue sas zu generieren...")
          e.currentTarget.src = "/placeholder.jpg" // Fallback-Bild
        }}
      />
    </div>
  )

}