/*
 WHY DO WE NEED THIS FILE?

 routes.js alone is not going get things done completely. 
 This file will tell this app to connect to route.js when the app boots up

 https://github.com/fridays/next-routes

 At the moment we run `npm run dev` to start (package.json  "dev": "next dev")
 With above Next.js used to take routing directly from the `pages`

 To do this with the server.js, we made the following changes to the package.json (package.json "dev": "node server.js")
 This will start from this file when the app boots up, and it will use
*/

const { createServer } = require('http');
const next = require('next');

const app = next({
  dev: process.env.NODE_ENV !== 'production',
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

app.prepare().then(() => {
  createServer(handler).listen(3306, err => {
    if (err) throw err;
    console.log('Ready on localhost:3306');
  });
});
