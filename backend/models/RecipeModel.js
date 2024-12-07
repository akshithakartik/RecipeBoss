const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  }
});

const ingredientSchema = new Schema({
  name: {
    type: String,
    required: true,
  }
});

const recipeIngredientSchema = new Schema({
  ingredient: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true,
  },
  amount: {
    type: String, 
    required: true,
  },
});

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
  }
});

const recipeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cooking_time: {
    type: Number, 
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  ingredients: [recipeIngredientSchema],
}, {timestamps: true });

recipeSchema.index({ category: 1, difficulty: 1 });
recipeSchema.index({ user: 1 });

const User = mongoose.model('User', userSchema);
const Ingredient = mongoose.model('Ingredient', ingredientSchema);
const Category = mongoose.model('Category', categorySchema);
const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = {
  User,
  Ingredient,
  Category,
  Recipe
};
