import { useResponse, AutocompleteElement, Keywords } from "@nosto/preact"
import { formatCurrency, productImagePlaceholder } from "../helpers"
import SubmitButton from "./elements/SubmitButton"
import { useEffect } from "preact/hooks"


export default function Autocomplete() {
    const { products, keywords } = useResponse()

    if (!products?.hits?.length && !keywords?.hits?.length) {
        return
    }
    
    useEffect(()=>{
        // add distance from top, as much as the header's height
        document.querySelectorAll(".ns-autocomplete").forEach(el=>{
            let headerHeight = document.querySelector("header").offsetHeight;
            el.style.top = headerHeight + "px";
        })

        document.querySelectorAll(".ns-autocomplete-submit button").forEach(btn => {
            btn.addEventListener("click", function(){
                document.querySelector('.nosto-autocomplete-wrapper input').form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
            })
        })
    })

    return (
        <div id="nosto-autocomplete">
        <div
            class={`ns-autocomplete ns-absolute ns-d-flex ns-flex-column ns-flex-md-row ns-align-items-start ns-background-white ns-border-box ns-mx-auto ${
                keywords.hits && keywords.hits.length > 0 ? "ns-show-keywords" : ""
            }`}
            data-nosto-element="autocomplete"   
        >
            <div class="ns-w-100 ns-mt-sm-auto">
                <div class="ns-d-flex ns-flex-column ns-flex-md-row">
                    {keywords?.hits?.length > 0 && (
                        <div
                            class={`ns-autocomplete-keywords ns-d-flex ns-flex-column ns-col-12 ${
                                products?.hits?.length > 0 ? "ns-col-md-4" : "ns-col-sm-12"
                            }`}
                        >
                            <span class="ns-py-4 ns-px-4 ns-font-bold ns-font-5 ns-font-uppercase ns-font-letter-spacing-3">Suggestions</span>
                            <div class="ns-autocomplete-keywords-element ns-d-flex ns-flex-row ns-flex-md-column">
                                <Keywords
                                    hits={keywords.hits}
                                    keywordComponent={Keyword}
                                    elementComponent={Element}
                                    // keywordInCategoryComponent={KeywordInCategory}
                                />
                            </div>
                            {!products?.hits?.length && <SubmitButton text={showAllResultsString} />}
                        </div>
                    )}
                    {products?.hits?.length > 0 && (
                        <div class="ns-autocomplete-products ns-d-flex ns-flex-column ns-flex-grow-1 ns-mb-5">
                            <div class="ns-d-flex ns-justify-content-between ns-align-items-center">
                                <span class="ns-color-black ns-py-4 ns-px-2 ns-font-bold ns-font-5 ns-font-uppercase ns-font-letter-spacing-3">{productsString}</span>
                                <SubmitButton text={showAllResultsString} />
                            </div>
                            <div class="emz-ns-autocomplete-product-list">
                                {products?.hits?.map(hit => {
                                    return (
                                        <AutocompleteElement hit={hit}>
                                            <div
                                                data-url={hit.url}
                                                class="ns-d-flex flex-column ns-clickable ns-p-2 ns-h-100 ns-justify-content-between"
                                                data-nosto-element="product"
                                            >
                                                <a href={hit.url}>
                                                    <img
                                                        class="ns-h-auto ns-object-contain ns-w-100"
                                                        src={hit.imageUrl ?? productImagePlaceholder}
                                                        alt={hit.name}
                                                    />
                                                </a>
                                                <div class="ns-autocomplete-product-info ns-pt-3">
                                                    {/* {hit.brand && (
                                                        <div class="ns-color-black ns-mb-1 ns-font-4">{hit.brand}</div>
                                                    )} */}
                                                    <a class="ns-mb-2 ns-mb-md-5 ns-font-5 ns-font-medium ns-clipped ns-text-two-lines" href={hit.url}>
                                                        {hit.name}
                                                    </a>
                                                    <a class="ns-d-flex flex-column-reverse" href={hit.url}>
                                                        <span class={`ns-font-bold ${
                                                            hit.listPrice && hit.listPrice > hit.price ? "ns-sale-price" : ""
                                                        }`}>{formatCurrency(hit.price)}</span>
                                                        {hit.listPrice && hit.listPrice > hit.price && (
                                                            <span class="ns-color-black ns-font-3 ns-text-striked">
                                                                {formatCurrency(hit.listPrice)}
                                                            </span>
                                                        )}
                                                    </a>
                                                </div>
                                            </div>
                                        </AutocompleteElement>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>
    )
}

function Keyword({ hit }) {
    return (
        <span data-nosto-element="keyword">
            {hit?._highlight?.keyword ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: hit._highlight.keyword
                    }}
                ></span>
            ) : (
                hit.keyword
            )}
        </span>
    )
}

function Element({ hit, keywordComponent, filter }) {
    return (
        <AutocompleteElement hit={hit} filter={filter} class="ns-clickable ns-font-4">
            {keywordComponent}
        </AutocompleteElement>
    )
}

function KeywordInCategory({ category, children }) {
    return (
        <span class="ns-clickable ns-d-none ns-d-md-block">
            {category?.value ? (
                <span>
                    {children}{" "}
                    <span class="ns-keyword-in-category">
                        in <span>{category.value}</span>
                    </span>
                </span>
            ) : (
                children
            )}
        </span>
    )
}
