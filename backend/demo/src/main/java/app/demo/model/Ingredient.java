package app.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rezeptzutaten")
public class Ingredient {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "rezept_id")
	private Long recipe_id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "recipe_id")
	private Recipe recipe;
	
	@Column(name = "zutaten_menge")
	private int menge;
	
	@Column(name = "zutaten_einheit")
	private String einheit;
	
	@Column(name = "zutaten_name")
	private String name;
	
	// getter and setters
	public Long getId() {
		return id;
	}
	public Long getRecipeId() {
		return recipe_id;
	}
	public void setRecipe(Recipe recipe) {
		this.recipe = recipe;
	}
	public Recipe getRecipe() {
		return recipe;
	}
	
	public void setMenge(int menge) {
		this.menge = menge;
	}
	public int getMenge() {
		return menge;
	}
	
	public void setEinheit(String einheit) {
		this.einheit = einheit;
	}
	public String getEinheit() {
		return einheit;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}
}