package app.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import app.demo.service.RecipeService;
import jakarta.validation.Valid;
import app.demo.model.*;

@RestController
@RequestMapping("/api")
public class RecipeController {
	
	@Autowired
    private final RecipeService service;
    
    public RecipeController(RecipeService service) {
    	this.service = service;
    }
    
    @GetMapping
    public String helloApi() {
    	return "Welcome to api!";
    }
    
    @GetMapping("/rezepte")
    public List<OverviewDto> getAll(){
    	return service.findAll();
    }
    
    @GetMapping("rezepte/{id}")
    public RecipeDetailDto getRecipe(@PathVariable Long id) {
    	return service.findById(id);
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecipeDetailDto create(@Valid @RequestBody RecipeCreateDto dto) {
    	return service.create(dto);
    }
    
    @PutMapping("rezepte/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RecipeDetailDto update(@PathVariable Long id, @Valid @RequestBody RecipeCreateDto dto) {
    	return service.update(id, dto);
    }
    
    @DeleteMapping("rezepte/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
    	service.delete(id);
    }
}