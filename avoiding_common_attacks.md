# Avoiding Common Attacks
The [SWC Registry](https://smartcontractsecurity.github.io/SWC-registry/) was consulted regularly throughout the development of this Dapp. Security was integral to the development process.

My approach to development was to first develop the contract in Remix before bringing it into a Truffle project, compiling, migrating, and testing. As I built out the UI in Truffle, I would occasionally need to circle back and tweak the contract as the interface requirements became clearer.

Following is a list of common attacks and approaches taken to avoid them in this project. Several weaknesses were addressed by fixing the compiler version to 0.5.0, the latest compiler included in Truffle, including the Floating Pragma & Outdated Compiler Version weaknesses. Several others are addressed by the 0.5.0 compiler itself, including Incorrect Constructor Name, Use of Deprecated Solidity Functions and State Variable Default Visibility, as the Solc compiler in Remix will complain. 

## Reentrancy

## Cross-function Reentrancy

## Front Running

## Timestamp Dependance

## Integer Overflow Underflow

## Denial of Service
