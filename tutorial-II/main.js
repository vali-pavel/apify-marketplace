const Apify = require('apify');
const typeCheck = require('type-check').typeCheck;

const BASE_URL = 'https://www.amazon.com';
const INPUT_TYPE = `{
    keyword: String,
}`;

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');
    if (!typeCheck(INPUT_TYPE, input)) {
        console.log('Expected input:');
        console.log(INPUT_TYPE);
        console.log('Received input:');
        console.dir(input);
        throw new Error('Received invalid input');
    }

    const { keyword } = input;
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
        url: `${BASE_URL}/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
        userData: {
            fetchProducts: true,
        }
    });

    const getProductAsins = async (page) => {
        const productAsinList = await page.evaluate(async () => {
            let productAsinList = [];
            const asinElList = document.querySelectorAll('[data-asin]');
            for(const asinEl of asinElList) {
                const asinValue = asinEl.getAttribute('data-asin');
                if(asinValue.length > 0) {
                    productAsinList.push(asinValue);
                }
            }
            return productAsinList;
        });

        return productAsinList;
    }

    const fetchProductDetails = async (asinList) => {
        for(const asin of asinList) {
            await requestQueue.addRequest({
                url: `${BASE_URL}/dp/${asin}`,
                userData: {
                    parseProductDetail: true,
                    asin: asin,
                }
            })
        }
    }

    const getProductDetails = async (page) => {
        const productDetails = await page.evaluate(async () => {
            const getProductTitle = () => {
                const productTitleEl = document.getElementById('productTitle');
                const qaProductTitleEl = document.querySelector('.qa-title-text');
                if(productTitleEl) {
                    return productTitleEl.innerText;
                } else if(qaProductTitleEl) {
                    return qaProductTitleEl.innerText;
                }
                return '';
            }

            const title = getProductTitle();

            const descriptionEl = document.querySelector('#productDescription p');
            const description = descriptionEl ? descriptionEl.innerText : '';

            return {
                title,
                description,
            };
        });

        return productDetails;
    }

    const fetchProductOffers = async (request, productDetails) => {
        const {
            url,
            userData: {
                asin
            }
        } = request;

        await requestQueue.addRequest({
            url: `${BASE_URL}/gp/offer-listing/${asin}`,
            userData: {
                parseProductOffers: true,
                productDetails: {
                    url,
                    keyword,
                    ...productDetails,
                },
            },
        });
    }

    const getProductOffers = async (page) => {
        const offerList = await page.evaluate(async () => {
            const getSellerName = (offerEl) => {
                const sellerLinkEl = offerEl.querySelector('.olpSellerName a');
                const sellerImageEl = offerEl.querySelector('.olpSellerName img');
                if(sellerImageEl) {
                    return sellerImageEl.alt;
                } else if(sellerLinkEl) {
                    return sellerLinkEl.innerText;
                }
                return '';
            }

            const getShippingPrice = (offerEl) => {
                const shippingEl = offerEl.querySelector('.olpShippingInfo span');
                const boldedShippingEl = shippingEl.querySelector('b');
                if(shippingEl) {
                    if(boldedShippingEl) {
                        return boldedShippingEl.innerText;
                    } else {
                        return shippingEl.innerText;
                    }
                }
                return '';
            }

            let offerList = [];
            const offerElList = document.getElementsByClassName('olpOffer');
            for(const offerEl of offerElList) {
                const price = offerEl.querySelector('.olpOfferPrice').innerText;
                const shippingPrice = getShippingPrice(offerEl);
                const sellerName = getSellerName(offerEl);
                offerList.push({
                    price,
                    shippingPrice,
                    sellerName,
                });
            }
            return offerList;
        });

        return offerList;
    }

    const setProductOffers = async (request, productOffers) => {
        const {
            userData: {
                productDetails,
            }
        } = request;

        for(const productOffer of productOffers) {
            await Apify.pushData({
                ...productDetails,
                ...productOffer,
            });
        }
    }

    const launchPuppeteerOptions = {
        headless: true,
        stealth: true,
        ignoreDefaultArgs: ["--enable-automation"],
    };

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        launchPuppeteerOptions,
        handlePageFunction: async ({ request, page }) => {
            const { userData } = request;
            if(userData.fetchProducts) {
                const productAsinList = await getProductAsins(page);
                await fetchProductDetails(productAsinList);
            } else if(userData.parseProductDetail) {
                const productDetailList = await getProductDetails(page);
                await fetchProductOffers(request, productDetailList);
            } else if(userData.parseProductOffers) {
                const productOfferList = await getProductOffers(page);
                await setProductOffers(request, productOfferList);
            }
        },
    });

    await crawler.run();
});
