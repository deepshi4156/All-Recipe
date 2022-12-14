// we need to write this import statement becaue our index.html is taking ${icons} from dist folder
// in parcel 1 we can import in simple way but in parcel 2 for an static assets, use url:
//  Polyfill is a piece of code that is used to bring support for newer features in older
// browsers that currently do not have native support for these features
import icons from 'url:../img/icons.svg'
// polyfilling everything else
import 'core-js/stable'
// polyfilling async await
import 'regenerator-runtime/runtime'
console.log(icons)
const recipeDiv = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// rendering spinner on UI when no data is there 
const spinner = function (parentElement) {
  const markup = `<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
  var htmlObject = document.createElement('div');
  htmlObject.innerHTML = markup;
  parentElement.innerHTML = '';
  parentElement.insertAdjacentElement('afterbegin', htmlObject)
}
// api call for getting single food recipe
const displayRecipe = async function () {
  try {
    // getting recipe i from url hash 
    const id = window.location.hash.slice(1);
    if (!id) return
    spinner(recipeDiv)
    // loading recipe using api call
    const url = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
    const getRecipe = await fetch(url);
    const data = await getRecipe.json();

    console.log(data)
    // thrwing error in case of failure
    // if (!data.ok) {
    //   throw new Error(`${data.message} (${data.status})`)
    // }

    // destructuring recipe response received
    var { recipe } = data.data
    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients
    }
    // rendering the recipe on UI
    const structure = `
    <figure class="recipe__fig">
<img src=${recipe.image}" alt=${recipe.image} class="recipe__img" />
<h1 class="recipe__title">
  <span>${recipe.title}</span>
</h1>
</figure>

<div class="recipe__details">
<div class="recipe__info">
  <svg class="recipe__info-icon">
    <use href="${icons}#icon-clock"></use>
  </svg>
  <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
  <span class="recipe__info-text">minutes</span>
</div>
<div class="recipe__info">
  <svg class="recipe__info-icon">
    <use href="${icons}#icon-users"></use>
  </svg>
  <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
  <span class="recipe__info-text">servings</span>

  <div class="recipe__info-buttons">
    <button class="btn--tiny btn--increase-servings">
      <svg>
        <use href="${icons}#icon-minus-circle"></use>
      </svg>
    </button>
    <button class="btn--tiny btn--increase-servings">
      <svg>
        <use href="${icons}#icon-plus-circle"></use>
      </svg>
    </button>
  </div>
</div>

<div class="recipe__user-generated">
  <svg>
    <use href="${icons}#icon-user"></use>
  </svg>
</div>
<button class="btn--round">
  <svg class="">
    <use href="${icons}#icon-bookmark-fill"></use>
  </svg>
</button>
</div>
<!-- displaying a list of ingredients -->
<div class="recipe__ingredients">
<h2 class="heading--2">Recipe ingredients</h2>
<ul class="recipe__ingredient-list">
${recipe.ingredients.map(ing => {
      return `
<li class="recipe__ingredient">
  <svg class="recipe__icon">
    <use href="${icons}#icon-check"></use>
  </svg>
  <div class="recipe__quantity">${ing.quantity}</div>
  <div class="recipe__description">
    <span class="recipe__unit">${ing.unit}</span>
    ${ing.description}
  </div>
</li>
`
    }).join('')};

  <li class="recipe__ingredient">
    <svg class="recipe__icon">
      <use href="${icons}#icon-check"></use>
    </svg>
    <div class="recipe__quantity">0.5</div>
    <div class="recipe__description">
      <span class="recipe__unit">cup</span>
      ricotta cheese
    </div>
  </li>
</ul>
</div>

<div class="recipe__directions">
<h2 class="heading--2">How to cook it</h2>
<p class="recipe__directions-text">
  This recipe was carefully designed and tested by
  <span class="recipe__publisher">${recipe.publisher}</span>. Please check out
  directions at their website.
</p>
<a
  class="btn--small recipe__btn"
  href=${recipe.sourceUrl}
  target="_blank"
>
  <span>Directions</span>
  <svg class="search__icon">
    <use href="${icons}#icon-arrow-right"></use>
  </svg>
</a>
</div>
`;
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = structure;
    recipeDiv.insertAdjacentElement('afterbegin', htmlObject)
  } catch (error) {
    alert(error)
  }
}
// adding an event listener to an eevent hashchange (hash in url changes call display recipe on that)
const arr = ['hashchange', 'load']
arr.forEach(event => window.addEventListener(event, displayRecipe))
///////////////////////////////////////

