# Marketplace Dapp Demonstration

This project is a blockchain marketplace supply chain management system demonstration. It is built using Truffle, Drizzle, React, React-Router and Reactstrap. To interact with the demonstration, you'll need MetaMask installed in your browser.

A live version of the demonstration is available on IPFS: 

The demonstration contract is live on Ropsten:

A demonstration walk-through script is available here:

## Installation
To run a local version, make sure you have Git, Truffle and Ganache-cli installed. On Debian/Ubuntu, open a terminal window and:

`$ sudo apt install git-all`
`$ npm install truffle -g`
`$ npm install ganache-cli -g`

Confirm Git, Truffle and Ganache-cli are installed:
`$ git --version`
`$ truffle version`
`$ ganache-cli --version`

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
After installing, you need to start Ganache-cli, and import it's test accounts into MetaMask using the seed phrase output to the console when Ganache-cli starts up. Open another terminal session in another tab and run:

`$ ganache-cli`

Ganache-cli will start up and print it's ten test accounts and the seed phrase you'll use to re-login to MetaMask.

To walk through the demonstration, you'll want to use at least three of Ganache-cli's test accounts: Account 1 will automatically become owner of the contract and the deafault administrator.You'll also want to add Account 2 as a Shop Owner, and Account 3 can be used as a non-permissioned user to buy products from the shops.

### Truffle Compile, Migrate & Test

Open another terminal tab and cd into the demo directory:

`$ cd ~/myProject/marketplace_dapp_demo`

Compile the Marketplace and Migration contracts:

`$ truffle compile`

Migrate the contracts to Ganacke-cli:

`$ truffle migrate`

Run the admin test suite:

`$ truffle test ./test/adminTests.js`

And run the shop test suite:

`$ truffle test ./test/shopTests.js`

### Start the React Dapp
If everything compiles, migrates and tests correctly, you can start up the React Dapp and interact with it at http://localhost:3000

Change directories from the marketplace_dapp_demo root into the React client directory:

`:~/myProject/marketplace_dapp_demo$ cd ./client`

Then run npm start:
`:~/myProject/marketplace_dapp_demo/client$ npm start`

After the webserver starts up, you should be able to access the demo at http://localhost:3000. Follow the instructions you see on the home page to get started with a walk through.






