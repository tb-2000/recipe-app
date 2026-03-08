package app.demo.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import jakarta.persistence.*;

@Embeddable
public class RecipeCategoriesKey implements Serializable{
	
	@Column(name = "rezept_id")
	private Long recipeId;
	
	@Column(name = "kategorie_id")
	private Long categoryId;

	@Override
	public int hashCode() {
		return Objects.hash(categoryId, recipeId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RecipeCategoriesKey other = (RecipeCategoriesKey) obj;
		return Objects.equals(categoryId, other.categoryId) && Objects.equals(recipeId, other.recipeId);
	}

	@Override
	public String toString() {
		return "RecipeCategoriesKey [recipeId=" + recipeId + ", categoryId=" + categoryId + "]";
	}

	public Long getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(Long recipeId) {
		this.recipeId = recipeId;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
}