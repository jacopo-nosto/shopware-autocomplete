import { useResponse, AutocompleteElement, Keywords, useCurrencyFormatting } from "@nosto/preact"
import { useEffect } from "preact/hooks"
import { productImagePlaceholder } from "../helpers"
import SubmitButton from "./elements/SubmitButton"

export default function Autocomplete() {
    const { products, keywords } = useResponse()
    const { format } = useCurrencyFormatting()

    if (!products?.hits?.length && !keywords?.hits?.length) {
        return
    }

    useEffect(()=>{
        
        // add distance from top, as much as the header's height
        document.querySelectorAll(".ns-autocomplete").forEach(el=>{
            let headerHeight = document.querySelector("header").offsetHeight;
            el.style.top = headerHeight + "px";
        })

        // since the autocomplete has been moved outside of the original <form> with this piece of code we
        // add an event listener to the button, that submits the form
        document.querySelectorAll(".ns-autocomplete-submit button").forEach(btn => {
            btn.addEventListener("click", function(){
                document.querySelector('.nosto-autocomplete-wrapper input').form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
            })
        })
    })

    return (
        <div id="nosto-autocomplete">
            <div
                class="ns-autocomplete ns-absolute ns-d-flex ns-flex-column ns-flex-sm-row ns-align-items-start ns-background-white ns-border-box ns-mx-auto"
                data-nosto-element="autocomplete"
            >
                <div class="ns-w-100 ns-mt-sm-auto">
                    <div class="ns-d-flex ns-flex-column ns-flex-sm-row">
                        {keywords?.hits?.length > 0 && (
                            <div
                                class={`ns-autocomplete-keywords ns-d-flex ns-flex-column ns-col-12 ${
                                    products?.hits?.length > 0 ? "ns-col-sm-4" : "ns-col-sm-12"
                                }`}
                            >
                                {/* <div class="ns-color-black ns-py-2 ns-px-4 ns-font-medium ns-font-4">
                                    Keywords
                                </div> */}
                                <div class="ns-d-flex ns-flex-column">
                                    <Keywords
                                        hits={keywords.hits}
                                        keywordComponent={Keyword}
                                        elementComponent={Element}
                                        keywordInCategoryComponent={KeywordInCategory}
                                    />
                                </div>
                                {!products?.hits?.length && <SubmitButton text="See all search results" />}
                            </div>
                        )}
                        {products?.hits?.length > 0 && (
                            <div class="ns-autocomplete-products ns-d-flex ns-flex-column ns-flex-grow-1">
                                {/* <div class="ns-color-black ns-py-2 ns-px-4 ns-font-medium ns-font-4">
                                    Products
                                </div> */}
                                <div>
                                    <div class="ns-d-flex ns-flex-row nosto-autocomplete-products">
                                        {products?.hits?.map(hit => {
                                            return (
                                                <AutocompleteElement class="nosto-autocomplete-product" hit={hit}>
                                                    <div
                                                        data-url={hit.url}
                                                        class="ns-d-flex flex-column ns-clickable ns-p-2"
                                                        data-nosto-element="product"
                                                    >
                                                        <a href="javascript:void(0)">
                                                            <img
                                                                class="ns-h-auto ns-object-contain"
                                                                src={hit.imageUrl ?? productImagePlaceholder}
                                                                alt={hit.name}
                                                            />
                                                        </a>
                                                        <div class="nosto-autocomplete-product-info">
                                                            {hit.brand && (
                                                                <div class="ns-color-black ns-mb-1 ns-font-4">{hit.brand}</div>
                                                            )}
                                                            <div class="ns-mb-2 ns-font-4 ns-clipped ns-text-one-line">
                                                                {hit.name}
                                                            </div>
                                                            <div>
                                                                <span>{format(hit.price)}</span>
                                                                {hit.listPrice && hit.listPrice > hit.price && (
                                                                    <span class="ns-color-black ns-font-4 ns-text-striked ns-ml-2">
                                                                        {format(hit.listPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </AutocompleteElement>
                                            )
                                        })}
                                    </div>
                                </div>
                                <SubmitButton text="See all search results" />
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
        <AutocompleteElement hit={hit} filter={filter} class="ns-clickable ns-py-2 ns-px-4 ns-font-4">
            {keywordComponent}
        </AutocompleteElement>
    )
}

function KeywordInCategory({ category, children }) {
    return (
        <span class="ns-clickable">
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
