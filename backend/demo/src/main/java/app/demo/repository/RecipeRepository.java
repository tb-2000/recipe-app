package app.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.demo.model.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long>{
	
	@Query("SELECT r.rezept_id FROM Recipe r WHERE r.rezept_name LIKE :name")
	public int findIdByName(@Param("name") String name);
	
	// veraltet!
//	@Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.ingredients")
//	public List<Recipe> findAllWithIngredients();
	
	@Query("SELECT r FROM Recipe r")
	public List<Recipe> findAll();
	
	@Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.ingredients z WHERE r.rezept_id = :id")
	public Recipe findByIdwithIngredients(@Param("id") Long id);
	
	@Query("SELECT r FROM Recipe r JOIN r.categories rc JOIN rc.category c WHERE c.name IN :categories")
	public List<Recipe> findByCategories(@Param("categories") List<String> categories);
	
	@Query(value="""
			SELECT r.* 
			FROM rezepte r 
			LEFT JOIN rezeptzutaten z ON r.rezept_id = z.rezept_id 
			WHERE r.suchvektor @@ websearch_to_tsquery('german', :query) 
			ORDER BY ts_rank_db(r.suchvektor, websearch_to_tsquery('german', :query)) 
			LIMIT 5
			""", nativeQuery=true)
	public List<Recipe> findBySearch(@Param("query") String query);
	
	@Query(value="""
			SELECT r.* 
			FROM rezepte r 
			LEFT JOIN rezeptzutaten z ON r.rezept_id = z.rezept_id 
			LEFT JOIN recipe_categories rc ON rc.recipe_id = r.rezept_id
			LEFT JOIN kategorien k ON k.kategorie_id = rc.category_id
			WHERE r.suchvektor @@ websearch_to_tsquery('german', :query) AND k.name IN :categories
			ORDER BY ts_rank_db(r.suchvektor, websearch_to_tsquery('german', :query)) 
			LIMIT 5
			""", nativeQuery=true)
	public List<Recipe> findBySearchAndCategories(@Param("query") String query, @Param("categories") List<String> categories);
	
	@Query("SELECT c.name FROM Category c")
	public List<String> findAllCategories();
}

