package app.demo.model;

import java.util.ArrayList;
import java.util.List;

/**
 * DTO class for short overview of all recipes
 */
public class OverviewDto{
	
	private Long id;
	private String title;
	private int cooktime;
	private int preptime;
	private String difficulty;
	private String beschreibung;
	// Liste von nur den categorien namen, keine Ids etc...
	private List<String> categories = new ArrayList<>();
	
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
    	this.id = id;
    }
    public void setTitle(String title){
	   this.title = title;
    }
	public String getTitle() {
	    return title;
	}
	public void setCooktime(int cooktime) {
		this.cooktime = cooktime;
	}
	public int getCooktime() {
	    return cooktime;
	}
	public void setPreptime(int preptime) {
		this.preptime = preptime;
	}
	public int getPreptime() {
	    return preptime;
	}
	public void setDifficulty(String difficulty) {
		this.difficulty = difficulty;
	}
	public String getDifficulty() {
	    return difficulty;
	}
	public void setDescription(String beschreibung) {
		this.beschreibung = beschreibung;
	}
	public String getDescription() {
		return beschreibung;
	}
	public void setCategories(List<String> categories) {
		this.categories = categories;
	}
	public List<String> getCategories(){
		return categories;
	}
	
	public void addCategory(String category) {
		this.categories.add(category);
	}
	public void removeCategory(String categorie) {
		this.categories.remove(categorie);
	}

}