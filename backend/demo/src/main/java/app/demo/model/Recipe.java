package app.demo.model;

import java.util.ArrayList;
import java.util.List;
import java.net.URL;

import jakarta.persistence.*;

@Entity
@Table(name = "rezepte")
public class Recipe {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rezept_id")
	private Long id;
	
	@Column(name = "rezept_name")
	private String title;
	
	@Column(name = "kochbuch")
	private String cookbook;
	
	@Column(name = "seite")
	private int page;
	
	@Column(name = "beschreibung")
	private String description;
	
	@Column(name = "cooktime")
	private int cooktime;
	
	@Column(name = "preptime")
	private int preptime;
	
	@Column(name = "anspruch")
	private String difficulty;
	
	@Column(name = "anleitung")
	private String instructions;
	
	@Column(name = "fileName")
	private String filename;
	
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
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public void setTitle(String rezept_name) {
		this.title = rezept_name;
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
	
	public void setDifficulty(String difficulty) {
		this.difficulty = difficulty;
	}
	public String getDifficulty() {
		return difficulty;
	}
	
	public void setInstructions(String anleitung) {
		this.instructions = anleitung;	
	}
	public String getAnleitung() {
		return instructions;
	}
	public void setFilename(String imageUrl) {
		this.filename = imageUrl;
	}
	public String getFilename() {
		return filename;
	}
}