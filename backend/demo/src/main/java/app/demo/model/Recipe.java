package app.demo.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "rezepte")
public class Recipe {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rezept_id")
	private Long rezept_id;
	
	@Column(name = "rezept_name")
	private String rezept_name;
	
	@Column(name = "kochbuch")
	private String kochbuch;
	
	@Column(name = "seite")
	private int seite;
	
	@Column(name = "beschreibung")
	private String beschreibung;
	
	@Column(name = "cooktime")
	private int cooktime;
	
	@Column(name = "preptime")
	private int preptime;
	
	@Column(name = "anspruch")
	private String difficulty;
	
	@Column(name = "anleitung")
	private String anleitung;
	
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "recipe")
	private List<Ingredient> ingredients = new ArrayList<>();
	
	@OneToMany(mappedBy = "recipe")
	private List<RecipeCategories> categories = new ArrayList<>();
	
	
	// getter and setter
	public void setIngredients(List<Ingredient> ingredients) {
		this.ingredients = ingredients;
	}
	public List<Ingredient> getIngredients(){
		return ingredients;
	}
	
	public void addIngredient(Ingredient ingredient) {
		this.ingredients.add(ingredient);
	}
	public void removeIngredient(Ingredient ingredient) {
		this.ingredients.remove(ingredient);
	}
	public void setCategories(List<RecipeCategories> categories) {
		this.categories = categories;
	}
	public List<RecipeCategories> getCategories(){
		return categories;
	}
	
	public void addCategory(RecipeCategories category) {
		this.categories.add(category);
	}
	public void removeCategory(RecipeCategories categorie) {
		this.categories.remove(categorie);
	}
	
	public Long getRecipeId() {
		return rezept_id;
	}
	
	public void setRecipeName(String rezept_name) {
		this.rezept_name = rezept_name;
	}
	public String getRecipeName() {
		return rezept_name;
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
	
	public void setAnleitung(String anleitung) {
		this.anleitung = anleitung;	
	}
	public String getAnleitung() {
		return anleitung;
	}
}