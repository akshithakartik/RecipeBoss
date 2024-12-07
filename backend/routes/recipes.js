const express = require('express')

const {
  createUser,
  createIngredient,
  createCategory,
  createRecipe,
  getRecipes,
  getRecipe,
  deleteRecipe,
  updateRecipe,
  getUsers,
  getIngredients,
  getCategories,
  filterRecipes
} = require('../controllers/recipeController')

const router = express.Router()

router.get('/', getRecipes)

router.get('/:id', getRecipe)

router.post('/user', createUser)

router.post('/ingredients', createIngredient)

router.post('/categories', createCategory)

router.post('/recipe', createRecipe)

router.delete('/:id', deleteRecipe)

router.patch('/:id', updateRecipe)

router.get('/recipe/users', getUsers)

router.get('/recipe/ingredient', getIngredients)

router.get('/recipe/category', getCategories)

router.post('/report/filter', filterRecipes)

module.exports = router
