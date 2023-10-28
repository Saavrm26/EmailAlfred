
# EmailAlfred
EmailAlfred is a multiuser email client that replies to your unreplied conversation.
## Working

A user login's by using the Login with google button. They provide their consent in the google oauth screen. On successful authentication. The webserver sends `replyWorker.js` the access tokens for the user. `replyWorker.js` starts sending replies.
`replyWorker.js` is seperate and independent from the web server. It doens't care about the user. This enables our app to server multiple users at once

## Libraries and Technologoies
* Node.js
* Express : Express is minimalistic web framework for Node.js. It was used to create the webserver
* Reddis: Reddis is a in memory database most commonly used in caching and message queuing. Here reddis was used as a asynchronous message queue between the `server.js` and `replyWorker.js`
* BullMQ: BullMQ is implements the message queue feature and uses Reddis under the hood. 
* googleapis: This libraries provides API's to all the services that Google Cloud provides. In this project the OAuth2 and Gmail API were used. OAuth2 is a new authentication technology that doesn't require storing session nor does it require users to enter their passwords everytime. Here, it was used to implement Login with Google functionality. Gmail API was used to read and send emails, as well as manage Labels.
* morgan: morgan logs http requests that are made to the express server
* pug: pug is a templating engine. Here it was used to implement the login page.
## Areas of improvement

There are a number of areas where the code can be improved, but due to limited time I wasn't able to touch upon
* `replyWorker.js`: 
	* `gmail` parameter is passed a lot. OOP patterns could've been used to make the code more modular and clean.
	* Usage of a database to store the timestamp / pagenumber of the last reply. It will ensure that we are only replying to newly arrived emails. It will also prevent traversing the entire inbox to find unread emails
	* Concurreny can be improved. Maybe by using a  sepeate task queue just for sending email.
	* Better function name could've been used
* `app.js`: 
	* Fronend could've been a lot better
	* Logout feature isn't implemented
 
 * Better Error Handling thoughout the project to make the app fault tolerant




