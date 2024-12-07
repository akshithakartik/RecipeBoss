import { useEffect, useState } from 'react';
import RecipeEditForm from './EditRecipeForm';

const RecipeDetails = ({ recipe, showButtons }) => {
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:4000/api/recipes/${recipe._id}`);
        const json = await response.json();
        
        if (response.ok) {
          setRecipeDetails(json);
        } else {
          setError(json.error || 'Something went wrong');
        }
      } catch (err) {
        setError('Failed to fetch recipe details');
      } finally {
        setLoading(false);
      }
    };

    if (recipe) {
      fetchRecipeDetails();
    }
  }, [recipe]);

  if (loading) return <p>Loading recipe details...</p>;
  if (error) return <p>{error}</p>;

  const { title, cooking_time, difficulty, category, user, ingredients } = recipeDetails || recipe;

  const handleClick = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/recipes/${recipe._id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        const json = await response.json();
        console.log('Recipe deleted successfully:', json);
        alert("Recipe deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error('Failed to delete recipe:', errorData);
        alert(`Failed to delete recipe: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert('Error deleting recipe. Please try again.');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = (updatedRecipe) => {
    setRecipeDetails(updatedRecipe);
    setIsEditing(false);
  };

  return (
    <div className="recipe-details">
      {isEditing ? (
        <RecipeEditForm recipe={recipeDetails} onSave={handleSave} />
      ) : (
        <>
          <h4>{title}</h4>
          <p><strong>Cooking Time:</strong> {cooking_time} minutes</p>
          <p><strong>Difficulty:</strong> {difficulty}</p>
          <p><strong>Category:</strong> {category ? category.name : 'Category not found'}</p>
          <p><strong>User:</strong> {user ? user.name : 'User not found'}</p>
    
          <h5>Ingredients:</h5>
          <ul>
            {ingredients.map((ingredientObj, index) => (
              <li key={index}>
                {ingredientObj.ingredient?.name || 'Unknown ingredient'}: {ingredientObj.amount}
              </li>
            ))}
          </ul>
          
          {showButtons && (
          <div className="icon-container">
            <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
            <span className="material-symbols-outlined" onClick={handleEditClick}>edit</span>
          </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeDetails;
