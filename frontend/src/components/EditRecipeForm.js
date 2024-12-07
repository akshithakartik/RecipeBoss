import React, { useEffect, useState } from 'react';

const RecipeEditForm = ({ recipe, onSave }) => {
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [formData, setFormData] = useState({
    title: recipe.title,
    cooking_time: recipe.cooking_time,
    difficulty: recipe.difficulty,
    category: recipe.category ? recipe.category._id : '',
    ingredients: recipe.ingredients.map(ingredient => ({
      ingredientId: ingredient.ingredient._id,
      amount: ingredient.amount,
    })),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch('http://localhost:4000/api/recipes/recipe/category');
        const categoryData = await categoryResponse.json();
        setCategories(categoryData);

        const ingredientResponse = await fetch('http://localhost:4000/api/recipes/recipe/ingredient');
        const ingredientData = await ingredientResponse.json();
        setIngredients(ingredientData);
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

  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const newIngredients = [...formData.ingredients];
    newIngredients[index][name] = value;
    setFormData((prevData) => ({ ...prevData, ingredients: newIngredients }));
  };

  const handleAddIngredient = () => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, { ingredientId: '', amount: '' }],
    }));
  };

  const handleDeleteIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, ingredients: newIngredients }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedRecipe = {
      ...formData,
      ingredients: formData.ingredients.map(input => ({
        ingredient: input.ingredientId,
        amount: input.amount,
      })),
    };

    try {
      const response = await fetch(`http://localhost:4000/api/recipes/${recipe._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecipe),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Recipe updated successfully:', result);
        alert('Recipe updated successfully!');
        onSave(result); 
      } else {
        const errorData = await response.json();
        console.error('Failed to update recipe:', errorData);
        alert(`Failed to update recipe: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Check the console for more details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Recipe</h3>
      
      <div>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Cooking Time (in minutes):</label>
        <input
          type="number"
          name="cooking_time"
          value={formData.cooking_time}
          onChange={handleChange}
        />
      </div>

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
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4>Ingredients:</h4>
        {formData.ingredients.map((input, index) => (
          <div key={index}>
            <select
              name="ingredientId"
              value={input.ingredientId}
              onChange={(e) => handleIngredientChange(index, e)}
              required
            >
              <option value="">Select an ingredient</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient._id} value={ingredient._id}>
                  {ingredient.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="amount"
              value={input.amount}
              placeholder="Amount"
              onChange={(e) => handleIngredientChange(index, e)}
              required
            />
            <button type="button" onClick={() => handleDeleteIngredient(index)} style={{ marginLeft: '10px', color: 'white' }}>
              Delete
            </button>
          </div>
        ))}

        <div style={{ marginBottom: '10px' }}></div>
      <button type="button" onClick={handleAddIngredient} style={{ marginBottom: '10px' }}>
        Add Ingredient
      </button>
    </div>

      <button type="submit">Update Recipe</button>
    </form>
  );
};

export default RecipeEditForm;
