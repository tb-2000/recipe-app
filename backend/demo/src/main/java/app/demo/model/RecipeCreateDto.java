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
	private String cookbook;
	private int page;
	private String description;
	private int cooktime;
	private int preptime;
	private String difficulty;
	@NotBlank
	private String instructions;
	private String filename;
	private String sasurl;
	private String sasurlexpires;
	
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
	
	public void setTitle(String title) {
		this.title = title;
	}
	public String getTitle() {
		return title;
	}
	
	public void setCookbook(String kochbuch) {
		this.cookbook = kochbuch;
	}
	public String getCookbook() {
		return cookbook;
	}
	
	public void setPage(int seite) {
		this.page = seite;
	}
	public int getpage() {
		return page;
	}
	
	public void setDescription(String beschreibung) {
		this.description = beschreibung;
	}
	public String getDescription() {
		return description;
	}
	
	public void setCooktime(int cooktime) {
		this.cooktime = cooktime;
	}
	public int getCooktime() {
		return cooktime;
	}
	
	public void setPreptime(int preptime) {
		this.preptime = preptime;
	}
	public int getPreptime() {
		return preptime;
	}
	public void setDifficulty(String anspruch) {
		this.difficulty = anspruch;
	}
	public String getDifficulty() {
		return difficulty;
	}
	
	public void setInstructions(String anleitung) {
		this.instructions = anleitung;
	}
	public String getInstructions() {
		return instructions;
	}
	public void setFilename(String file) {
		this.filename = file;
	}
	public String getFilename() {
		return filename;
	}

	public String getSasurl() {
		return sasurl;
	}

	public void setSasurl(String sasurl) {
		this.sasurl = sasurl;
	}

	public String getSasurlexpires() {
		return sasurlexpires;
	}

	public void setSasurlexpires(String sasurlexpires) {
		this.sasurlexpires = sasurlexpires;
	}
}