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
        <div className="home-container">
            <h1>Home</h1>
            <p>Willkommen auf Lecker-Essen.com! Hier findest Du eine breite Auswahl an leckeren Rezepten.</p>

            <h3 className="headline-recipe-day">Rezept des Tages</h3>
            <RecipeOfTheDay id={id}/>

            <div className="overview-link-container">
                <h2 className="headline">Highlights der Redaktion</h2>
                <a href={"/rezepte"} className="overview-link">Mehr ansehen<span className="arrow-right">&rarr;</span></a>
            </div>
            <RecipeHighlights ids = {ids} size = {size} />

            <div className="overview-link-container">
                <h2 className="headline">Oster Rezepte</h2>
                <a href={"/rezepte"} className="overview-link">Mehr ansehen<span className="arrow-right">&rarr;</span></a>
            </div>
            <div className="background-container">
                <div className="background-div"></div>
                <div className="special-container">
                    <RecipeHighlights ids = {idsEastern} size = {sizeEastern} />
                </div>
            </div>

            <div className="overview-link-container">
                <h2 className="headline">Beliebte Rezepte</h2>
                <a href={"/rezepte"} className="overview-link">Mehr ansehen<span className="arrow-right">&rarr;</span></a>
            </div>
            <RecipeHighlights ids = {ids} size = {size} />

            <div className="overview-link-container">
                <h2 className="headline">Neueste Rezepte</h2>
                <a href={"/rezepte"} className="overview-link">Mehr ansehen<span className="arrow-right">&rarr;</span></a>
            </div>
            <RecipeHighlights ids = {ids} size = {size} /> 
                 
        </div>
    )
}