package app.demo.model;

/**
 * DTO class for Categories where only the name is visible
 */
public class CategoryDto{
	
	private String name;
	
	public void setName(String name) {
		this.name = name;
	}
	public String getName() {
		return name;
	}
}