import EasyImg from "../logos/star.png"
import MediumImg from "../logos/two-stars.png"
import HardImg from "../logos/three-stars.png"

type Difficulty = "leicht" | "mittel" | "schwer"

const images: Record<Difficulty, string> = {
    leicht: EasyImg,
    mittel: MediumImg,
    schwer: HardImg
}

export default function SelectLogo(difficulty:string) {

    if (typeof difficulty !== "string" || !difficulty.trim()) {
            console.error("Invalid key provided to getImage:", difficulty)
            return undefined
        }
    const normalizedKey = difficulty.trim().toLowerCase() as Difficulty

    if(normalizedKey in images){
        return images[normalizedKey]
    }

    console.warn(`Unbekannter Schwierigkeitsgrad: ${difficulty}`);
    return undefined; // oder z. B. EasyImg als Fallback
}