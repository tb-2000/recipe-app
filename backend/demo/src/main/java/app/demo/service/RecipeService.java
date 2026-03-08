package app.demo.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.*;

import app.demo.model.Category;
import app.demo.model.Ingredient;
import app.demo.model.IngredientDto;
import app.demo.model.OverviewDto;
import app.demo.model.Recipe;
import app.demo.model.RecipeCategories;
import app.demo.model.RecipeCreateDto;
import app.demo.model.RecipeDetailDto;
import app.demo.repository.RecipeRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.*;

/**
 * Service class for business logic and advanced database access logic
 */
@Service
public class RecipeService{
	
	@Autowired
	private final RecipeRepository rep;
	
	public RecipeService(RecipeRepository rep) {
		this.rep = rep;
	}
	
	@Transactional
	public List<String> getAllCategories(){
		return rep.findAllCategories();
	}
	
	/**
	 * find Recipe by Id and returns it as DTO
	 * @param id
	 * @return RecipeDetailDto
	 */
	@Transactional
	public RecipeDetailDto findById(Long id) {
		Recipe recipe = rep.findByIdwithIngredients(id);
		return toDetailDto(recipe);
	}
	
	/**
	 * find all recipes and return them as List of OverwiewDTOs
	 * @return List of OverviewDto
	 */
	@Transactional
	public List<OverviewDto> findAll(){
		List<OverviewDto> overviews = new ArrayList<>();
		List<Recipe> recipes = rep.findAll();
		return toOverviewDtos(recipes);
	}
	
	/**
	 * find all recipes by their category/categories
	 * @param categories as String list
	 * @return OverviewDTOs of all recipes with category tags
	 */
	@Transactional
	public List<OverviewDto> findByCategories(List<String> categories){
		List<OverviewDto> overviews = new ArrayList<>();
		List<Recipe> recipes = rep.findByCategories(categories);
		return toOverviewDtos(recipes);
	}
	
	/**
	 * find list of recipes by search query
	 * @param query
	 * @return list of overviewDTOs of recipes
	 */
	@Transactional
	public List<OverviewDto> findBySearch(String query){
		List<OverviewDto> overviews = new ArrayList<>();
		List<Recipe> recipes = rep.findBySearch(query);
		return toOverviewDtos(recipes);
	}
	
	/**
	 * find list of recipes by search query and given categories
	 * @param query
	 * @param categories
	 * @return list of overviewDTOs from recipes
	 */
	@Transactional
	public List<OverviewDto> findBySearchAndCategories(String query, List<String> categories){
		List<OverviewDto> overviews = new ArrayList<>();
		List<Recipe> recipes = rep.findBySearchAndCategories(query, categories);
		return toOverviewDtos(recipes);
	}
	
	/**
	 * create from RecipeCreateDTO an Recipe Entity, save it into database and return RecipeDetailDTO
	 * @param new desired Recipe as RecipeCreateDto
	 * @return RecipeDetailDto
	 */
	@Transactional
	public RecipeDetailDto create(RecipeCreateDto createdto) {
		
		Recipe recipe = new Recipe();
		recipe.setRecipeName(createdto.getRecipeName());
		recipe.setCookbook(createdto.getCookbook());
		recipe.setPage(createdto.getpage());
		recipe.setDescription(createdto.getDescription());
		recipe.setCooktime(createdto.getCooktime());
		recipe.setpreptime(createdto.getPreptime());
		recipe.setDifficulty(createdto.getDifficulty());
		
		for(String name : createdto.getCategories()) {
			RecipeCategories rc = new RecipeCategories();
			Category category = new Category();
			category.setName(name);
			rc.category = category;
			rc.recipe = recipe;
			recipe.addCategory(rc);
		}
		
		for(IngredientDto i : createdto.getIngredients()) {
			Ingredient ingredient = new Ingredient();
			ingredient.setEinheit(i.getEinheit());
			ingredient.setMenge(i.getMenge());
			ingredient.setZutatenName(i.getZutatenName());
			recipe.addIngredient(ingredient);
		}
		
		Recipe saved = rep.save(recipe);
		return toDetailDto(saved);
	}
	
