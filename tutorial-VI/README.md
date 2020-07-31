##### 1. What types of proxies does the Apify Proxy include? What are the main differences between them?
Apify provides access to datacenter proxy servers with shared and dedicated IPs, residential proxy and Google SERP proxy.

Shared datacenter IPs are used by multiple users, which increases the chances that the IPs might get blocked.
Dedicated datacenter IPs are not shared with other users, which means that the possible chances of getting blocked are predictable.
Both of shared and dedicated dacatenter IPs have a transfer limit of 5GB per IP address.

The residential proxy allows the user to access a larger pool of proxy servers, with no transfer limits.

The main difference between datacenter and residential proxies lies in the source of the IP, because the datacenter proxies are not affiliated with an ISP, while the residential proxies use IP addresses provided by an ISP.

The Google SERP proxy can be used to get search results from Google Search from multiple countries

##### 2. Which proxies (proxy groups) can users access with the Apify Proxy trial? How long does this trial last?
The free trial alows the users to access a pool of IP addresses which are available only for the paid Freelancer subscription plan and it lasts 30 days.

##### 3. How can you prevent a problem that one of the hardcoded proxy groups that a user is using stops working (a problem with a provider)? What should be the best practices?
I'm not sure if this is correct, but one option would be to initially check if the request are proxied correctly by making a call to https://api.apify.com/v2/browser-info/

##### 4. Does it make sense to rotate proxies when you are logged in?
Yes, that makes sense because the web application can still track the requests made from the IP address.

##### 5. Construct a proxy URL that will select proxies only from the US (without specific groups).
NodeJS:\
const proxyConfiguration = await Apify.createProxyConfiguration({\
&nbsp; &nbsp; countryCode: 'US'\
});\
const proxyUrl = proxyConfiguration.newUrl();

##### 6. What do you need to do to rotate proxies (one proxy usually has one IP)? How does this differ for Cheerio Scraper and Puppeteer Scraper?
IP rotation can be achieved by managing the session using the SessionPool class. Proxy rotation for the Cheerio Scraper and Puppeteer Scraper can be enabled by passing the "proxyRotation" property to the actor input and set it's value to one of the following: "RECOMMENDED", "PER_REQUEST", "UNTIL_FAILURE"

##### 7. Try to set up the Apify Proxy (using any group or auto) in your browser. This is useful for testing how websites behave with proxies from specific countries (although most are from the US). You can try Switchy Omega extension but there are many more. Were you successful?
I've successfully set up the proxy connection using the Switchy Omega extension.

##### 8. Name a few different ways a website can prevent you from scraping it.
- IP detection
- IP rate limiting
- Browser detection
- Tracking user behavior

##### 9. Do you know any software companies that develop anti-scraping solutions? Have you ever encountered them on a website?
I've encountered a few websites that blocked access by checking the IP address and also by looking for browser automation, but I'm not aware of the anti-scraping solution they were using.
