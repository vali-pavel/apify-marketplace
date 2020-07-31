##### 1. Actors have a Restart on error option in their Settings. Would you use this for your regular actors? Why? When would you use it, and when not?
I would use this option because it increases the robustness of the actor. I would use this feature when the actor has good chances of reaching the maximum allocated memory, which means that the state will have to be persisted.\
I don't think that it is a good idea to use this feature when the actor has a short timeout because it will cause infinite runs. Also, I wouldn't enable this option if the possible errors resulting from the code are not handled properly or not handled at all.

##### 2. Migrations happen randomly, but by setting Restart on error and then throwing an error in the main process, you can force a similar situation. Observe what happens. What changes and what stays the same in a restarted actor run?
Data not changed:
- input
- act id
- run id
- default key value store
- default dataset
- request queue
- run status (RUNNING)

Things that will change:
- values assigned to any variables
- loop progress

##### 3. Why don't you usually need to add any special code to handle migrations in normal crawling/scraping? Is there a component that essentially solves this problem for you?
The migrations don't need to be handled in normal crawling/scraping because they are using the RequestQueue or RequestList components, which persist the state of the requests.

##### 4. How can you intercept the migration event? How much time do you need after this takes place and before the actor migrates?
The migration event can be intercepted using by listening on the "migration" event from Apify.events. There is a 10 seconds window before the actor migrates.

##### 5. When would you persist data to a default key-value store and when would you use a named key-value store?
I would persist the data to a default key-value store when I just need to save data related to the actor run.\
On the other hand, I would use a named key-value store when multiple actors are related to each other and share data between them.

##### 6. Elaborate if you can ensure this object will stay 100% accurate, which means it will reflect the data in the dataset. Is this possible? If so, how?
The object that contains the ASIN offers can reflect the data in the dataset by updating the property values every time a new record is pushed to the datased. However, when the actor migrates, if the offers from a product were not parsed completely (meaning that the actor migrates while the request was still in progress to parse the offers) then the crawling will start again with the un-finished request, which will lead to duplicate offers. In order to prevent this scenario from occur, the product offers need to be marked with unique identifiers and checked when they are parsed from the page.
