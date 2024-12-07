import { useEffect, useState } from "react";
import RecipeDetails from '../components/RecipeDetails'
import CreateRecipeForm from "../components/CreateRecipeForm";

const Home = () => {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/recipes');
        const json = await response.json();

        if (response.ok) {
          setRecipes(json);
        } else {
          setError(json.error || 'Something went wrong');
        }
      } catch (err) {
        setError('Failed to fetch recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="home">
      <div className="recipes">
        {recipes && recipes.map((recipe) => (
          <RecipeDetails key={recipe._id} recipe={recipe} showButtons={true}/>
        ))}
      </div>
      <CreateRecipeForm />
    </div>
  );
};

export default Home;
