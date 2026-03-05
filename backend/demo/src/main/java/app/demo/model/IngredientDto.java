package app.demo.model;

/**
 * DTO class for Ingredient
 */
public class IngredientDto{
	
	private int zutatenmenge;
	private String zutatenname;
	private String zutateneinheit;
	
	public void setMenge(int menge) {
		this.zutatenmenge = menge;
	}
	public int getMenge() {
		return zutatenmenge;
	}
	
	public void setEinheit(String einheit) {
		this.zutateneinheit = einheit;
	}
	public String getEinheit() {
		return zutateneinheit;
	}
	
	public void setZutatenName(String name) {
		this.zutatenname = name;
	}
	public String getZutatenName() {
		return zutatenname;
	}
}