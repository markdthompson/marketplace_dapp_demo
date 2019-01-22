# Design Pattern Considerations
While developing this demonstration, the following design patterns were considered:

## Fail Early & Loud
This patttern is implemented throughout the Marketplace.sol contract. Common function requirements are codified wherever possible in modifiers, with exceptional requirements using Require() within individual functions.

## Access Restriction
This pattern was implemented both by using OpenZeppelin's Roles.sol access control library, and requiring owner status for some features. Administrator and ShopOwner access privileges are defined as roles.

## Auto Deprecation
This pattern was not implemented as I don't have an established end-of-life time/date  for the demonstration. It may live indefinitely as a portfolio piece.

## Mortal
This pattern is implemented and is accessible only by the owner. It's used in combination with the Circuit Breaker pattern. selfDesrtuct() is called within a Destroy() function that is only callable by owner when the circuit breaker has been triggered.

## Pull Over Push Payments
This pattern is implemented between buyers and sellers. When buyers purchase items, they pay into a balance maintained by each individual shop. Shopowners can then 'pull' the funds into their own accounts using a withdraw function.

## Circuit Breaker
This pattern is implemented in modifiers. The modifiers stopInEmergency and runInEmergency restrict functions accordingly. Any adminsitrator can throw the circuit breaker switch, which then restricts the ability to add new administrators, add new shop owners, create new shops, add shop items or withdraw funds from shops. A thrown circuit breaker also enables some admin features. The Mortal pattern is executed as a 'runInEmergency' function. 

## State Machine
This pattern is implemented and is the basis of the buyer-seller supply chain management dialog. Items can be in only one state at a time; ForSale, Sold, Shipped, Received or Archived, and buyers and sellers take turns triggering state transitions.

## Speed Bump
This pattern is not currently implemented. I'm considering how it could be implemented in the future as part of the buyer-seller dialog. Currently, when a buyer 'buys' an item, their funds are immediately transfered into the shop's balance. In a future version, I'd like to place the funds in 'escrow', slowing payment down until the state of a purchased item has transitioned from Sold, all the way to Received, before funds would be released and available for widthdrawal by the seller. I'd also like to investigate the Speed Bump pattern in the context of an overall 'side-channel' approach to the buyer-seller dialog, as each state change currently runs about $0.11 each in gas. The buyer-seller dialog might be more cost-effective if managed as a side channel, with speed bumps buult in.

## Factory
This pattern is not implemented. It was implemented in an early version of the system, where shops and orders were broken out as factory objects, but in an effort to minimize gas I opted to use structs instead. In the future I'd like to refactor the main contract and try the factory approach for comparison.

## Name Registry
This pattern was not implemented. In the future I may refactor the main contract to be upgradable, at which time I could implement this pattern.

## Mapping Iterator
This pattern is used to return arrays of indexes, which are then be looped over in React to obtain the individual struct data for shops and items.
