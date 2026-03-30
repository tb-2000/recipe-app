import { useState, useEffect, useId } from 'react'
import '../App.css'
import api from '../api/api'
import OverviewCategories from '../components/OverviewCategories'
import SelectImage from '../components/SelectImage'
import UploadImage from '../components/UploadImage'
import CreateSas from '../components/CreateSas'
import RecipeImage from '../components/RecipeImage'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Wishlist from './Wishlist'

export default function SubmitRecipe({edit, defaultRecipe}:{edit:boolean, defaultRecipe:any, defaultCategories:string[]}) {

    // das hochzuladende Bild des Rezepts
    const [image, setImage] = useState<File | null>(null)
    // die sas und das Expire Datum zum Hochladen des Bildes in Azure Container
    const [sas, setSas] = useState<string>(" ")
    const [expires, setExpires] = useState<string>(" ")
    // die Rezeptnamen vom backend
    //const [titles, setTitles] = useState<string[] | undefined>(undefined)
    // die gefilterten Rezeptnamen
    const [filteredTitles, setFilteredTitles] = useState<string[]>([])
    // der Suchbegriff nach Rezeptnamen
    const [search, setSearch] = useState<string>("")

    const navigate = useNavigate()
    
    const navigateToEdit = () => {
        navigate(`/home`)
    }

    // suchen nach bestehenden vergebenden Rezeptnamen
    const { data:titles = [] } = useQuery({
        queryKey: ['title', search],
        queryFn: async () => {
            const response = await api.get<string[]>("/rezepte/title", {params: {search}})
            return response.data
        }
    })

    // Filtern der Ergebnisse
    useEffect(() => {
        if (titles && search) {
            const filtered = titles.filter(title =>
                title.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredTitles(filtered);
        } else {
            setFilteredTitles([]);
        }
    }, [titles, search]);

    // das einzureichende oder zu verändernde Rezept
const [recipe, setRecipe] = useState(() => {
    // Always guarantee ingredients is an array
    const base = {
        title: "",
        cookbook: "",
        page: 0,
        cooktime: 0,
        preptime: 0,
        difficulty: "mittel",
        description: "",
        instructions: "",
        ingredients: [
            { menge: 0, einheit: "", name: "" },
            { menge: 0, einheit: "", name: "" },
            { menge: 0, einheit: "", name: "" }
        ],
        categories: [""],
        filename: ""
    };

    if (edit && defaultRecipe) {
        return {
            ...base,                        // default values
            ...defaultRecipe,               // override with incoming data
            ingredients: Array.isArray(defaultRecipe.ingredients)
                ? defaultRecipe.ingredients
                : base.ingredients,         // wenn defaultRecipe keine Ingredients hat, nehme default werte von base
            categories: Array.isArray(defaultRecipe.categories)
                ? defaultRecipe.categories
                : base.categories,  // default Werte, wenn keine defaultrecipe.categories vorhanden
            id: defaultRecipe.id
        };
    }

    return base;
});
// wenn Kategorien ausgewählt werden für das Rezept -> diese speichern
const handleCategoriesChange = (changedCategories: string[]) => {
    setRecipe((prev: any) => {
        return {...prev, categories: changedCategories}
    })
}

// wenn der Name des Rezepts gesetzt oder verändert werden soll
// Dabei sollte darauf geachtet werden, dass der Name einzigartig ist!
const handleTitleChange = (e: { target: { value: any } }) => {
    const searchItem = e.target.value
    setSearch(searchItem)
    // nur wenn Titel noch nicht vergeben ist, diesen hinzufügen
    setRecipe((prev: any) => ({ ...prev, title: searchItem }))
    
}
// speichert alle Veränderungen am Rezept oder neue Informationen in "Recipe" (bis auf den Title, Kategorien, Zutaten)
const handleChange = (event: { target: { name: any; value: any } }) => {
    const name = event.target.name
    const value = event.target.value
    setRecipe((prev: any) => ({...prev, [name]: value}))
}
// speichern Veränderungen an Zutaten
const handleIngredientsChange = (index: number, field: string, value:any) => {
    setRecipe((prev: { ingredients: any }) => {
        const newIngredients = [...prev.ingredients]
        newIngredients[index] = {...newIngredients[index], [field]: value}
        return {...prev, ingredients: newIngredients}
    })
}
// fügen neue Zutat hinzu
const addIngredient = () => {
    setRecipe((prev: { ingredients: any }) => {
        const newIngredients = [...prev.ingredients, {menge: 0, einheit: "", zutat: ""}]
        return {...prev, ingredients: newIngredients}
    })
}
// löschen Zutat
const deleteIngredient = (index:Number) => {
    setRecipe((prev: { ingredients: any[] }) => {
        const newIngredients = [...prev.ingredients.filter((_, idx) => idx !== index)]
        return {...prev, ingredients: newIngredients}
    })

}
// um das Rezept aus Datenbank zu löschen anhand seines Index
const deleteRecipe = (index:Number) => {
    api.delete(`/edit/rezepte/${index}`).then(res => {
        console.log("succesful delete: ", res.data)
    }).catch(error => {
        console.log("no delete: ", error)
    })
    // nach Löschung automatisch zu Home weitergeleitet
    navigateToEdit()
}
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<Error | null>(null)
const [data, setData] = useState(null) // data: die Antwort des api calls

// wenn auf submit-button gedrückt wurde -> Rezept in Datenbank speichern
const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // der finale Name des hochgeladen Bildes (plus UUID)
    let finalFilename = recipe.filename;
    if (image) {
        try {
            console.log("Neues Bild ausgewählt:", image.name);

            // SAS erstellen
            const { sasUrl, expires } = await CreateSas(image.name);
            setSas(sasUrl);
            setExpires(expires);

            // Bild hochladen
            console.log("Starte Upload zu Azure...");
            const uploadedUrl = await UploadImage(image, sasUrl);

            finalFilename = uploadedUrl; // den ganzen namen plus UUID
            console.log("Upload erfolgreich! Neuer Filename:", finalFilename);

        } catch (err: any) {
            console.error("Fehler beim Bild-Upload:", err);
            setError(new Error("Bild-Upload fehlgeschlagen: " + (err.message || err)));
            setIsLoading(false);
            return;
        }
    }
    // das cleaned Recipe, damit es die richtigen Datentypen (Number, ...) und Default Werte besitzt für backend
    const cleanedRecipe = {
        ...recipe, // die alten Werte übernehmen
        cooktime: recipe.cooktime?Number(recipe.cooktime):0, // falls recipe.cooktime vorhanden, es als Number konvertieren, sonst 0
        preptime: recipe.preptime?Number(recipe.preptime):0, //...
        page: recipe.page?Number(recipe.page):0,
        ingredients: recipe.ingredients
        .map((ing: any) => ({
        menge: ing.menge ? Number(ing.menge) : 0,
        einheit: ing.einheit?.trim() || "",
        name: ing.name?.trim() || ""         
        }))
        .filter((ing: any) => ing.name !== ""), // filtern alle Zutaten, die nur aus leeren String bestehen (beim Zutatennamen)
        categories: recipe.categories.filter((cat: string) => cat !== ''), // filtern alle leeren Kategorien aus
        filename: image ? finalFilename : recipe.filename // speichern Filename des hochgeladen Bildes, ist dieses nicht vorhanden (weil kein neues hochgeladen wurde) -> nehmen stattdessen bestehendes filename
    }

    try {
        // wenn wir im edit-modus sind, dann bestehendes Rezept editieren im backend
        if(edit && cleanedRecipe.id){
            const response = await api.put(`/edit/rezepte/${cleanedRecipe.id}`, cleanedRecipe, {
            headers: {
                'Content-Type':'application/json'
            }
        }
        )
        console.log('Recipe submitted successfully:', response.data)
        setData(response.data)
        } else {
        // sind im submit-modus -> neues Rezept erstellen
        const response = await api.post('/submit', cleanedRecipe, {
            headers: {
                'Content-Type':'application/json'
            }
        }
        )
        console.log('Recipe submitted successfully:', response.data)
        setData(response.data)
    }
    } catch (error) {
        console.error('Error submitting or changing recipe:')
        setError(error instanceof Error ? error : new Error('Unknown error'))
    } finally {
        setIsLoading(false)
    }
}

  return (
    <div className="submit-recipe-container">
      {edit ? (
        <>
        <h1>Rezept bearbeiten</h1>
        <p>Hier bearbeitest Du ein Rezept.</p>
        </>
        ) : (
            <>
            <h1>Rezept einreichen</h1>
            <p>Hier reichst Du ein neues Rezept ein.</p>
            </>
            
      )}
      <form onSubmit={handleSubmit}>
        <div><strong>Titel:</strong></div>
        {edit 
            ? 
            <input type="text" name="title" value={recipe.title} className="title-input" onChange={handleTitleChange} required></input> 
            : 
            <input type="text" name="title" className="title-input" onChange={handleTitleChange} placeholder="Rezept Namen bitte eingeben" required></input>
        }
        {filteredTitles.length !== 0 && (<>
            <strong>Achtung!</strong>
            <p>Folgende Rezeptnamen sind schon vergeben</p>
            <ul style={{fontWeight:"bold"}}>
                {filteredTitles.map((title, index) =>  (
                        <li key={index}>{title}</li>
                    )
                )}
            </ul>
            <p>Bitte suchen Sie sich einen anderen aus</p>
        </>)}
        <div>
            <strong>Beschreibung:</strong>
        </div>
        {edit 
            ? 
            <textarea name="description" id="description" className="description-input" onChange={handleChange} value={recipe.description}></textarea>
            :
            <textarea name="description" id="description" className="description-input" onChange={handleChange} placeholder="Bitte eine kurze Beschreibung einfügen..."></textarea>
        }     
        {edit && (
            <div>
                <p>aktuelles Bild vom Rezept: {recipe.title}</p>
                <RecipeImage rezept={recipe} className="recipe-day"/>
            </div>
        )}
        <div>
            <strong>neues Bild:</strong>
        </div>
        <SelectImage handleImage={setImage}/>
        <div className="form-group">
            <div>
                <strong>Kochbuch:</strong>
            </div>
            {edit
                ?
                <input type="text" name="cookbook" id="cookbook" onChange={handleChange} value={recipe.cookbook}></input>
                :
                <input type="text" name="cookbook" id="cookbook" onChange={handleChange} placeholder="im welchen Kochbuch..."></input>
            }  
            <div>
                <strong>Seite:</strong>
            </div>
            {edit
                ?
                <input type="text" name="page" id="page" onChange={handleChange} value={recipe.page}></input>
                :
                <input type="text" name="page" id="page" onChange={handleChange} placeholder="17"></input>
            }     
            <div>
                <strong>Zubereitungszeit (in Minuten):</strong>
            </div>
            {edit
                ?
                <input type="text" name="cooktime" id="cooktime" onChange={handleChange} value={recipe.cooktime}></input>
                :
                <input type="text" name="cooktime" id="cooktime" onChange={handleChange} placeholder="45"></input>
            }
            <div>
                <strong>Vorbereitungszeit (in Minuten):</strong>
            </div>
            {edit
                ?
                <input type="text" name="preptime" id="preptime" onChange={handleChange} value={recipe.preptime}></input>
                :
                <input type="text" name="preptime" id="preptime" onChange={handleChange} placeholder="15"></input>
            }
            <div>
                <strong>Anspruch:</strong>
            </div>
            {edit
                ? (
                <select value={recipe.difficulty} onChange={handleChange}>
                    <option value="leicht">leicht</option>
                    <option value="mittel">mittel</option>
                    <option value="schwer">schwer</option>
                </select>
                )
                : (
                <select defaultValue={"mittel"} onChange={handleChange}>
                    <option value="leicht">leicht</option>
                    <option value="mittel">mittel</option>
                    <option value="schwer">schwer</option>
                </select>
                )
            }
            {/*<input type="text" name="difficulty" id="difficulty" onChange={handleChange} placeholder="mittel"></input>*/}
        </div>
        <div><strong>Anleitung:</strong></div>
        <div>
        {edit
            ?
            <textarea name="instructions" id="instructions" className="instructions-input" onChange={handleChange} value={recipe.instructions} required></textarea>
            :
            <textarea name="instructions" id="instructions" className="instructions-input" onChange={handleChange} placeholder="Bitte eine Anleitung angeben..." required></textarea>
        }
        </div>
        <strong>Zutaten</strong>
        <div className="ingredients-header">
            <div>
                <label htmlFor="menge">Menge:</label>
            </div>
            <div>
                <label htmlFor="einheit">Einheit:</label>
            </div>
            <div>
                <label htmlFor="zutat">Zutat:</label>
            </div>
            <div>{" "}</div>
        </div>
            <div className="form-group-ingredients">
                {edit
                    ? (  
                        <>
                        {recipe.ingredients.map((ingredient: { menge: string | number | readonly string[] | undefined; einheit: string | number | readonly string[] | undefined; name: string | number | readonly string[] | undefined }, index: number) => (
                            <div key={index} className="ingredients-row">
                                <input type="text" className="ingredients-menge" value={ingredient.menge} onChange={(e) => handleIngredientsChange(index, 'menge', e.target.value)}></input>
                                <input type="text" className="ingredients-einheit" value={ingredient.einheit} onChange={(e) => handleIngredientsChange(index, 'einheit', e.target.value)}></input>
                                <input type="text" className="ingredients-zutat" value={ingredient.name} onChange={(e) => handleIngredientsChange(index, 'name', e.target.value)}></input>
                                <button type="button" className="delete-ingredient-button" onClick={() => deleteIngredient(index)}>x</button>
                            </div>
                        ))}
                        </>
                    )
                    : (
                        <>
                        {recipe.ingredients.map((ingredient: { menge: string | number | readonly string[] | undefined; einheit: string | number | readonly string[] | undefined; name: string | number | readonly string[] | undefined }, index: number) => (
                            <div key={index} className="ingredients-row">
                                <input type="text" className="ingredients-menge" placeholder="50" onChange={(e) => handleIngredientsChange(index, 'menge', e.target.value)}></input>
                                <input type="text" className="ingredients-einheit" placeholder="Gramm" onChange={(e) => handleIngredientsChange(index, 'einheit', e.target.value)}></input>
                                <input type="text" className="ingredients-zutat" placeholder="Hartkäse" onChange={(e) => handleIngredientsChange(index, 'name', e.target.value)}></input>
                                <button type="button" className="delete-ingredient-button" onClick={() => deleteIngredient(index)}>x</button>
                            </div>
                        ))}
                        </>
                    )
                }

            </div>

        <button type="button" onClick={addIngredient}>Add Ingredient</button>
        <div><strong>Kategorien</strong></div>
        <OverviewCategories onCategoriesChange={handleCategoriesChange} defaultCategories={recipe.categories}/>
        {edit && (
        <div>
            <button type="button" onClick={() => deleteRecipe(recipe.id)}>Delete</button>
        </div>
            )}
        <button type="submit">Einreichen</button>
    </form>
    
    {isLoading && <p>Downloading your recipe...</p>}
    {error && <p>Error while downloading your recipe: {error.message}</p>}
    {data && <p>Downloaded your recipe successfully!</p>}
    </div>
  )
}