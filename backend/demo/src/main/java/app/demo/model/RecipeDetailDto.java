package app.demo.model;

import java.util.List;

/**
 * DTO class for recipe in details. Used for creating and updating recipes.
 */
public class RecipeDetailDto{
	
	private Long id;
	private String title;
	private String beschreibung;
	private String kochbuch;
	private int seite;
	private int cooktime;
	private int preptime;
	private String difficulty;
	private List<IngredientDto> ingredients;
	
	// getter and setter
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public void setIngredients(List<IngredientDto> ingredients) {
			this.ingredients = ingredients;
		}
		public List<IngredientDto> getIngredients(){
			return ingredients;
		}
		
		public void addIngredient(IngredientDto ingredient) {
			this.ingredients.add(ingredient);
		}
		public void removeIngredient(IngredientDto ingredient) {
			this.ingredients.remove(ingredient);
		}
		
		public void setRecipeName(String title) {
			this.title = title;
		}
		public String getRecipeName() {
			return title;
		}
		
		public void setCookbook(String kochbuch) {
			this.kochbuch = kochbuch;
		}
		public String getCookbook() {
			return kochbuch;
		}
		
		public void setPage(int seite) {
			this.seite = seite;
		}
		public int getpage() {
			return seite;
		}
		
		public void setDescription(String beschreibung) {
			this.beschreibung = beschreibung;
		}
		public String getDescription() {
			return beschreibung;
		}
		
		public void setCooktime(int cooktime) {
			this.cooktime = cooktime;
		}
		public int getCooktime() {
			return cooktime;
		}
		
		public void setpreptime(int preptime) {
			this.preptime = preptime;
		}
		public int getPreptime() {
			return preptime;
		}
		
		public void setDifficulty(String difficulty) {
			this.difficulty = difficulty;
		}
		public String getDifficulty() {
			return difficulty;
		}
}
