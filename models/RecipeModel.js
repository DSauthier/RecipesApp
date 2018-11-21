const mongoose = require('mongoose');
// create a new schema object
const Schema = mongoose.Schema;



// you only need to do {type: string} if you are adding more rules like a default or minlength
const RecipeSchema = new Schema({
  name: String,
  ingredients: [String],
  directions: String,
  time: Number,
  image: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' }
},
   {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

//3.1 you create the cat class using those rules
const Recipe = mongoose.model('Recipe', RecipeSchema);


module.exports = Recipe;