	/**
	 * update recipe by Id and RecipeCreateDTO
	 * @param id
	 * @param dto
	 * @return RecipeDetailDTO
	 */
	@Transactional
	public RecipeDetailDto update(Long id, RecipeCreateDto dto) {
		if(!rep.existsById(id)) {
			throw new EntityNotFoundException("Recipe not found");
		}
		Recipe recipe = rep.findByIdwithIngredients(id);
		
		//update properties of recipe
		recipe.setRecipeName(dto.getRecipeName());
		recipe.setCookbook(dto.getCookbook());
		recipe.setPage(dto.getpage());
		recipe.setDescription(dto.getDescription());
		recipe.setCooktime(dto.getCooktime());
		recipe.setpreptime(dto.getPreptime());
		recipe.setDifficulty(dto.getDifficulty());
		
		//clear all ingredients
		recipe.getIngredients().clear();
		
		//update with new ingredients
		for(IngredientDto i : dto.getIngredients()) {
			
			Ingredient ingredient = new Ingredient();
			ingredient.setEinheit(i.getEinheit());
			ingredient.setMenge(i.getMenge());
			ingredient.setZutatenName(i.getZutatenName());
			
			recipe.addIngredient(ingredient);
		}
		
		//save new recipe
		rep.save(recipe);
		
		return toDetailDto(recipe);
		
	}
	
	/**
	 * delete Recipe by Id
	 * @param id
	 */
	@Transactional
	public void delete(long id) {
		if(!rep.existsById(id)) {
			throw new EntityNotFoundException("Recipe not found");
		}
		rep.deleteById(id);
	}
	
	/**
	 * changes Recipe type to RecipeDetailDto type
	 * @param Recipe
	 * @return RecipeDetailDto
	 */
	public RecipeDetailDto toDetailDto(Recipe recipe) {
		
		RecipeDetailDto detaildto = new RecipeDetailDto();
		
		detaildto.setId(recipe.getRecipeId());
		detaildto.setRecipeName(recipe.getRecipeName());
		detaildto.setDescription(recipe.getDescription());
		detaildto.setCookbook(recipe.getCookbook());
		detaildto.setPage(recipe.getpage());
		detaildto.setCooktime(recipe.getCooktime());
		detaildto.setpreptime(recipe.getPreptime());
		detaildto.setDifficulty(recipe.getDifficulty());
		
		for(Ingredient i : recipe.getIngredients()) {
			
			IngredientDto ingredient = new IngredientDto();
			
			ingredient.setEinheit(i.getEinheit());
			ingredient.setMenge(i.getMenge());
			ingredient.setZutatenName(i.getZutatenName());
			
			detaildto.addIngredient(ingredient);
		}
		return detaildto;
	}
	
	/**
	 * changes List of Recipe classes to List of OverviewDTOs
	 * @param recipes
	 * @return overviews
	 */
	public List<OverviewDto> toOverviewDtos(List<Recipe> recipes){
		List<OverviewDto> overviews = new ArrayList<>();
		for(Recipe recipe : recipes) {
			OverviewDto overviewdto = new OverviewDto();
			overviewdto.setId(recipe.getRecipeId());
			overviewdto.setTitle(recipe.getRecipeName());
			overviewdto.setCooktime(recipe.getCooktime());
			overviewdto.setPreptime(recipe.getPreptime());
			overviewdto.setDifficulty( recipe.getDifficulty());
			overviewdto.setDescription(recipe.getDescription());
			
			overviewdto.setCategories((List<String>) recipe.getCategories().stream().map(rc -> rc.category.getName()).toList());
			overviews.add(overviewdto);
		}
		return overviews;
	}
}