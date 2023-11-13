/*
 WHY DO WE NEED THIS FILE?

 Next.js helps us to navigate multiple pages, but path of those pages have to be predefined in the folder structure `pages`
 It doesn't help us with dynamic/custom routing for example:=>

 There are no issues with routing like   
 /
 /campaign/new
 /campaign/set

 But the issue would be in below cases

 /campaign/0x73988743984
 /campaign/0x34434434434/approve

 These pages are based on the address of the campaign, and created dynamically and can't be handled directly by
 the Next.js

 Therefore, we install a package next-routes which Next.js achieve this.
 https://github.com/fridays/next-routes
*/

const routes = require('next-routes')(); // This means require will return a function

/*
Below syntax is for the dynamic routing:-
address => Is will be dynamically assigned here, notice the colon(:)
and then it will be redirected to path in second argument

But there is one gotcha here, the last add line overrides everything, for example

add('/campaigns/:address', '/campaigns/show')

This makes any path after `campaigns` to be treated as an address, for e.g '/campaigns/new'
here `new` will be treated as address, and we have to handle paths like this separately.
*/
routes
  .add('/campaigns/new', '/campaigns/new')
  .add('/campaigns/:address', '/campaigns/show')
  .add('/campaigns/:address/requests', 'campaigns/requests/index')
  .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

/*
  Whenever , you add a new route to the routes, you have to restart the server. Otherwise there would be issues
  while duing the hard refresh. All pages from the client side would work properly, but the server side rendering
  for the new routes will have problem without restarting the server.
*/

module.exports = routes;
