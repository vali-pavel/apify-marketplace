const Apify = require('apify');
const typeCheck = require('type-check').typeCheck;

const {
    getProductAsins,
    fetchProductDetails,
    getProductDetails,
    fetchProductOffers,
    getProductOffers,
    setProductOffers,
} = require('./utils');
const { BASE_URL } = require('./constants');
const { validateInput } = require('./validateInput');


Apify.main(async () => {
    const input = await Apify.getValue('INPUT');
    validateInput(input);

    const { keyword } = input;
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
        url: `${BASE_URL}/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
        userData: {
            fetchProducts: true,
        }
    });

    const launchPuppeteerOptions = {
        headless: true,
        stealth: true,
        ignoreDefaultArgs: ["--enable-automation"],
    };

    const proxyConfiguration = await Apify.createProxyConfiguration({
      groups: ['BUYPROXIES94952']
    });

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        launchPuppeteerOptions,
        proxyConfiguration,
        handlePageFunction: async ({ request, page }) => {
            const { userData } = request;
            if(userData.fetchProducts) {
                const productAsinList = await getProductAsins(page);
                await fetchProductDetails(productAsinList, requestQueue);
            } else if(userData.parseProductDetail) {
                const productDetailList = await getProductDetails(page);
                await fetchProductOffers(request, productDetailList, requestQueue, input);
            } else if(userData.parseProductOffers) {
                const productOfferList = await getProductOffers(page);
                await setProductOffers(request, productOfferList);
            }
        },
    });

    await crawler.run();
});
