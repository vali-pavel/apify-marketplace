##### 1. How do you allocate more CPU for your actor run?
The CPU is computed automatically from the memory, which means that more CPU can be allocated by increased the memory. The Actor gets a full CPU core for each 4096MB of memory.

##### 2. How can you get the exact time when the actor was started from within the running actor process?
By using the getEnv() method from the Apify class, which returns a `startedAt` property.

##### 2. Which are the default storages an actor run is allocated (connected to)?
An actor run has the following default storages: key-value store, dataset and request queue

##### 4. Can you change the memory allocated to a running actor?
No, the memory needs to be specified before starting the actor run

##### 5. How can you run an actor with Puppeteer in headful (non-headless) mode?
In Apify, the actor can be ran with Puppeteer in headful mode by using the Node.js 12 + Chrome + Xvfb on Debian docker image

In a local environment, the headful mode can be enabled with the following two options:\
a) Setting the value of APIFY_HEADLESS environment variable to 0\
b) Setting the `headless` property to false when launching puppeteer with apify (Apify.launchPuppeteer)

##### 6. Imagine the server/instance the container is running on has a 32 GB, 8-core CPU. What would be the most performant (speed/cost) memory allocation for CheerioCrawler? (Hint: NodeJS processes cannot use user-created threads)
Since NodeJS processes cannot use user-created threads, meaning that there is no benefit from having multiple cores, the most performant memory allocation would be 4096 MB because only one CPU core will be used.
