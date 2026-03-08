package app.demo.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

/**
 * DTO class of what the client may change
 */
public class RecipeCreateDto{
	
	@NotBlank
	private String title;
	private String kochbuch;
	private int seite;
	private String beschreibung;
	private int cooktime;
	private int preptime;
	private String anspruch;
	private String anleitung;
	
	@NotEmpty
	private List<IngredientDto> ingredients;
	
	private List<String> categories = new ArrayList<>();
	
	public RecipeCreateDto(String title, List<IngredientDto> ingredients) {
		this.title = title;
		this.ingredients = ingredients;
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
	public void setCategories(List<String> categories) {
		this.categories = categories;
	}
	public List<String> getCategories(){
		return categories;
	}
	
	public void addCategory(String category) {
		this.categories.add(category);
	}
	public void removeCategory(String categorie) {
		this.categories.remove(categorie);
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
	public void setDifficulty(String anspruch) {
		this.anspruch = anspruch;
	}
	public String getDifficulty() {
		return anspruch;
	}
	
	public void setAnleitung(String anleitung) {
		this.anleitung = anleitung;
	}
	public String getAnleitung() {
		return anleitung;
	}
}