# Avoiding Common Attacks
The [SWC Registry](https://smartcontractsecurity.github.io/SWC-registry/) was consulted regularly throughout the development of this Dapp. Security was integral to the development process.

My approach to development was to first block out the main contract in Remix before bringing it into the Truffle project. After I could successfully walk through the basic functionality in Remix, I created the Truffle project and compiled, migrated, and wrote the tests in Truffle. I then built out the UI in Truffle, occasionally needing to circle back and tweak the contract as the interface requirements became clearer.

Following is a list of common attacks and approaches taken to avoid them in this project. Several weaknesses were addressed by fixing the compiler version to 0.5.0, the latest compiler included in Truffle at the time of development. Some of those included the *Floating Pragma* & *Outdated Compiler Version* weaknesses. Several others were addressed by the 0.5.0 compiler itself, including *Incorrect Constructor Name*, *Use of Deprecated Solidity Functions*, and *State Variable Default Visibility*, as the Solc compiler in Remix complained if those issues arose. 

## Reentrancy
In the functions where value is exchanged, I make sure to set values before calling trnasfer().

## Cross-function Reentrancy

## Front Running
Timing is not a critical factor in this Dapp; and there isn't significant incentive to be first, as in an auction. 

## Timestamp Dependance

## Integer Overflow Underflow

## Denial of Service
In this demonstation, I'm living dangerously with my use of unlimited arrays. In a future update, I will implement paging, and limit the number of items processed at a given time in order to prevent DoS attacks.
