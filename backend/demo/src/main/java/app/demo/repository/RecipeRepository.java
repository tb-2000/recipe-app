package app.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.demo.model.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long>{
	
	//@Query("SELECT r.rezept_id FROM rezepte r WHERE r.rezept_name LIKE :name")
	//public int findIdByName(@Param("name") String name);
	
	@Query("SELECT r FROM Recipe r LEFT JOIN r.ingredients")
	public List<Recipe> findAllWithIngredients();
	
	@Query("SELECT r FROM Recipe r LEFT JOIN r.ingredients z WHERE r.rezept_id = :id")
	public Recipe findByIdwithIngredients(@Param("id") Long id);
}

