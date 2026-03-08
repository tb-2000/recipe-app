package app.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
		origins = "http://localhost:5174")
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
    public List<OverviewDto> getAll(){
    	return service.findAll();
    }
    
    @GetMapping("/rezepte/{id}")
    public RecipeDetailDto getRecipe(@PathVariable Long id) {
    	return service.findById(id);
    }
    
    @GetMapping("/rezepte/search")
    public List<OverviewDto> getRecipesBySearch(
    		@RequestParam(required = false) String query,
    		@RequestParam(required = false) List<String> categories
    ){
    	// hence query is blank -> must search by categories
    	if(!query.isBlank()) {
    		return service.findByCategories(categories);
    	} 
		// if no categories are given -> search by query
		if(categories != null && !categories.isEmpty()) {
    		return service.findBySearch(query);
    	}
		// assume that query and categories are given
    	return null;
    }
    
    @GetMapping("/rezepte/kategorien")
    public List<String> getCategories(){
    	return service.getAllCategories();
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecipeDetailDto create(@Valid @RequestBody RecipeCreateDto dto) {
    	return service.create(dto);
    }
    
    @PutMapping("/rezepte/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RecipeDetailDto update(@PathVariable Long id, @Valid @RequestBody RecipeCreateDto dto) {
    	return service.update(id, dto);
    }
    
    @DeleteMapping("/rezepte/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
    	service.delete(id);
    }
    
    @GetMapping("/error")
    public String error() {
    	return "Error occurred!";
    }
}