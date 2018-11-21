const express = require('express');
const router = express.Router();
const Recipe = require('../models/RecipeModel');

// index recipe page-> show all recipes --==--=-=-=-=
router.get('/', (req, res, next) => {
    Recipe.find()
      .then((allTheRecipes) => {
        res.render('RecipesFolder/recipeIndex', { Recipes: allTheRecipes })
      })
      .catch((err) => {
        next(err);
      })
  // }
});
// -=-=-=-=-=-==--=-==-show all recipes end-==--=-=-=-=-=

// =-=--=-==-=-Create recipe -=--==--=-==--==-
router.get('/new', (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'sorry you must be logged in to create a recipe')
    res.redirect('/login');
  } else {
    Recipe.find()
      .then((allTheRecipes) => {
        res.render('RecipesFolder/newRecipe', { allTheRecipes })
      })
      .catch((err) => {
        next(err);
      })
  }
});

router.post('/recipes/create', (req, res, next) => {

  const newRecipe = req.body;
  newRecipe.author = req.user._id;
 
  Recipe.create(newRecipe)
    .then(() => {
      res.redirect('/recipes');
    })
    .catch((err) => {
      next(err)
    })
})


// =--=-=-=-=-=Create recipe ends -=-=--==--=-==-

// =--=-=-==-=-=--=EDIT recipe starts=--=-=-=-=-==-=-


router.get('/:_id/edit', (req, res, next) => {
  Recipe.findById(req.params._id)
    .then((theRecipe) => {
      res.render('RecipesFolder/editRecipe', {theRecipe: theRecipe})
    })
    .catch((err) => {
      next(err);
    })
});

router.post('/:_id/update', (req, res, next) => {

  Recipe.findByIdAndUpdate(req.params._id, req.body)
    .then(() => {
      // console.log("-=-==--=-=-=-==-"+theRecipe)
      res.redirect("/recipes/" + req.params._id);
    })
    .catch((err) => {
      next(err)
    })
})

// =--=-=-=-=-=-=-=EDIT RECIPE ENDS=--==--=-=-=-=-=-=

// =-=--=-=-=-=show each recipe detail starts-==--=-=-=
router.get('/:id', (req, res, next) => {
  let canDelete = false;
  let canEdit = false;
  Recipe.findById(req.params.id).populate('author')
    .then((theRecipe) => {
      if(req.user) {
        // console.log("--------- ", theRecipe.author._id);
        // console.log("=========", req.user._id);
        if(String(theRecipe.author._id) == String(req.user._id)){
          canDelete = true;
        }
      }
      data = { 
        theRecipe: theRecipe,
        canDelete: canDelete,
        canEdit: canEdit
      };
      // console.log(data)
      res.render('RecipesFolder/recipeDetails', data)
  
    })
    .catch((err) => {
      next(err);
    })
})
// =--=-=-=-=-=show each recipe detail ends-=-=-=-=-=-=

// -==--=-=-=delete Recipe starts=--=-=-=-=-=
router.post('/:id/delete', (req, res, next) => {
  Recipe.findByIdAndRemove(req.params.id)
    .then(() => {
      res.redirect('/recipes')
    })
    .catch((err) => {
      console.log("error")
      next(err);
    })
})
// =-=--=-=-=-=delete recipe ends=--=-=-=-=-=
module.exports = router;
