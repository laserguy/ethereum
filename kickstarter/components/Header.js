/*
PURPOSE OF THIS FOLDER IS TO PUT ALL THE REUSABLE COMPONENTS HERE
*/

import React from 'react';
import { Menu } from 'semantic-ui-react';
/*
Link wraps all the elements inside it and implements a handler,which executes when any element inisde Link is clicked

Links are used to get single-page-navigation working correctly.  If you instead use an 'a' tag with an 'href'
property, the app will do a full reload whenever you click that link.  Link tags will instead only cause a
different component to be displayed on the screen without the full refresh.

I had a lot of issues with Link, which can be used two ways:
import Link from 'next/link'
import {Link} from '../routes'

Again syntax is different depending upon which one you choose
But many times I had to restart the server run "npm run dev" again and again make the changes reflect on the browser
 */
import { Link } from '../routes';

const header = () => {
  return (
    <Menu>
      <Link route="/">
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link route="/">
          <a className="item">Campaigns</a>
        </Link>
        <Link route="/campaigns/new">
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default header;
