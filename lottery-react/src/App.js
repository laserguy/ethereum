import logo from './logo.svg';
import './App.css';
import react, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  /*
   Below syntax is the ECMA script 2016 syntax also known as ES6
   By doing this this will automatically added into the construcor method of the class
   Doing below is equivalent to writing this ...
    constructor(props) {
      super(props);

      this.state = { manager: '' };
    }
 */
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: '',
  };

  // This method is called when the component has rendered successfully
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();

    this.setState({ message: 'Wating on transaction success...' });

    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),
    });

    this.setState({ message: 'You have been entered!' });
  };

  onClick = async event => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Wating on transaction success...' });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: 'A winner has been picked' });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{' '}
          {this.state.players.length} people entered, competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            ></input>
          </div>
          <button>Enter</button>
        </form>
        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>

        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
