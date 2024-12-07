import React, { useEffect, useState } from 'react';

const CreateRecipeForm = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [formData, setFormData] = useState({
    user: '',
    title: '',
    cooking_time: '',
    difficulty: 'Easy',
    category: '',
    ingredients: [],
  });
  const [ingredientInputs, setIngredientInputs] = useState([{ ingredientId: '', amount: '' }]);

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const userResponse = await fetch('http://localhost:4000/api/recipes/recipe/users');
        const userData = await userResponse.json();
        setUsers(userData);

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
    const newIngredientInputs = [...ingredientInputs];
    newIngredientInputs[index][name] = value;
    setIngredientInputs(newIngredientInputs);
  };

  const handleAddIngredient = () => {
    setIngredientInputs([...ingredientInputs, { ingredientId: '', amount: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const recipeData = {
        ...formData,
      user: formData.user,
      category: formData.category,
      ingredients: ingredientInputs.map((input) => ({
        ingredient: input.ingredientId, 
        amount: input.amount,
      })),
    };

    try {
      const response = await fetch('http://localhost:4000/api/recipes/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Recipe created successfully:', result);
        alert("Recipe created successfully!");

        setFormData({
          user: '',
          title: '',
          cooking_time: '',
          difficulty: 'Easy',
          category: '',
          ingredients: [],
        });
        setIngredientInputs([{ ingredientId: '', amount: '' }]);
      } else {
        const errorData = await response.json();
        console.error('Failed to create recipe:', errorData);
        alert(`Failed to create recipe: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Check the console for more details.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Recipe</h3>
      <div>
        <label>User:</label>
        <select name="user" value={formData.user} onChange={handleChange} required>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>

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
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div>
        <h4>Ingredients:</h4>
        {ingredientInputs.map((input, index) => (
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
          </div>
        ))}
        <button type="button" onClick={handleAddIngredient} style={{ marginBottom: '10px' }}>
          Add Ingredient
        </button>
      </div>
      
      <button type="submit">Create Recipe</button>
    </form>
  );
};

export default CreateRecipeForm;
