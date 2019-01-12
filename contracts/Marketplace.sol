pragma solidity ^0.5.0;

/// @notice used for access control on functions
import "../node_modules/openzeppelin-solidity/contracts/access/Roles.sol";
/// @notice used for array/list reordering following item deletion
import "../contracts/ListUtils.sol";

/**
@title Marketplace - A Marketplace demonstration project for the 2018-19 ConsenSys Developer Bootcamp
@author Mark D. Thompson <thomesoni@gmail.com>
@notice This contract is intended as the bootcamp final project demonstration
@dev This contract uses OpenZeppelin's Roles.sol library for ACL
@dev Installed OpenZeppelin using:
$ npm init -y
$ npm install --save-exact openzeppelin-solidity
@dev It also uses my custom library AccountListLib.sol for account list management functions
*/
contract Marketplace{
    using Roles for Roles.Role;

    /**
     * storage variables
     */
    /// marketplace owner
    address payable private owner;

    /// circuit breaker
    bool private stopped = false;

    /// acl roles
    Roles.Role private admins;
    Roles.Role private shopOwners;

    /// account lists
    address[] private adminAccts;
    address[] private shopOwnerAccts;

    /// shop data structures
    struct Shop {
        address shopOwner;
        string name;
        string category;
    }
    Shop[] public shops;
    mapping(address => uint) private ownerShopCount;

    /// item data structures
    /// item states
    enum State {
      ForSale,
      Sold,
      Shipped,
      Received
    }

    /// Item object structure
    struct Item {
        uint shopID;
        string name;
        uint price;
        State state;
        address payable seller;
        address payable buyer;
    }
    /// master item list
    Item[] public items;
    /// shop item list mapping
    mapping(uint => uint) private shopItemCount;
    /// customer item list mapping
    mapping(address => uint) private customerItemCount;

    /**
     * events
     */
    /// ciruit breaker
    event ToggledCircuit(bool _stopped);

    /// access
    event AddedAdmin(address _newAdmin);
    event RemovedAdminAccess(address addr);
    event AddedShopOwner(address _shopOwner);
    event RemovedShopOwnerAccess(address addr);

    /// shop CRUD
    event CreatedShop(uint _shopID);
    event EditedShop(uint _shopID);

    /// inventory mgmt
    event AddedItemToShop(uint _sku);
    event EditedItem(uint _sku);
    event SoldItem(uint _sku);
    event ShippedItem(uint _sku);
    event ReceivedItem(uint _sku);

    /**
     * modifiers
     */
    /// circuit breaker pattern run-only-when-not-stopped modifier
    modifier stopInEmergency {
        if (!stopped) {
            _;
        } else {
            revert("Operation failed. Circuit is stopped.");
        }
    }

    /// circuit breaker pattern run-only-when-stopped modifier
    modifier runInEmergency {
        if (stopped) {
            _;
        } else {
            revert("Operation failed. Circuit must be stopped before running.");
        }
    }

    /// ownable pattern run only if caller is owner
    modifier isOwner(){
        require(msg.sender == owner, "Operation failed. Caller must be owner.");
        _;
    }

    /// acl pattern run only if caller is admin
    modifier isAdmin() {
        require(Roles.has(admins, msg.sender),"Operation failed. Caller must be admin.");
        _;
    }

    /// acl pattern run only if caller is shopowner
    modifier isShopOwner() {
        require(Roles.has(shopOwners, msg.sender),"Operation failed. Caller must be shop owner.");
        _;
    }

    /// acl pattern run only if caller is admin-or-shopowner
    modifier isAdminOrOwner(address _owner) {
        require(Roles.has(admins, msg.sender) || (_owner == msg.sender), "caller must be admin or owner.");
        _;
    }

    /// authorization pattern run only if address belongs to sender
    modifier verifyCaller(address _address) {
        require (msg.sender == _address, "address must belong to sender.");
        _;
    }

    /// ensures payment covers price
    modifier paidEnough(uint _price) {
        require(msg.value >= _price, "value must be greater than or equal to price.");
        _;
    }

    /// make change if overpaid
    modifier checkValue(uint _sku) {
        //refund change
        _;
        uint _price = items[_sku].price;
        uint amountToRefund = msg.value - _price;
        items[_sku].buyer.transfer(amountToRefund);
    }

    /// state machine pattern run only if state is ForSale
    modifier forSale(uint _sku) {
        require(items[_sku].state == State.ForSale, "item must be for sale.");
        _;
    }

    /// state machine pattern run only if state is Sold
    modifier sold(uint _sku) {
        require(items[_sku].state == State.Sold, "item must be already sold.");
        _;
    }

    /// state machine pattern run only if state is Shipped
    modifier shipped(uint _sku) {
        require(items[_sku].state == State.Shipped,"item must have been shipped.");
        _;
    }

    /**
    @notice Contract constructor
    @dev Assign owner, create & initialize acl admin role
    */
    constructor() public {
        owner = msg.sender;
        Roles.add(admins, msg.sender);
        adminAccts.push(owner);
    }

    /**
     * functions
    */
    /**

    @notice BIG RED BUTTON! Mortal lifecycle pattern
    @dev Clears all storage data on evm & pay out to owner
    @dev Only owner can run it when circuit breaker is engaged
    */
    function destroy() public isOwner runInEmergency {
        selfdestruct(owner);
    }

    /**
    @notice BIG Red BUTTON! Mortal lifecycle pattern
    @param _recipient address for payout recipient
    @dev Clears all storage data on evm and pay out to _recipient
    @dev Only owner can run it when circuit breaker is engaged
    */
    function destroyAndSend(address payable _recipient) public isOwner runInEmergency {
        selfdestruct(_recipient);
    }

    /// Setters

    /**
    @notice Toggles circuit breaker security pattern on & off
    @dev set to true in emergency, false for normal operation
    */
    function toggleCircuitBreaker() public isAdmin {
        stopped = !stopped;

        emit ToggledCircuit(stopped);
    }

    /**
    @notice Add a new admin acct
    @param _newAdmin address for the new admin
    @dev Only admins should be able to add more admins
    */
    function addAdmin(address _newAdmin) public isAdmin stopInEmergency {
        Roles.add(admins, _newAdmin);
        adminAccts.push(_newAdmin);

        emit AddedAdmin(_newAdmin);
    }

    /**
    @notice Remove an admin's permissions and account from admin list
    @dev Only admins can remove an admin's permissions
    */
    function removeAdmin(uint _index) public isAdmin {
        require(adminAccts[_index] != owner, "Can't remove admin perms from owner.");
        Roles.remove(admins, adminAccts[_index]);

        emit RemovedAdminAccess(adminAccts[_index]);
        delete adminAccts[_index];

        adminAccts = ListUtils.AddressReorderSort(adminAccts, _index);
    }

    /**
    @notice Add a new shopowner account
    @dev Only admins can add a new shopowner account
    @dev This function shoulb be restricted in an emergency
    */
    function addShopOwner(address _shopOwner) public isAdmin stopInEmergency {
        Roles.add(shopOwners, _shopOwner);
        shopOwnerAccts.push(_shopOwner);

        emit AddedShopOwner(_shopOwner);
    }

    /**
    @notice Remove a shopowner's permissions and account
    @dev Only admins can remove shopowner account
    @param _index a uint index to the shopowners account list
    */
    function removeShopOwner(uint _index) public isAdmin{
        Roles.remove(shopOwners, shopOwnerAccts[_index]);

        emit RemovedShopOwnerAccess(shopOwnerAccts[_index]);
        delete shopOwnerAccts[_index];

        shopOwnerAccts = ListUtils.AddressReorderSort(shopOwnerAccts, _index);
    }

    /**
    @notice Create a new shop
    @dev Only shopowners can create a shop
    @param _name a required string name for the shop
    @param _category an optional string name to categorize the shop
    */
    function createShop(string memory _name, string memory _category) public isShopOwner{
        require(bytes(_name).length > 0, "Operation failed. Name cannot be empty.");

        shops.push(Shop({shopOwner:msg.sender, name:_name, category:_category}));
        ownerShopCount[msg.sender]++;

        emit CreatedShop(shops.length-1);
    }

    /**
    @notice Edit a shop's details
    @dev Only the shop's shopowner can edit a shop
    @param _shopID a uint index to look up the shop in the shop list
    @param _name a required string name for the shop
    @param _category an optional string name to categorize the shop
    */
    function editShop(uint _shopID, string memory _name, string memory _category) public {
        require(shops[_shopID].shopOwner == msg.sender, "Operation failed. Must be shopowner to edit shop.");
        require(bytes(_name).length > 0, "name cannot be empty.");

        shops[_shopID].name = _name;
        shops[_shopID].category = _category;

        emit EditedShop(_shopID);
    }

    /**
    @notice Add an item to a shop
    @dev Only the shop's shopowner can add an item to a shop
    @param _shopID a uint index to look up the shop in the shop list
    @param _name a required string name for the item
    @param _price a required price for the item
    */
    function addItemToShop(uint _shopID, string memory _name, uint _price) public {
        require(shops[_shopID].shopOwner == msg.sender, "Operation failed. Must be shop owner to post item to store.");
        require(_shopID >= 0 && bytes(_name).length > 0 && _price > 0, "shopID, name and price cannot be empty.");

        address payable _buyer;
        items.push(Item({shopID:_shopID, name:_name, price:_price, state:State.ForSale, seller:msg.sender, buyer:_buyer}));
        shopItemCount[_shopID]++;

        emit AddedItemToShop(items.length-1);
    }

    /**
    @notice edit an item's details
    @dev Only the shop's shopowner can edit an item's details
    @param _sku a uint index to look up the item in the item list
    @param _shopID a uint index to look up the shop in the shop list
    @param _name a required string name for the item
    @param _price a required price for the item
    */
    function editItem(uint _sku, uint _shopID, string memory _name, uint _price) public forSale(_sku) {
        require(shops[_shopID].shopOwner == msg.sender, "must be shop owner to edit an item's details.");
        require(_shopID >= 0 && bytes(_name).length > 0 && _price > 0, "shopID, name and price cannot be empty.");

        items[_sku].shopID = _shopID;
        items[_sku].name = _name;
        items[_sku].price = _price;

        emit EditedItem(_sku);
    }

    /**
    @notice Buy an item
    @dev Anyone can buy an item, but the item must be ForSale
    @param _sku a uint index to look up the item to buy
    */
    function buyItem(uint _sku) public payable forSale(_sku) checkValue(_sku){
        items[_sku].seller.transfer(items[_sku].price);
        items[_sku].buyer = msg.sender;
        items[_sku].state = State.Sold;

        customerItemCount[msg.sender]++;

        emit SoldItem(_sku);
    }

    /**
    @notice Ship an item
    @dev Only the shop's owner can ship an item, and the item must have been Sold
    @param _sku a uint index to look up the item to ship
    */
    function shipItem(uint _sku) public isShopOwner sold(_sku){
        items[_sku].state = State.Shipped;
        emit ShippedItem(_sku);
    }

    /**
    @notice Receive an item
    @dev Only the item's buyer can receive an item, and the item must have been Shipped
    @param _sku a uint index to look up the item to mark received
    */
    function receiveItem(uint _sku) public shipped(_sku){
        require(items[_sku].buyer == msg.sender, "Only the customer can mark an item as received.");
        items[_sku].state = State.Received;

        emit ReceivedItem(_sku);
    }

    /// Getters
       /**
    * @notice Is the caller the contractowner
    * @return a boolean - true or false
    */
    
    function isTheOwner() public view returns(bool){
        return (msg.sender == owner);
    }
    

    /**
    @notice Check the state of the Circuit Breaker security pattern
    @dev Only admins can check the state of the Circuit Breaker
    @return bool value of the current state of the Circuit Breaker; false =n ormal operation, true = emergency
    */
    function getCircuitState() public view isAdmin returns(bool){
        return stopped;
    }

    /**
    * @notice Is the caller an admin
    * @return a boolean - true or false
    */
    function isAnAdmin() public view returns(bool){
        return Roles.has(admins, msg.sender);
    }

    /**
    @notice List all admins
    @dev Only admins can access the admin list
    @return array of addresses for admin  accounts
    */
    function listAdmins() public view isAdmin returns(address[] memory){
        return adminAccts;
    }

    /**
    * @notice Is the caller a shopOwner
    * @return a boolean - true or false
    */
    function isAShopOwner() public view returns(bool){
        return Roles.has(shopOwners, msg.sender);
    }

    /**
    @notice List all shop owners
    @dev Only admins can access the shopowners list
    @return array of addresses for shopowner accounts
    */
    function listShopOwners() public view isAdmin returns(address[] memory){
        return shopOwnerAccts;
    }

    /**
    @notice List shop id's by shopowner
    @dev Only admins or the shopowner can access the list of shops owned by specific shopowners
    @param _owner - the address of a shop owner
    @return array of uints for shops owned by _owner
    */
    function getShopIDsByOwner(address _owner) public view isAdminOrOwner(_owner) returns (uint[] memory) {
        uint[] memory result = new uint[](ownerShopCount[_owner]);
        uint counter = 0;

        for (uint i = 0; i < shops.length; i++) {
            if (shops[i].shopOwner == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /**
    @notice List item id's by shop
    @dev Only admins and the shop owner can access the full list of items (in all states) in a specific shop
    @return array of uint indexes to item list
    */
    function getItemsByShopID(uint _shopID) public view returns (uint[] memory) {
        require(Roles.has(admins, msg.sender) || (shops[_shopID].shopOwner == msg.sender), "caller must be admin or the shop owner.");
        uint[] memory result = new uint[](shopItemCount[_shopID]);
        uint counter = 0;

        for (uint i = 0; i < items.length; i++) {
            if (items[i].shopID == _shopID) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    /**
    @notice List item id's by buyer
    @dev Only the buyer can access their purchase history
    @return array of uint indexes to items list
    */
    function getCustomerOrders(address _customer) public view verifyCaller(_customer) returns (uint[] memory) {
        uint[] memory result = new uint[](customerItemCount[msg.sender]);
        uint counter = 0;

        for (uint i = 0; i < items.length; i++) {
            if (items[i].buyer == msg.sender) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
