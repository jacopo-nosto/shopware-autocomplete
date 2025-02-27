# Nosto Default Templates and Configuration for Shopware

* The directories in this repository give you a selection of templates you can use inside of the Nosto Code Editor.
* The Nosto Shopware plugins integrates directly into the storefront theme. However, the Autocomplete functionality is handled separately in the Nosto backend and needs a bit of configuration (see below).




## Additional Resources

Please reach out to the Nosto support team in case you have any questions that aren't answered within the documentation:

* [Implementing Autocomplete](https://docs.nosto.com/techdocs/implementing-nosto/implement-search/implement-search-using-code-editor/implementing-autocomplete)
* [Details for Search Configuration](https://docs.nosto.com/techdocs/implementing-nosto/implement-search/implement-search-using-code-editor/implementing-search-page)
* [Full `Config` Reference](https://nosto.github.io/search-templates/library/interfaces/Config.html)




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

In `config.js` go to `export const defaultConfig` and add your default currency to the object, e.g. `currency: 'EUR'`.


In `helpers.js` add this block before the `export const productImagePlaceholder`:

```js
import { defaultConfig } from './config'
import { formatCurrency as format } from "@nosto/preact"

export function unbindOriginalSearch(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        var newElement = el.cloneNode(true);
        el.parentNode.replaceChild(newElement, el);
    })
}

export function formatCurrency(value, currency = defaultConfig.currency) {
    if (value == null) {
        console.error("Invalid value passed to formatCurrency:", value);
        return `${0} ${currency}`;
    }
    const formats = {
        // Copy this if you have additional currencies
        EUR: () => {
            return `${new Intl.NumberFormat('de-DE', {
                style: "currency",
                currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
           }).format(value)}`
       }
   }
   return formats[currency]?.() ?? `${value} ${currency}`
}
```


In `components/Autocomplete.jsx`:

1. Replace `const { format } = useCurrencyFormatting()` with `const format = (value) => formatCurrency(value)`
2. Add `formatCurrency` to the `import (...) from "../helpers"`


In `index.js` add `import { unbindOriginalSearch } from './helpers.js'` to the top of the file and then call `unbindOriginalSearch('.header-search-input')`.
The parameter of the call should match the `inputCssSelector`, see below.


In `index.js` go to the `init` call:

1. Comment out `serpComponent` and `categoryComponent` (since this is handled via the plugin)
2. Set the `inputCssSelector` to the corresponding value of your frontend (typically `.header-search-input` but it may vary in your theme)
3. Comment out `contentCssSelector` if you have enabled the "Search & Category Analytics" configuration in the Shopware backend (was added with versions 5 and 3.4 of the plugin)
4. Set the `query` in `serpUrlpMapping` to `"search"` and uncomment/remove the `products.xxx` entries
5. Remove the comment for `serpPath: '/search'` and `serpPathRedirect: true`