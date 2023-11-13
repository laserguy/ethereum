/*
 PURPOSE OF THIS FILE
Since we will have multiple pages, and we want some common things to appear in all those pages.
Like header or footer
And doing that in Next.js is slightly difficult
All common things that are needed can be put here
*/

import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './header';

const layout = props => {
  return (
    /*
        Although we have imported the 'semantic-ui-css', why still we have to include <link> here below,
        This is because with Next.js just importing doesn't work.

        But just adding it here directly, will add this link tag anywhere in the HTML. We want it to go in the <head></head>
        of the HTML, therefore it is wrapped around Next.js Head component
      */
    <Container style={{ marginTop: '10px' }}>
      <Head>
        <link
          async
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"
        />
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};

export default layout;
