##### 1. Where and how can you use JQuery with the SDK?
jQuery can be used with the Cheerio crawler, which uses the "$" object to manipulate the DOM.

##### 2. What is the main difference between Cheerio and JQuery?
jQuery runs in a browser and attaches directly to the browser's DOM, while Cheerio is used to parse the page's HTML sent from the CheerioCrawler.

##### 3. When would you use CheerioCrawler and what are its limitations?
I would use CheerioCrawler when needing to scrape a high amount of pages in a short time, by having a low resource consumption. It is a great solution if you only need to parse specific HTML elements in a page.\
As specified in the documentation, the fllowing is a list of disadvantages:
- Does not work for all websites
- May easily overload the target website with requests
- Does not enable any manipulation of the website before scraping
- Does not return the content rendered dynamically by a script

##### 4. What are the main classes for managing requests and when and why would you use one instead of another?
The main classes for managing requests are the following:
- BasicCrawler
- CheerioCrawler
- PuppeteerCrawler

All of them can be used to crawl web pages in parralel, but they have different use cases.\
The BasicCrawler returns the Request[Link] object and it is useful when the page dowload and data extraction needs to be implemented by the user, otherwise one of CheerioCrawler and PuppeteerCrawler should be used.\
The CheerioCrawler can be used when needing to only fetch a page's HTML and parse elements from it, but if the website uses JavaScript then the PuppeteerCrawler will have to be used in order to interact with the DOM directly.

##### 5. How can you extract data from a page in Puppeteer without using JQuery?
By using the 'page' instance of Puppeteer.Page, which supports a set of methods described here: https://pptr.dev/#?product=Puppeteer&version=v3.0.4&show=api-class-page

##### 6. What is the default concurrency/parallelism the SDK uses?
The default concurrency used by SDK is 1.
