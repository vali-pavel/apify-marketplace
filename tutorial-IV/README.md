##### 1. Do you have to rebuild an actor each time the source code is changed?
Yes, unless the actor is started using the "Run" option from the Apify interface

##### 2. What is the difference between pushing your code changes and creating a pull request?
Pusing changes makes them available in the remote branch and by creating a pull request the submitter is requesting the repo owner, or other contributors, to review those changes.

##### 3. How does the apify push command work? Is it worth using, in your opinion?
The apify push command uploads a local project to the Apify cloud and builds an actor from it. It is really helpful when the source code is hosted on a github repository and you need to test some changes in the Apify cloud, I should have gone through the tutorial sooner because I used to manually update the code in the Apify platform, instead of using the CLI.
