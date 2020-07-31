const Apify = require('apify');

const { BASE_URL } = require('./constants');

const getProductAsins = async (page) => {
    const productAsinList = await page.evaluate(async () => {
        const productAsinList = [];
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

const fetchProductDetails = async (asinList, requestQueue) => {
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

const fetchProductOffers = async (request, productDetails, requestQueue, input) => {
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
                keyword: input.keyword,
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

        const offerList = [];
        const offerElList = document.getElementsByClassName('olpOffer');
        for(const offerEl of offerElList) {
            const price = offerEl.querySelector('.olpOfferPrice').innerText.replace(/ /g, "");;
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

module.exports = {
    getProductAsins,
    fetchProductDetails,
    getProductDetails,
    fetchProductOffers,
    getProductOffers,
    setProductOffers,
}
