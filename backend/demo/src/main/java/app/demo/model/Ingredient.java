package app.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rezeptzutaten")
public class Ingredient {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rezept_id", nullable = false)
	private Recipe recipe;
	
	@Column(name = "zutaten_menge")
	private int zutaten_menge;
	
	@Column(name = "zutaten_einheit")
	private String zutaten_einheit;
	
	@Column(name = "zutaten_name")
	private String zutaten_name;
	
	// getter and setters
	public Long getId() {
		return id;
	}
	public void setRecipe(Recipe recipe) {
		this.recipe = recipe;
	}
	public Recipe getRecipe() {
		return recipe;
	}
	
	public void setMenge(int menge) {
		this.zutaten_menge = menge;
	}
	public int getMenge() {
		return zutaten_menge;
	}
	
	public void setEinheit(String einheit) {
		this.zutaten_einheit = einheit;
	}
	public String getEinheit() {
		return zutaten_einheit;
	}
	
	public void setZutatenName(String name) {
		this.zutaten_name = name;
	}
	public String getZutatenName() {
		return zutaten_name;
	}
}