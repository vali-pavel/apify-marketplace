const Apify = require('apify');
const typeCheck = require('type-check').typeCheck;

const {
    getProductAsins,
    fetchProductDetails,
    getProductDetails,
    fetchProductOffers,
    getProductOffers,
    setProductOffers,
    handleActorMigration,
} = require('./utils');
const {
    BASE_URL,
    LOG_OFFERS_INTERVAL,
    SESSION_MAX_USAGE_COUNT,
} = require('./constants');
const { validateInput } = require('./validateInput');
const { UserDataLabels } = require('./enums');

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');
    validateInput(input);

    const { keyword } = input;
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({
        url: `${BASE_URL}/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=${keyword}`,
        userData: {
            label: UserDataLabels.PRODUCT,
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

    let asinOffers = await Apify.getValue('asinOffers') || {};

    setInterval(async () => {
        console.log(asinOffers);
        await Apify.setValue(
            'asinOffers',
            asinOffers,
        );
    }, LOG_OFFERS_INTERVAL);

    Apify.events.on('migrating', async () => {
        await handleActorMigration(asinOffers);
    });

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        launchPuppeteerOptions,
        proxyConfiguration,
        maxConcurrency: 1,
        sessionPoolOptions: {
            sessionOptions: {
                maxUsageCount: SESSION_MAX_USAGE_COUNT,
            }
        },
        useSessionPool: true,
        handlePageFunction: async ({ request, page, session }) => {
            const sessionMaxUsageReached = session.isMaxUsageCountReached();
            if(sessionMaxUsageReached) session.retire();
            session.retireOnBlockedStatusCodes(429, [401, 403, 503])

            const { userData } = request;
            if(userData.label === UserDataLabels.PRODUCT) {
                const productAsinList = await getProductAsins(page);
                await fetchProductDetails(productAsinList, requestQueue);
            } else if(userData.label === UserDataLabels.PRODUCT_DETAIL) {
                const productDetailList = await getProductDetails(page);
                await fetchProductOffers(request, productDetailList, requestQueue, input);
            } else if(userData.label === UserDataLabels.OFFER) {
                const productOfferList = await getProductOffers(page);
                await setProductOffers(request, productOfferList, asinOffers);
            }
        },
    });

    await crawler.run();
});
