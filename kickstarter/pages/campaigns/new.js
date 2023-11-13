/*
    Any questions about import in React: read this 
    https://stackoverflow.com/questions/36795819/when-should-i-use-curly-braces-for-es6-import
*/

import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout.js';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false,
  };

  /*
    We know that `this` is not assigned properly with the normal function syntax(onSubmit(){}), that's why we
    are using =>
    https://javascript.info/arrow-functions#:~:text=As%20we%20remember%20from%20the,%2C%20showList()%20%7B%20this.
  */
  onSubmit = async event => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: '' });
    try {
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });

      Router.pushRoute('/');
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Message error header="Oops!!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            submit
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
