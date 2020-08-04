const Apify = require('apify');

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');

    const datasetResponse = await Apify.client.datasets.getItems({
        datasetId: input.resource.defaultDatasetId
    })
    const offerList = datasetResponse.items

    const processedProducts = [];
    const productMinOfferList = [];
    for(const offer of offerList) {
        if(!processedProducts.includes(offer.url)) {
            const productOffers = offerList.filter(productOffer => productOffer.url === offer.url );
            const minOffer = productOffers.reduce((acc, currentValue) => {
                return (currentValue.price < acc.price) ? currentValue : acc;
            });
            productMinOfferList.push(minOffer);
            processedProducts.push(offer.url);
        }
    }
    await Apify.pushData(productMinOfferList)
});
