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
    req.flash('error', 'sorry you must be logged in to donate a Movie')
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
  // instead of doing title: req.body.title and decription: req.body.description
  // we just take the entire req.body and make a Movie out of it
  const newRecipe = req.body;
  newRecipe.author = req.user._id;
  // newMovie.donor = req.user._id;
  // since req.user is available in every route, its very easy to attach the current users id to any new thing youre creating or editing
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
  let canEdit = false;
  Recipe.findById(req.params._id)
    .then((theRecipe) => {
      if (req.user) {
        // console.log("--------- ", theRecipe.author._id);
        // console.log("=========", req.user._id);
        if (String(theRecipe.author._id) == String(req.user._id)) {
          canEdit = true;
        }
      }
      data = {
        theRecipe: theRecipe,
        canEdit: canEdit
      };
      res.render('RecipesFolder/recipeDetails',data)
    })
    .catch((err) => {
      next(err);
    })
});

router.post('/:id/update', (req, res, next) => {

  //req.body is an object with the exact perfect structure of a Movie
  // this is a coicidence becase we gave our inputs name= the same keys that our Movie model has

  Recipe.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect('/Recipes/' + req.params.id);
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
