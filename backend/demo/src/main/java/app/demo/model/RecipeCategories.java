package app.demo.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class RecipeCategories{
	
	@EmbeddedId
	private RecipeCategoriesKey id;
	
	@ManyToOne
	@MapsId("recipeId")
	@JoinColumn(name = "rezept_id")
	public Recipe recipe;
	
	@ManyToOne
	@MapsId("categoryId")
	@JoinColumn(name = "kategorie_id")
	public Category category;
	
	public RecipeCategoriesKey getId() {
		return id;
	}
	
}