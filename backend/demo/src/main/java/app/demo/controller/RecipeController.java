package app.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import app.demo.service.RecipeService;
import jakarta.validation.Valid;
import app.demo.model.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(
		origins = {"http://localhost:5174", "http://localhost:5173"})
public class RecipeController {
	
	@Autowired
    private final RecipeService service;
    
    public RecipeController(RecipeService service) {
    	this.service = service;
    }
    
//    @GetMapping
//    public String helloApi() {
//    	return "Welcome to the website!";
//    }
    
    @GetMapping("/rezepte")
    public Page<OverviewDto> getAll(
    	@RequestParam(defaultValue="0") int page,
    	@RequestParam(defaultValue="5") int size){
    	PageRequest pageable = PageRequest.of(page,  size);
    	return service.findAll(pageable);
    }
    
    @GetMapping("/rezepte/{id}")
    public RecipeDetailDto getRecipe(@PathVariable Long id) {
    	return service.findById(id);
    }

    @GetMapping("/rezepte/search/ids")
    public Page<OverviewDto> getRecipesByIds(
        @RequestParam(defaultValue="1,2,3,4,5,6") List<Long> ids,
        @RequestParam(defaultValue="0") int page,
        @RequestParam(defaultValue="3") int size
    ){
        PageRequest pageable = PageRequest.of(page,  size);
        return service.findByIds(ids, pageable);
    }
    
    @GetMapping("/rezepte/search")
    public Page<OverviewDto> getRecipesBySearch(
    		@RequestParam(required = false) String query, //Achtung! wenn kein Query gesendet, wird query=null
    		@RequestParam(required = false) List<String> categories,
        	@RequestParam(defaultValue="0") int page,
        	@RequestParam(defaultValue="5") int size
    ){
    	boolean hasQuery = query != null && !query.isBlank();
    	boolean hasCategories = categories != null && !categories.isEmpty();
    	PageRequest pageable = PageRequest.of(page,  size);
    	
    	// hence query is blank -> must search by categories
    	if(!hasQuery && hasCategories) {
    		int categoriesCount = categories.size();
    		return service.findByCategories(categories, categoriesCount, pageable);
    	} 
		// if no categories are given -> search by query
		if(hasQuery && !hasCategories) {
    		return service.findBySearch(query, pageable);
    	}
		// assume that query and categories are given
		if(hasQuery && hasCategories) {
			int categoriesCount = categories.size();
			return service.findBySearchAndCategories(query, categories, categoriesCount, pageable);
		}
    	return service.findAll(pageable);
    }
    
    @GetMapping("/rezepte/kategorien")
    public List<String> getCategories(){
    	return service.getAllCategories();
    }
    
    /*
     * returns the SAS-Token to upload image in azure container
     */
    @GetMapping("/upload-sas")
    public List<String> getUploadSas(
    		@RequestParam String fileName) {
    	return service.createUploadSas(fileName);
    }
    
    @GetMapping("/fetch-sas")
    public List<String> getFetchSas(@RequestParam String fileName) {
    	return service.createFetchSas(fileName);
    }
    
    @PostMapping("/submit")
    @ResponseStatus(HttpStatus.CREATED)
    public RecipeDetailDto create(@Valid @RequestBody RecipeCreateDto dto) {
        System.out.println("Received DTO raw: " + dto);
        System.out.println("instructions = " + dto.getInstructions());
    	return service.create(dto);
    }
    
    @PutMapping("/edit/rezepte/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RecipeDetailDto update(@PathVariable Long id, @Valid @RequestBody RecipeCreateDto dto) {
    	return service.update(id, dto);
    }
    
    @DeleteMapping("/edit/rezepte/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
    	service.delete(id);
    }
    
    @GetMapping("/error")
    public String error() {
    	return "Error occurred!";
    }
}