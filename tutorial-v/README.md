##### 1. What is the relationship between actor and task?
Tasks allow creation of multiple configurations for an Actor, which simplifies the process of running a particular Actor for different scenarios.

##### 2. What are the differences between default (unnamed) and named storage? Which one would you choose for everyday usage?
The default storage (unnamed) can be used to set and get data related to a run, while the named storage allows you to store or retrieve data from a named key value store that is associated with multiple runs.\
I used both of the named and unnamed storages, depending on the type of the Actor, but the most frequent is the named storage due to the need of persisting the run state.

##### 3. What is the relationship between the Apify API and the Apify client? Are there any significant differences?
Both of the Apify API and Apify client share the same methods and parameters. In my opinion, the difference between them is that the calls made from the Apify client to the API are made with exponential backoff.

##### 4. Is it possible to use a request queue for deduplication of product IDs? If yes, how would you do that?
To deduplicate any fields with the request queue, I would use the "uniqueKey" property. Another option would be to store the product ID in the "userData" property and then programatically check if a request with that field was already processed.

##### 5. What is data retention and how does it work for all types of storage (default and named)?
Data retention represents how long the actor run with its default storages is stored in the database. This means that any types of storage is available only for a certain period of time, based on the subscription.

##### 6. How do you pass input when running an actor or task via the API?
The input can be passed as a JSON object to the POST payload, which also requires the "Content-Type: application/json" HTTP header to be set.
