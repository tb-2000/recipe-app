package app.demo.model;

/**
 * DTO class for Ingredient
 */
public class IngredientDto{
	
	private int menge;
	private String name;
	private String einheit;
	
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