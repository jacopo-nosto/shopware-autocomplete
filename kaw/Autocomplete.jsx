import { useResponse, AutocompleteElement, useCurrencyFormatting } from "@nosto/preact";
import { productImagePlaceholder } from "../helpers";
import SubmitButton from "./elements/SubmitButton";
import { formatCurrency } from "../helpers";
import { useEffect } from "preact/hooks";

export default function Autocomplete() {
    const { products, keywords } = useResponse();

    if (!products?.hits?.length && !keywords?.hits?.length) {
        return null;
    }
    const inputField = document.querySelector("input.form-control.header-search-input");

    useEffect(()=>{
        // add distance from top, as much as the header's height
        document.querySelectorAll(".ns-autocomplete").forEach(el=>{
            let headerHeight = document.querySelector("header").offsetHeight;
            el.style.top = headerHeight + "px";
        })
    })

    return (
        <div id="nosto-autocomplete">
            <div class="ns-autocomplete ns-autocomplete-container" data-nosto-element="autocomplete">
                <div class="ns-autocomplete-inner-wrapper">
                    <div class="ns-ac-flex">
                        <div class="ns-ac-left">
                            <div class="ns-keywords-container">
                                <h3>Suchvorschläge</h3>
                                {keywords?.hits?.length > 0 && (
                                    <div class="ns-keywords-inner">
                                        {keywords.hits.slice(0, 5).map((item, index) => (
                                            <span
                                                class="ns-keyword-item"
                                                key={index}
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: item._highlight.keyword.replace(/<strong>/g, '<span class="ns-highlighted-part">').replace(/<\/strong>/g, '</span>')
                                                    }}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {products?.hits?.length > 0 && (
                            <div class="ns-autocomplete-products ns-ac-products">
                                <h3>Produkte</h3>
                                <div class="ns-ac-products-inner">
                                    {products.hits.map(hit => {
                                        const inputValue = inputField?.value.toLowerCase();
                                        const productName = hit.name;

                                        const highlightedName = productName.split(new RegExp(`(${inputValue})`, 'gi')).map((part, i) =>
                                            part.toLowerCase() === inputValue ? (
                                                <span key={i} class="ns-highlighted-part">{part}</span>
                                            ) : (
                                                part
                                            )
                                        );

                                        return (
                                            <AutocompleteElement hit={hit} key={hit.productId}>
                                                <div data-url={hit.url} class="ns-ac-product" data-nosto-element="product">
                                                    <div>
                                                        <img
                                                            class="ns-ac-img"
                                                            src={hit.imageUrl ?? productImagePlaceholder}
                                                            alt={hit.name}
                                                        />
                                                        <div class="ns-ac-product-name">
                                                            {highlightedName}
                                                        </div>
                                                    </div>
                                                    <div class="ns-ac-product-info">
                                                        <div>
                                                            <span>{formatCurrency(hit.price)}</span>
                                                            {hit.listPrice && hit.listPrice > hit.price && (
                                                                <span class="ns-color-black ns-font-4 ns-text-striked ns-ml-2">
                                                                    {formatCurrency(hit.listPrice)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </AutocompleteElement>
                                        );
                                    })}
                                </div>
                                <SubmitButton text="Alle Suchergebnisse anzeigen" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
