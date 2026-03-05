package app.demo.model;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO class for short overview of all recipes
 */
public class OverviewDto{
	
	private Long id;
	private String title;
	private int cooktime;
	private int preptime;
	private String difficulty;
	private List<IngredientDto> ingredients = new ArrayList<> ();
	
	public OverviewDto(Recipe recipe) {
		this.id = recipe.getRecipeId();
		this.title = recipe.getRecipeName();
		this.cooktime = recipe.getCooktime();
		this.preptime = recipe.getPreptime();
		this.difficulty = recipe.getDifficulty();
		
		for(Ingredient i : recipe.getIngredients()) {
			IngredientDto ingredient = new IngredientDto();
			ingredient.setEinheit(i.getEinheit());
			ingredient.setMenge(i.getMenge());
			ingredient.setZutatenName(i.getZutatenName());
			this.ingredients.add(ingredient);
		}
	}
}