import { useState, useEffect } from 'react'
import '../App.css'
import api from '../api/api'
import OverviewCategories from '../components/OverviewCategories'
import SelectImage from '../components/SelectImage'
import UploadImage from '../components/UploadImage'
import CreateSas from '../components/CreateSas'
import RecipeImage from '../components/RecipeImage'

export default function SubmitRecipe({edit, defaultRecipe}:{edit:boolean, defaultRecipe:any, defaultCategories:string[]}) {
    const [image, setImage] = useState<File | null>(null)
    const [sas, setSas] = useState<string | undefined>(undefined)

const [recipe, setRecipe] = useState<any>(() => {
    // Always guarantee ingredients is an array
    const base = {
        title: "Rezept Namen bitte eingeben",
        cookbook: "welches Kochbuch?",
        page: 0,
        cooktime: 0,
        preptime: 0,
        difficulty: "mittel",
        description: "kurze Beschreibung einfügen...",
        instructions: "Bitte die Anleitung einfügen...",
        ingredients: [
            { menge: 0, einheit: "", zutat: "" },
            { menge: 0, einheit: "", zutat: "" },
            { menge: 0, einheit: "", zutat: "" }
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
                : base.ingredients,         // ← safety net
            categories: Array.isArray(defaultRecipe.categories)
                ? defaultRecipe.categories
                : base.categories,
            id: defaultRecipe.id
        };
    }

    return base;
});

useEffect(() => {
    console.log(recipe)
}, [recipe])

const handleCategoriesChange = (changedCategories: string[]) => {
    setRecipe((prev: any) => {
        return {...prev, categories: changedCategories}
    })
}

const handleChange = (event: { target: { name: any; value: any } }) => {
    const name = event.target.name
    const value = event.target.value
    setRecipe((prev: any) => ({...prev, [name]: value}))
}
const handleIngredientsChange = (index: number, field: string, value:any) => {
    setRecipe((prev: { ingredients: any }) => {
        const newIngredients = [...prev.ingredients]
        newIngredients[index] = {...newIngredients[index], [field]: value}
        return {...prev, ingredients: newIngredients}
    })
}
const addIngredient = () => {
    setRecipe((prev: { ingredients: any }) => {
        const newIngredients = [...prev.ingredients, {menge: 0, einheit: "", zutat: ""}]
        return {...prev, ingredients: newIngredients}
    })
}
const deleteIngredient = (index:Number) => {
    setRecipe((prev: { ingredients: any[] }) => {
        const newIngredients = [...prev.ingredients.filter((_, idx) => idx !== index)]
        return {...prev, ingredients: newIngredients}
    })
}
const deleteRecipe = (index:Number) => {
    api.delete(`/edit/rezepte/${index}`).then(res => {
        console.log("succesful delete: ", res.data)
    }).catch(error => {
        console.log("no delete: ", error)
    })
}
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<Error | null>(null)
const [data, setData] = useState(null)

const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const cleanedRecipe = {
        ...recipe,
        cooktime: recipe.cooktime?Number(recipe.cooktime):0,
        preptime: recipe.preptime?Number(recipe.preptime):0,
        page: recipe.page?Number(recipe.page):0,
        ingredients: recipe.ingredients.map((ing: { menge: any }) => ({
            ...ing,
            menge: ing.menge?Number(ing.menge):0
        })).filter((ing: { zutat: string }) => ing.zutat !== ''),
        categories: recipe.categories.filter((cat: string) => cat !== ''),
        filename: image?.name
    }

    try {
        const response = await api.post('/submit', cleanedRecipe, {
            headers: {
                'Content-Type':'application/json'
            }
        }
        )
        console.log('Recipe submitted successfully:', response.data)
        setData(response.data)
    } catch (error) {
        console.error('Error submitting recipe:')
        setError(error instanceof Error ? error : new Error('Unknown error'))
    } finally {
        setIsLoading(false)
    }
}

  return (
    <div>
      {edit ? (
        <>
        <h1>Edit Recipe</h1>
        <p>This is the edit recipe page.</p>
        </>
        ) : (
            <>
            <h1>Submit Recipe</h1>
            <p>This is the submit recipe page.</p>
            </>
            
      )}
      <form onSubmit={handleSubmit}>
        <div><strong>Title:</strong></div>
        <input type="text" name="title" value={recipe.title} style={{ display: 'block', width: '100%' }} onChange={handleChange} required></input>
        <div><strong>Description:</strong></div>
        <textarea name="description" id="description" value={recipe.description} style={{ display: 'block', width: '100%', height:100 }} onChange={handleChange}></textarea>
        {edit && (
            <div>
                <p>aktuelles Bild vom Rezept: {recipe.title}</p>
                <RecipeImage rezept={recipe}/>
            </div>
        )}
        <div><strong>new Image</strong></div>
        <SelectImage handleImage={setImage}/>
        {image ? (<CreateSas fileName={image.name} handleSas={setSas}/>) : (<p>Image is empty!</p>)}
        {sas !== undefined && image && <UploadImage file={image} sasUrl={sas}/>}
        <div className="form-group">
            <div>
                <strong>Cookbook:</strong>
            </div>
            <input type="text" name="cookbook" id="cookbook" value={recipe.cookbook} onChange={handleChange}></input>
            <div>
                <strong>Page:</strong>
            </div>
            <input type="text" name="page" id="page" value={recipe.page} onChange={handleChange}></input>
            <div>
                <strong>Cooktime:</strong>
            </div>
            <input type="text" name="cooktime" id="cooktime" value={recipe.cooktime} onChange={handleChange}></input>
            <div>
                <strong>Preptime:</strong>
            </div>
            <input type="text" name="preptime" id="preptime" value={recipe.preptime} onChange={handleChange}></input>
            <div>
                <strong>Difficulty:</strong>
            </div>
            <input type="text" name="difficulty" id="difficulty" value={recipe.difficulty} onChange={handleChange}></input>
        </div>
        <div><strong>Instructions:</strong></div>
        <div>
            <textarea name="instructions" id="instructions" value={recipe.instructions} style={{ display: 'block', width: '100%', height:500 }} onChange={handleChange} required></textarea>
        </div>
        <strong>Ingredients</strong>
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
            <div className="form-group-ingredients">
                {recipe.ingredients.map((ingredient: { menge: string | number | readonly string[] | undefined; einheit: string | number | readonly string[] | undefined; zutat: string | number | readonly string[] | undefined }, index: number) => (
                <div key={index} className="ingredients-row">
                    <input type="text" className="ingredients-menge" value={ingredient.menge} onChange={(e) => handleIngredientsChange(index, 'menge', e.target.value)}></input>
                    <input type="text" className="ingredients-einheit" value={ingredient.einheit} onChange={(e) => handleIngredientsChange(index, 'einheit', e.target.value)}></input>
                    <input type="text" className="ingredients-zutat" value={ingredient.zutat} onChange={(e) => handleIngredientsChange(index, 'zutat', e.target.value)}></input>
                    <button type="button" onClick={() => deleteIngredient(index)}>x</button>
                </div>
            ))}
            </div>
        </div>
        <button type="button" onClick={addIngredient}>Add Ingredient</button>
        <div><strong>Categories</strong></div>
        <OverviewCategories onCategoriesChange={handleCategoriesChange} defaultCategories={recipe.categories}/>
        {edit && (
        <div>
            <button type="button" onClick={() => deleteRecipe(recipe.id)}>Delete</button>
        </div>
            )}
        <button type="submit">Submit</button>
    </form>
    
    {isLoading && <p>Downloading your recipe...</p>}
    {error && <p>Error while downloading your recipe: {error.message}</p>}
    {data && <p>Downloaded your recipe successfully!</p>}
    </div>
  )
}