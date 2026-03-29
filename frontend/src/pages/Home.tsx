import "../App.css"
import RecipeHighlights from "../components/RecipeHighlights"
import RecipeOfTheDay from "../components/RecipeOfTheDay"

export default function Home() {
    const id = 1
    const ids = [1,2,3,4,5,6]
    const size = 3
    const idsEastern = [3, 4, 5, 6]
    const sizeEastern = 2
    return (
        <div>
            <h1>Home</h1>
            <p>Willkommen auf Lecker-Essen.com! Hier findest Du eine breite Auswahl an leckeren Rezepten.</p>
            <div>
                <h3 className="headline-recipe-day">Rezept des Tages</h3>
                <div>
                    <RecipeOfTheDay id={id}/>
                </div>
                <h3 className="headline">Highlights der Redaktion</h3>
                <RecipeHighlights ids = {ids} size = {size} />  
                <h3 className="headline">Oster Rezepte</h3>
                <div className="background-container">
                    <div className="background-div"></div>
                    <div className="special-container">
                        <RecipeHighlights ids = {idsEastern} size = {sizeEastern} />
                    </div>
                </div>
                <h3 className="headline">Beliebte Rezepte</h3>
                <RecipeHighlights ids = {ids} size = {size} />
                <RecipeHighlights ids = {ids} size = {size} />
            </div>
        </div>
    )
}