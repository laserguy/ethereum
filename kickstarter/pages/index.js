import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory.js';
import Layout from '../components/Layout.js';
import { Link } from '../routes';

/*
 Why are we using next.js here?
 React makes life a lot easier than directly dealing with the javascript
 React helps creating nice web pages(We also use here bootstrap CSS to make things more easier), a lot of functionality is available
 directly in the react which we have to write from scratch in plain Javascript
 But react misses the handling of the multi-page websites
 "Next.js" makes life easier here for dealing with that, it's a wrapper around react with some additional functionalites
  Next.js has some folder structure

  folder name "pages" is definetly required here, and keep all the react files inside here. Each of these react file will be shown as a page
*/

/*
  STEPS TO START TALKING TO THE DEPLOYED CONTRACT FOR THIS PAGE
 - Configure web3 with a provider from metamask  => done in ../ethereum/web3.js
 - Tell web3 that a deployed copy of the 'CampaignFactory' exists => done in ../ethereum/factory.js
 - Use factory instance to retrieve a list of deployed campaigns
 - Use React to show something about each Campaign
*/

// RUN "npm run dev" on the console, to start this project on the browser.

class CampaignIndex extends Component {
  /*
    This function is the life cycle function specific to Next.js.
    Next.js doesn't call componentDidMount() on its server while rendering(server side rendering)
    We will get the initial data from the ethereum network in this function

    Next.js will execute code on this server and throw it on the browser(If we have implemented getInitialProps)
    And browser will execute it again(If we have done the same implementation in componentDidMount())

    All in all: getInitialProps() will still be rendred if javascript is disabled on the browser.
  */
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    //return {campaigns:campaigns}
    // This can be condensed down to below (ES16)
    return { campaigns };
  }

  renderCampaigns() {
    /* 
      We are using `semantic-ui-react` and `semantic-ui-css` here for the styling purposes, these are packages 
      1 - `semantic-ui-react` will give us the markup for like "Card.Group" below etc. and
      2 - `semantic-ui-css` will provide the styling around that markup
      For above we can use the code construct directly from the website.
      This makes thing so easy, since we don't have to go through the trouble of wrinting HTML and CSS at all.
      
      .map = We all know what it does, provide the callback and it will execute it for all the elements in the array.
    */
    const items = this.props.campaigns.map(address => {
      return {
        header: address,
        description: (
          <Link route={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true, // This will make sure that this card streches in the whole container.
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Open Campaigns</h3>

          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary={true}
              />
            </a>
          </Link>

          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

// This step is necessary for the "Next"
export default CampaignIndex;
