import React, { useEffect, useState } from 'react';
import RecipeDetails from '../components/RecipeDetails'

const FilterRecipeForm = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    difficulty: 'Easy',
    category: '',
  });

  const [reportData, setReportData] = useState(null);
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
  
    const fetchData = async () => {
      try {

        const categoryResponse = await fetch('http://localhost:4000/api/recipes/recipe/category');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(false);

    try {
      const response = await fetch('http://localhost:4000/api/recipes/report/filter' ,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        const { matchedRecipes, reportData } = result;
        alert('Report generated successfully!');
        setReportData(reportData); 
        setMatchedRecipes(matchedRecipes)
        setIsSubmitted(true);
        
      } else {
        const errorData = await response.json();
        console.error('Failed to update recipe:', errorData);
        alert(`Failed to update recipe: ${errorData.message || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <h3>Filter Recipes</h3>

      <div>
        <label>Difficulty:</label>
        <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div>
        <label>Category:</label>
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
      
      <button type="submit">Go</button>
    </form>

    {isSubmitted && (
        <div className="recipes-report-container">
          <div className="recipes-report">
            <h3>Recipes found: {matchedRecipes.length}</h3>
            {matchedRecipes.length > 0 &&
              matchedRecipes.map((recipe) => (
                <RecipeDetails key={recipe._id} recipe={recipe} showButtons={false} />
              ))}
          </div>

          {reportData && reportData.average_cooking_time !== undefined && (
            <div className="report-card">
              <h3>Report</h3>
              <p>Average Cooking Time: {reportData.average_cooking_time.toFixed(2)} minutes</p>
              <p>Average Number of Ingredients: {reportData.average_number_ingredients.toFixed(2)}</p>
              <p>Unique Contributors: {reportData.number_unique_contributors}</p>
            </div>
          )}
        </div>
      )}
    </div>

  );
};

export default FilterRecipeForm;
