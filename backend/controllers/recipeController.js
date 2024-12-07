const { User, Ingredient, Category, Recipe } = require('../models/recipeModel')
const { getFilteredRecipes } = require('../aggregations/recipeaggregations')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

const createUser = async (req, res) => {
  const { name, email } = req.body
  
  try {
    const user = await User.create({name, email})
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const createIngredient = async (req, res) => {
  const { name } = req.body
  
  try {
    const ingredient = await Ingredient.create({name})
    res.status(200).json(ingredient)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const createCategory = async (req, res) => {
  const { name } = req.body
  
  try {
    const category = await Category.create({name})
    res.status(200).json(category)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const createRecipe = async (req, res) => {
  
    const { user, title, cooking_time, difficulty, category, ingredients } = req.body;
  
    try {
      const foundUser = await User.findById(user);
      if (!foundUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const validDifficulties = ['Easy', 'Medium', 'Hard'];
      if (!validDifficulties.includes(difficulty)) {
        return res.status(400).json({ 
          error: `Invalid difficulty: ${difficulty}. Valid options are: ${validDifficulties.join(', ')}` 
        });
      }
  
      const foundCategory = await Category.findById(category);
      if (!foundCategory) {
        return res.status(404).json({ error: 'Category not found' });
      }
  
      const recipeIngredients = [];
      for (const { ingredient, amount } of ingredients) {
        const foundIngredient = await Ingredient.findById(ingredient);
        if (!foundIngredient) {
          return res.status(404).json({ error: `Ingredient with ID ${ingredient} not found` });
        }
  
        recipeIngredients.push({ ingredient: foundIngredient._id, amount });
      }
 
      const newRecipe = new Recipe({
        user: foundUser._id,
        title,
        cooking_time,
        difficulty,
        category: foundCategory._id, 
        ingredients: recipeIngredients,
      });

      const savedRecipe = await newRecipe.save();
      res.status(201).json(savedRecipe);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  
}

const getRecipes = async (req, res) => {
  const recipelist = await Recipe.find({})
  res.status(200).json(recipelist)
}

const getRecipe = async (req, res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such recipe' });
  }

  try {
    const recipe = await Recipe.findById(id)
      .populate('user', 'name') 
      .populate('category', 'name') 
      .populate({
        path: 'ingredients.ingredient',
        model: 'Ingredient',
        select: 'name'
      });

    if (!recipe) {
      return res.status(404).json({ error: 'No such recipe' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteRecipe = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such recipe'})
  }

  const recipe = await Recipe.findOneAndDelete({_id: id})

  if (!recipe) {
    return res.status(404).json({error: 'No such recipe'})
  }

  res.status(200).json(recipe)
}

const updateRecipe = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such recipe'});
  }

  try {
    const recipe = await Recipe.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });

    if (!recipe) {
      return res.status(404).json({error: 'No such recipe'});
    }

    res.status(200).json(recipe);
  } catch (err) {
    res.status(400).json({error: err.message});
  }
}

const getUsers = async (req, res) => {
  const userlist = await User.find({})
  res.status(200).json(userlist)
}

const getCategories = async (req, res) => {
  const categorylist = await Category.find({})
  res.status(200).json(categorylist)
}

const getIngredients = async (req, res) => {
  const inglist = await Ingredient.find({})
  res.status(200).json(inglist)
}

const filterRecipes = async (req, res) => {
  const filters = req.body
  console.log('Received filters:', filters);

  const { difficulty, category } = filters;

  const matchedRecipes = await Recipe.find({
    difficulty: difficulty,
    category: ObjectId.createFromHexString(category),
  });  

  console.log('Received recipes:', matchedRecipes);
  
  const reportData = await getFilteredRecipes(filters)

  res.status(200).json({matchedRecipes, reportData})
}

module.exports = {
  createUser,
  createIngredient,
  createCategory,
  createRecipe,
  getRecipes,
  getRecipe,
  deleteRecipe,
  updateRecipe,
  getUsers,
  getCategories,
  getIngredients,
  filterRecipes
}