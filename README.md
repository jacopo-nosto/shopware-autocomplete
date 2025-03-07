# Nosto Default Templates and Configuration for Shopware

* The directories in this repository give you a selection of templates you can use inside of the Nosto Code Editor.
* The Nosto Shopware plugins integrates directly into the storefront theme. However, the Autocomplete functionality is handled separately in the Nosto backend and needs a bit of configuration (see below).



## Before you start: Set Currency Format
1. Login to your Nosto account
2. Click the `Gear` icon in the top right of your screen and select `Account Settings`.
3. On the left side, click `Currency settings`, then go to `Price Formats` and click `Edit` for your main currency (e.g. `EUR`)
4. In the popup, define the currency format by e.g.:
   1. adding the currency symbol `€`
   2. setting the decimal separator to `, (comma)`
   3. setting the thousand separator to `. (point)`



## Required Template Adjustments in the Nosto Code Editor

Login to your Nosto account, go to `Product Experience Cloud` -> `Search` -> `Templates` and click `Open code editor`.


### CSS Changes

In `styles/autocomplete.css` add `top: 50px` at the top to `.ns-autocomplete`.


In `styles/index.css` add this block of the imports:

```css
.nosto-autocomplete-wrapper {
    display: flex;
    flex: 1 1 auto;
 }

 .header-search .search-suggest {
    display: none;
}
```


### JS Changes

In `index.js` go to the `init` call:

1. Comment out `serpComponent` and `categoryComponent` (since this is handled via the plugin)
2. Set the `inputCssSelector` to the corresponding value of your frontend (typically `.header-search-input` but it may vary in your theme)
3. Comment out `contentCssSelector` if you have enabled the "Search & Category Analytics" configuration in the Shopware backend (was added with versions 5 and 3.4 of the plugin)
4. Set the `query` in `serpUrlpMapping` to `"search"` and comment/remove the `products.xxx` entries
5. Remove the comment for `serpPath: '/search'` and `serpPathRedirect: true`
   1. If you run Shopware in a subdirectory, make sure to adjust the path, e.g.: `serpPath: '/shop/search'`



## Additional Resources

Please reach out to the Nosto support team in case you have any questions that aren't answered within the documentation:

* [Implementing Autocomplete](https://docs.nosto.com/techdocs/implementing-nosto/implement-search/implement-search-using-code-editor/implementing-autocomplete)
* [Details for Search Configuration](https://docs.nosto.com/techdocs/implementing-nosto/implement-search/implement-search-using-code-editor/implementing-search-page)
* [Full `Config` Reference](https://nosto.github.io/search-templates/library/interfaces/Config.html)