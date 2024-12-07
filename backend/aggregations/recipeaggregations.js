const { Recipe } = require('../models/recipeModel')
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getFilteredRecipes = async (filters) => {
  try {
    const { difficulty, category } = filters;

    const pipeline = [
        {
          '$match': {
            'difficulty': difficulty, 
            'category': ObjectId.createFromHexString(category)
          }
        }, {
          '$group': {
            '_id': null, 
            'average_cooking_time': {
              '$avg': '$cooking_time'
            }, 
            'average_number_ingredients': {
              '$avg': {
                '$size': '$ingredients'
              }
            }, 
            'unique_contributors_set': {
              '$addToSet': '$user'
            }
          }
        }, {
          '$project': {
            '_id': 0, 
            'average_cooking_time': 1, 
            'average_number_ingredients': 1, 
            'number_unique_contributors': {
              '$size': '$unique_contributors_set'
            }
          }
        }
    ];

    const result = await Recipe.aggregate(pipeline);
    return result[0] || {}; 
  } catch (error) {
    console.error('Error in aggregation pipeline:', error);
    throw error;
  }
};


module.exports = { 
  getFilteredRecipes 
};
