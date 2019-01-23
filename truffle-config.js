/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
const path = require("path");

// for external network
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "your mnemonic here";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6000000,
      gaslimit: 10000000000
    },
    ropsten: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/ddd29339767244cfa8e1c11a434709eb"),
      network_id: '3',
    },
    rinkeby: {
      // must be a thunk, otherwise truffle commands may hang in CI
      provider: () =>
        new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/ddd29339767244cfa8e1c11a434709eb"),
      network_id: '4',
    }
  },

  contracts_build_directory: path.join(__dirname, "client/src/contracts")
};