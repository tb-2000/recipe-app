export default function ChangeAmount(anzahlPersonen:number, rezept:any){
    const scale = (anzahlPersonen-2)
    if(anzahlPersonen === 0 || anzahlPersonen === 2){
        return {
            ...rezept,               // override with incoming data
            ingredients: rezept.ingredients        // gebe vorhandene Zutaten ohne Änderung zurück
        }
    }else{
        return {
            ...rezept, // Rest bleibt gleich
            ingredients: rezept.ingredients
                .map((ing: any) => ({
                menge: (Number.isInteger(ing.menge) && ing.menge > 0) ? 
                ing.menge + (scale*(ing.menge/2)) : // passen Mengen an je nach anzahl personen
                ing.menge, // wenn menge 0 oder nicht vorhanden -> ohne Skalierung zurückgeben
                einheit: ing.einheit,
                name: ing.name         
            }))
        };
    }
     
}