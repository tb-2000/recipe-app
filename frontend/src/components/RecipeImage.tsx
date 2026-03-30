import { useState } from 'react'
import GetSas from './GetSas'
import EmptyHeartImg from '../logos/empty-heart.png'
import FullHeartImg from '../logos/herz.png'
import { useEffect } from 'react'
import '../App.css'
import { useWishlist } from '../context/WishlistContext'


export default function RecipeImage({ rezept, className }: { rezept:any, className:string }) {
  const [currentSasUrl, setCurrentSasUrl] = useState<string>(" ");
  const [currentExpires, setCurrentExpires] = useState<string>(" ")

  const { wishlist, toggleWishlist } = useWishlist();

  //function IsSasValid(rezept:any):boolean {
  //  if(!rezept.filename) return false
  //  const expires = new Date(currentExpires)
  //  const now = new Date()
  //  return expires > now
  //}

  function IsOnWishlist(rezept: { id: any }): boolean {
    const id = rezept?.id
    return wishlist.includes(id)
  }

  function handleWishlistClick() {

    toggleWishlist(rezept.id)
}


  useEffect(() => {
    if (!rezept?.filename) {
      // GetSas expects filename and a callback
      console.log("no filename! Thus no sas!")
      return
    }
    GetSas(rezept.filename, (newSasUrl: string) => {
      setCurrentSasUrl(newSasUrl);
    }, (newExpires: string) => setCurrentExpires(newExpires));
    console.log("filename: ", rezept.filename)
    //if(!IsSasValid(rezept)){
    //  // Sas is expired...create new one
    //  CreateSas(rezept.filename, (newSasUrl: string) => {
    //    setCurrentSasUrl(newSasUrl);
    //  }, (newExpires: string) => setCurrentExpires(newExpires));
    //}
  }, [rezept.filename]);

  return (
    <div className="image-container">
      <img
        src={currentSasUrl}
        alt="Rezept Foto"
        className = {`${className}`}
        width={className === 'highlights-recipe' ? 300 : 400} // Beispiel: 300px für Highlights, 400px für andere
        height={className === 'highlights-recipe' ? 200 : 300} // Beispiel: 200px für Highlights, 300px für andere
        decoding="async"
        loading="lazy"
        onError={(e) => {
          console.error("Bild konnte nicht geladen werden", e)
          console.log("incorrect sas: ", currentSasUrl)
          console.log("Versuche, neue sas zu generieren...")
          e.currentTarget.src = "/placeholder.jpg" // Fallback-Bild
        }}
      />
      <img src={IsOnWishlist(rezept) ? FullHeartImg : EmptyHeartImg} alt="Wishlist" className="wishlist-icon" onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleWishlistClick();}
      }/>
    </div>
  )

}