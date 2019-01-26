# Avoiding Common Attacks
I consulted the [SWC Registry](https://smartcontractsecurity.github.io/SWC-registry/) regularly throughout the development of this Dapp. Security was integral to the development process.

My approach to development was to first block out the main contract in Remix before bringing it into the Truffle project. After I could successfully walk through the basic functionality in Remix, I created the Truffle project and compiled, migrated, and wrote the tests in Truffle. I then built out the UI in Truffle, occasionally needing to circle back and tweak the contract as the interface requirements became clearer.

Following is a list of common attacks and approaches taken to avoid them in this project. Several weaknesses were addressed by fixing the compiler version to 0.5.0, the latest compiler included in Truffle at the time of development. Some of those included the *Floating Pragma* & *Outdated Compiler Version* weaknesses. Several others were addressed by the 0.5.0 compiler itself, including *Incorrect Constructor Name*, *Use of Deprecated Solidity Functions*, and *State Variable Default Visibility*, as the Solc compiler in Remix complained if those issues arose. 

## Reentrancy
In the functions where value is exchanged, I make sure to set values before calling transfer().

## Cross-function Reentrancy
Same as above, to avoid cross-function reentrancy attacks, I make sure to set states before transfering value.

## Front Running
Since this Dapp is not and exchange or auction, and item prices are fixed, front running was not a big concern. If auction features were to be added, I'd investigate batching or a pre-commit mechanism.

## Timestamp Dependance
This Dapp isn't dependant upon timestamps, and does not use block.number as a timestamp. If auction features that are time sensitive are incorporated, more consideration with be given to timing, including the 15 second rule.

## Integer Overflow Underflow
I'm using OpenZeppelin's SafeMath for integer operations to avoid overflow/underflow.

## Denial of Service
In this demonstation, I am using arrays for administrators, shopowners, shops and items, which could be weaknesses for DoS attacks. To defend against them, I'm setting maximum counts for each array. This is fine for this demonstration, but for future versions I'll move to a paging implementation to enable scaling. 
