# Design Pattern Considerations
While developing this demonstration, the following design patterns were considered:

## Fail Early & Loud
This patttern is implemented throughout the Marketplace.sol contract. Common function requirements are codified wherever possible in modifiers, with exceptional requirements using Require() within individual functions.

## Access Restriction
This pattern was implemented both by using OpenZeppelin's Roles.sol access control library, and requiring owner status for some features. Administrator and ShopOwner access privileges are defined as roles.

## Auto Deprecation
This pattern was not implemented as I don't have an established end-of-life time/date  for the demonstration. It may live indefinitely as a portfolio piece.

## Mortal
This pattern is implemented and is accessible only by the owner. selfDesrtuct() is called within a Destroy() function that is only callable by owner when the circuit breaker has been triggered.

## Pull Over Push Payments
This pattern is implemented between buyers and sellers. When buyers purchase items, they pay into a balance maintained by each indidividual shop. Shopowners can then 'pull' the funds into their own accounts using a withdraw function.

## Circuit Breaker
This pattern is implemented as an administrator-accessible function. Any adminsitrator can throw the circuit breaker switch, which then restricts the ability to add new administrators, add new shop owners, create new shops, add shop items or withdraw funds from shops. A thrown circuit breaker also enables some admin features. The modifiers stopInEmergency and runInEmergency restrict functions accordingly. The Mortal pattern is executed as a 'runInEmergency' function.

## State Machine

## Speed Bump
## Factory
## Name Registry
## Mapping Iterator
