package app.demo.model;

import jakarta.persistence.*;

@Entity
public class Recipe {
	
	@Id
	@GeneratedValue
	private int rezept_id;
	private String rezept_name;
	private String kochbuch;
	private int seite;
	
	// getter and setter
	public void setRecipeId(int rezept_id) {
		this.rezept_id = rezept_id;
	}
	public int getRecipeId() {
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
}