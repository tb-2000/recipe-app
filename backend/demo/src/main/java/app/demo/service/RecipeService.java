package app.demo.service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.*;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.UserDelegationKey;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;

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

import app.demo.config.config;

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
	    BlobSasPermission permission = new BlobSasPermission()
	            .setReadPermission(true);
		return toDetailDto(recipe, permission);
	}
	
	/**
	 * find all recipes and return them as List of OverwiewDTOs
	 * @return List of OverviewDto
	 */
	@Transactional
	public Page<OverviewDto> findAll(Pageable pageable){
		Page<Recipe> recipes = rep.findAll(pageable);
	    BlobSasPermission permission = new BlobSasPermission()
	            .setReadPermission(true);
		return toOverviewDtos(recipes, permission);
	}

	/**
	 * find recipes by ids
	 * @param ids of recipes
	 * @return OverviewDtos of recipes
	 */
	@Transactional
	public Page<OverviewDto> findByIds(List<Long> ids, Pageable pageable){
		Page<Recipe> recipes = rep.findByIdIn(ids, pageable);
		BlobSasPermission permission = new BlobSasPermission()
				.setReadPermission(true);
		return toOverviewDtos(recipes, permission);
	}
	
	/**
	 * find all recipes by their category/categories
	 * @param categories as String list
	 * @return OverviewDTOs of all recipes with category tags
	 */
	@Transactional
	public Page<OverviewDto> findByCategories(List<String> categories, int categoriesCount, Pageable pageable){
		Page<Recipe> recipes = rep.findByCategories(categories, categoriesCount, pageable);
	    BlobSasPermission permission = new BlobSasPermission()
	            .setReadPermission(true);
		return toOverviewDtos(recipes, permission);
	}
	
	/**
	 * find list of recipes by search query
	 * @param query
	 * @return list of overviewDTOs of recipes
	 */
	@Transactional
	public Page<OverviewDto> findBySearch(String query, Pageable pageable){
		Page<Recipe> recipes = rep.findBySearch(query, pageable);
	    BlobSasPermission permission = new BlobSasPermission()
	            .setReadPermission(true);
		return toOverviewDtos(recipes, permission);
	}
	
	/**
	 * find list of recipes by search query and given categories
	 * @param query
	 * @param categories
	 * @return list of overviewDTOs from recipes
	 */
	@Transactional
	public Page<OverviewDto> findBySearchAndCategories(String query, List<String> categories, int categoriesCount, Pageable pageable){
		Page<Recipe> recipes = rep.findBySearchAndCategories(query, categories, categoriesCount, pageable);
	    BlobSasPermission permission = new BlobSasPermission()
	            .setReadPermission(true);
		return toOverviewDtos(recipes, permission);
	}
	
	@Transactional
	public List<String> createUploadSas(String originalFileName) {
    
		config Config = new config();
		String connectionString = Config.connectionstring;

		String blobName = UUID.randomUUID() + "-" + originalFileName;

		BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
				.connectionString(connectionString)
				.buildClient();

		BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient("rezepte-bilder");
		BlobClient blobClient = containerClient.getBlobClient(blobName);

		// Permissions
		BlobSasPermission permissions = new BlobSasPermission()
				.setReadPermission(true)
				.setWritePermission(true)
				.setCreatePermission(true)
				.setAddPermission(true)
				.setDeletePermission(true);

		// User Delegation SAS erstellen
		BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(
				OffsetDateTime.now().plusMinutes(45), 
				permissions)
				.setStartTime(OffsetDateTime.now().minusMinutes(5));

		String sasToken = blobClient.generateSas(sasValues);

    	String sasUrl = blobClient.getBlobUrl() + "?" + sasToken;

		String expires = OffsetDateTime.now(ZoneOffset.UTC)
				.plusHours(24)
				.format(DateTimeFormatter.ISO_INSTANT);

		List<String> result = new ArrayList<>();
		result.add(sasUrl);
		result.add(expires);

		System.out.println("=== SAS generiert ===");
		System.out.println("Blob Name : " + blobName);
    	System.out.println("SAS URL   : " + sasUrl.substring(0, 180) + "...");
		
		return result;
}
	
	@Transactional
	public List<String> createFetchSas(String fileName) {
		config Config = new config();
		String connectionString = Config.connectionstring;
	    String blob = fileName;

	    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
	            .connectionString(connectionString) // oder mit Managed Identity / Entra ID
	            .buildClient();

	    BlobContainerClient container = blobServiceClient.getBlobContainerClient("rezepte-bilder");

	    BlobClient blobClient = container.getBlobClient(blob);

	    BlobSasPermission permission = new BlobSasPermission()
	            .setReadPermission(true);

	    BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(
	            OffsetDateTime.now().plusHours(24), permission);

	    String sasToken = blobClient.generateSas(sasValues);

	    String sasUrl = blobClient.getBlobUrl() + "?" + sasToken;
	    
	    String sasurlexpires = OffsetDateTime.now(ZoneOffset.UTC).plusHours(24).format(DateTimeFormatter.ISO_INSTANT);
	    List<String> sas = new ArrayList<>();
	    
	    sas.add(sasUrl);
	    sas.add(sasurlexpires);

	    return sas;
	}
	
	/**
	 * create from RecipeCreateDTO an Recipe Entity, save it into database and return RecipeDetailDTO
	 * @param new desired Recipe as RecipeCreateDto
	 * @return RecipeDetailDto
	 */
	@Transactional
	public RecipeDetailDto create(RecipeCreateDto createdto) {
		
		Recipe recipe = new Recipe();
		
//		//find next possible id 
//		Long id = rep.findNextId();
//		recipe.setId(id);
		
		recipe.setTitle(createdto.getTitle());
		recipe.setCookbook(createdto.getCookbook());
		recipe.setPage(createdto.getpage());
		recipe.setDescription(createdto.getDescription());
		recipe.setCooktime(createdto.getCooktime());
		recipe.setPreptime(createdto.getPreptime());
		recipe.setDifficulty(createdto.getDifficulty());
		recipe.setInstructions(createdto.getInstructions());
		recipe.setFilename(createdto.getFilename());
		
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
			ingredient.setName(i.getName());
			recipe.addIngredient(ingredient);
		}
		
	    BlobSasPermission permission = new BlobSasPermission()
	            .setWritePermission(true)
	            .setCreatePermission(true);
		
		Recipe saved = rep.save(recipe);
		return toDetailDto(saved, permission);
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
		recipe.setTitle(dto.getTitle());
		recipe.setCookbook(dto.getCookbook());
		recipe.setPage(dto.getpage());
		recipe.setDescription(dto.getDescription());
		recipe.setCooktime(dto.getCooktime());
		recipe.setPreptime(dto.getPreptime());
		recipe.setDifficulty(dto.getDifficulty());
		recipe.setInstructions(dto.getInstructions());
		recipe.setFilename(dto.getFilename());
		
		//clear all ingredients
		recipe.getIngredients().clear();
		
		//update with new ingredients
		for(IngredientDto i : dto.getIngredients()) {
			
			Ingredient ingredient = new Ingredient();
			ingredient.setEinheit(i.getEinheit());
			ingredient.setMenge(i.getMenge());
			ingredient.setName(i.getName());
			
			recipe.addIngredient(ingredient);
		}
		
		//save new recipe
		rep.save(recipe);
		
	    BlobSasPermission permission = new BlobSasPermission()
	            .setWritePermission(true)
	            .setCreatePermission(true);
		
		return toDetailDto(recipe, permission);
		
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
	
	public String createSas(String fileName, BlobSasPermission permission) {
		config Config = new config();
		String connectionString = Config.connectionstring;
	    String blob = fileName;

	    BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
	            .connectionString(connectionString) // oder mit Managed Identity / Entra ID
	            .buildClient();

	    BlobContainerClient container = blobServiceClient.getBlobContainerClient("rezepte-bilder");

	    BlobClient blobClient = container.getBlobClient(blob);

	    BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(
	            OffsetDateTime.now().plusHours(24), permission);

	    String sasToken = blobClient.generateSas(sasValues);

	    String sasUrl = blobClient.getBlobUrl() + "?" + sasToken;

	    return sasUrl;
	}
	
	/**
	 * changes Recipe type to RecipeDetailDto type
	 * @param Recipe
	 * @return RecipeDetailDto
	 */
	public RecipeDetailDto toDetailDto(Recipe recipe, BlobSasPermission permission) {
		
		RecipeDetailDto detaildto = new RecipeDetailDto();
		
		detaildto.setId(recipe.getId());
		detaildto.setTitle(recipe.getTitle());
		detaildto.setDescription(recipe.getDescription());
		detaildto.setCookbook(recipe.getCookbook());
		detaildto.setPage(recipe.getpage());
		detaildto.setCooktime(recipe.getCooktime());
		detaildto.setPreptime(recipe.getPreptime());
		detaildto.setDifficulty(recipe.getDifficulty());
		detaildto.setInstructions(recipe.getAnleitung());
		detaildto.setFilename(recipe.getFilename());
		
		if(detaildto.getFilename() != null) {
			detaildto.setSasurl(createSas(detaildto.getFilename(), permission));
			detaildto.setSasurlexpires(OffsetDateTime.now(ZoneOffset.UTC).plusHours(24).format(DateTimeFormatter.ISO_INSTANT));
		}
		
		detaildto.setCategories((List<String>) recipe.getCategories().stream().map(rc -> rc.category.getName()).toList());
		
		for(Ingredient i : recipe.getIngredients()) {
			
			IngredientDto ingredient = new IngredientDto();
			
			ingredient.setEinheit(i.getEinheit());
			ingredient.setMenge(i.getMenge());
			ingredient.setName(i.getName());
			
			detaildto.addIngredient(ingredient);
		}
		return detaildto;
	}
	
	/**
	 * changes List of Recipe classes to List of OverviewDTOs
	 * @param recipes
	 * @return overviews
	 */
	public Page<OverviewDto> toOverviewDtos(Page<Recipe> recipes, BlobSasPermission permission){
//		List<OverviewDto> overviews = new ArrayList<>();
//		for(Recipe recipe : recipes) {
//			OverviewDto overviewdto = new OverviewDto();
//			overviewdto.setId(recipe.getId());
//			overviewdto.setTitle(recipe.getTitle());
//			overviewdto.setCooktime(recipe.getCooktime());
//			overviewdto.setPreptime(recipe.getPreptime());
//			overviewdto.setDifficulty( recipe.getDifficulty());
//			overviewdto.setDescription(recipe.getDescription());
//			overviewdto.setFilename(recipe.getFilename());
//			
//			overviewdto.setCategories((List<String>) recipe.getCategories().stream().map(rc -> rc.category.getName()).toList());
//			overviews.add(overviewdto);
//		}
		Page<OverviewDto> overviews = recipes.map(recipe->toOverviewDto(recipe, permission));
		return overviews;
	}
	
	/**
	 * converts Recipe entity to OverviewDto class
	 * @param recipe
	 * @return overviewdto
	 */
	public OverviewDto toOverviewDto(Recipe recipe, BlobSasPermission permission) {
		OverviewDto overviewdto = new OverviewDto();
		overviewdto.setId(recipe.getId());
		overviewdto.setTitle(recipe.getTitle());
		overviewdto.setCooktime(recipe.getCooktime());
		overviewdto.setPreptime(recipe.getPreptime());
		overviewdto.setDifficulty( recipe.getDifficulty());
		overviewdto.setDescription(recipe.getDescription());
		overviewdto.setFilename(recipe.getFilename());
		
		if(overviewdto.getFilename() != null) {
			overviewdto.setSasurl(createSas(overviewdto.getFilename(), permission));
			overviewdto.setSasurlexpires(OffsetDateTime.now(ZoneOffset.UTC).plusHours(24).format(DateTimeFormatter.ISO_INSTANT));
		}
		
		overviewdto.setCategories((List<String>) recipe.getCategories().stream().map(rc -> rc.category.getName()).toList());
		return overviewdto;
	}
}