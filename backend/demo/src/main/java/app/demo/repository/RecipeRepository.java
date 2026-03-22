package app.demo.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import app.demo.model.Recipe;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long>{
	
	@Query("SELECT r.id FROM Recipe r WHERE r.title LIKE :name")
	public int findIdByName(@Param("name") String name);
	
	// veraltet!
//	@Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.ingredients")
//	public List<Recipe> findAllWithIngredients();
	
	@Query("SELECT r FROM Recipe r")
	public Page<Recipe> findAll(Pageable pageable);
	
	@Query("SELECT r FROM Recipe r LEFT JOIN FETCH r.ingredients z WHERE r.id = :id")
	public Recipe findByIdwithIngredients(@Param("id") Long id);
	
	@Query(value="""
			SELECT r.*
			FROM rezepte r
			WHERE 
				(SELECT COUNT(DISTINCT k2.name) 
				FROM  recipe_categories rc2 
				JOIN kategorien k2 ON rc2.kategorie_id = k2.category_id 
				WHERE rc2.rezept_id = r.rezept_id 
				AND k2.name IN (:categories)
				) = :categoriesCount
			""", nativeQuery=true)
	public Page<Recipe> findByCategories(
			@Param("categories") List<String> categories, 
			@Param("categoriesCount") int categoriesCount, 
			Pageable pageable);
	
	@Query(value="""
			SELECT r.* 
			FROM rezepte r 
			WHERE r.suchvektor @@ websearch_to_tsquery('german', :query) 
			ORDER BY ts_rank_cd(r.suchvektor, websearch_to_tsquery('german', :query)) 
			LIMIT 5
			""", nativeQuery=true)
	public Page<Recipe> findBySearch(@Param("query") String query, Pageable pageable);
	
	@Query(value="""
			SELECT r.* 
			FROM rezepte r 
			WHERE 
				(r.suchvektor @@ websearch_to_tsquery('german', :query)) 
			AND 
				(SELECT COUNT(DISTINCT k2.name) 
				FROM  recipe_categories rc2 
				JOIN kategorien k2 ON rc2.kategorie_id = k2.category_id 
				WHERE rc2.rezept_id = r.rezept_id 
				AND k2.name IN (:categories)
				) = :categoriesCount
			ORDER BY ts_rank_cd(r.suchvektor, websearch_to_tsquery('german', :query)) 
			LIMIT 5
			""", nativeQuery=true)
	public Page<Recipe> findBySearchAndCategories(
			@Param("query") String query, 
			@Param("categories") List<String> categories, 
			@Param("categoriesCount") int categoriesCount,
			Pageable pageable);
	
	@Query("SELECT c.name FROM Category c")
	public List<String> findAllCategories();
	
	@Query(value="""
			SELECT nextval(pg_get_serial_sequence('rezepte', 'rezept_id'))
			""", nativeQuery=true)
	public Long findNextId();
}

