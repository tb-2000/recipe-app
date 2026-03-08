package app.demo.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "kategorien")
public class Category{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "category_id")
	Long categoryId;
	
	@Column(name = "name")
	String name;
	
	@OneToMany(mappedBy = "category")
	private List<RecipeCategories> recipes = new ArrayList<>();
	
	public Long getId() {
		return categoryId;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}
}