# Marketplace Dapp Demonstration
This project is a blockchain marketplace supply chain management demonstration. It demonstrates a multi-shop marketplace, where shop owners carry on private dialogs with buyers regarding the state of purchases. Item states include ForSale, Sold, Shipped, Received, and Archived.

The demonstration is built using [Truffle](https://truffleframework.com/truffle), [Drizzle](https://truffleframework.com/drizzle), [React](https://reactjs.org/), [React-Router](https://www.npmjs.com/package/react-router) and [Reactstrap](https://reactstrap.github.io/). 

The main Solidity contract, Marketplace.sol, uses [OpenZeppelin's](https://github.com/OpenZeppelin/openzeppelin-solidity) Roles.sol access control library to implement Administrator and Shop Owner privileges. It also uses a [list managment library](https://github.com/markdthompson/ListUtils) developed specifically for this project.

To interact with the demonstration, you'll need [MetaMask](https://metamask.io/) installed in your browser. To run locally, you'll also need [Ganache-cli](https://github.com/trufflesuite/ganache-cli) and [Git](https://git-scm.com/).

## Live Demo
A live version of the demonstration is available on IPFS: 

The demonstration contract is live on Ropsten:

A demonstration walk-through script is available here:

## Local Installation
### Install Git, Truffle & Ganache-cli
To run a local version, make sure you have Git, Truffle and Ganache-cli installed. On Debian/Ubuntu, open a terminal window and:

`$ sudo apt install git-all`

`$ npm install truffle -g`

`$ npm install ganache-cli -g`

Confirm Git, Truffle and Ganache-cli are installed:

`$ git --version`

`$ truffle version`

`$ ganache-cli --version`

### Clone & Install the Repository
Create your project directory:

`$ mkdir myProject`

`$ cd myProject`

Clone the marketplace_dapp_demo repository:

`git clone https://github.com/markdthompson/marketplace_dapp_demo.git`

Install the required modules for Truffle:

`$ cd marketplace_dapp_demo`

`$ npm install`

Install the required modules for React:

`$ cd client`

`$ npm install`

## Running the Demonstration
To run the demonstration, you'll need to start Ganache-cli, seed your test accounts into MetaMask, compile the contract using Truffle, migrate the contract to Ganache-cli, run the Truffle test suites, and then start up the React dapp.

### Ganache-cli and MetaMask
After installing, start Ganache-cli and import it's test accounts into MetaMask using the seed phrase output to the terminal. Open another terminal session in another tab and run:

`$ ganache-cli`

Ganache-cli will start up and print ten test accounts and the seed phrase you'll import into MetaMask.

Copy the seed phrase from the terminal, open your browser and click on the MetaMask icon to open it up. If already logged in, log out. On the MetaMask login screen, click the 'import using account seed phrase' link at the bottom of the screen. Paste the seed phrase into the 'Wallet Seed' field, and input a new password into the password fields.

To walk through the demonstration, you'll want to use at least three test accounts: Account 1 will automatically become owner of the contract and the deafault administrator.You'll also want to add Account 2 as a Shop Owner, and Account 3 can be used as a non-permissioned user to buy products from the shops.

### Truffle Compile, Migrate & Test

Open another terminal tab and cd into the demo directory:

`$ cd ~/myProject/marketplace_dapp_demo`

#### Compile
Compile the Marketplace and Migration contracts:

`$ truffle compile`

#### Migrate
Migrate the contracts to Ganacke-cli:

`$ truffle migrate`

#### Tests
Tests were developed to cover the features demonstrated in the walk-through. There are fourteen tests in total, divided into two separate test suites. 

##### Admin Test Suite
The Admin test suit covers adding and removing shop owners and additional administrators, security restrictions on those features, and administrator control over the Circuit Breaker feature.

Run the admin test suite:

`$ truffle test ./test/adminTests.js`

##### Shop Test Suite
The Shop test suite covers shop owners' ability to create a shop, stock it with items, and un-permissioned users' ability to buy products. The supply chain management dialog between buyers and sellers is also covered in thsis suite.
And run the shop test suite:

`$ truffle test ./test/shopTests.js`

### Start the React Dapp
If everything compiles, migrates and tests correctly, you can start up the React Dapp and interact with it locally.

Change directories from the marketplace_dapp_demo root into the React client directory:

`:~/myProject/marketplace_dapp_demo$ cd ./client`

Then run npm start:
`:~/myProject/marketplace_dapp_demo/client$ npm start`

After the webserver starts up, access the demo at http://localhost:3000. Make sure you're logged into MetaMask, that MetaMask is using localhost:8545 as the network, and that MetaMask's Account 1 is active. Follow the instructions you see on the home page to get started with a walk through.
