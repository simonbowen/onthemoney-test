# Introduction

This is the first time I have done anything with React in quite a while, I have been using 
VueJS for the past year. I am a little out of touch and had to read up on React Hooks.

When I saw the requirement for data synchronisation across browsers I immediately decided to use
graphql with Apollo, this supports subscriptions over websockets. There are a couple of ways this could have been tackled

* Standard websockets which fires an event to update the data from the client
* Polling (probably the worse solution)
* Subscriptions

I am using a simple embedded database for persistence. 

The Backend is in Node, normally I would have reached for PHP with Laravel, however the support
for GraphQL and subscriptions is far more mature in Node. 

I felt using Redux for state management in this application would be overkill and unnecessary. I have experience
with redux in previous projects as well as Vuex. 

Unfortunately I haven't any more time to dedicate to this test and have left out units tests. If I had
more time I would consider refactoring the code into smaller units to make it easier for readability and testing.


# Build

```
git clone https://github.com/simonbowen/onthemoney-test.git
cd onthemoney-test
cd client && npm i && npm run build
cd -
docker-compose build
docker-compose up -d
open http://localhost:3000
```