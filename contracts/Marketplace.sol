/// document with natspec:
/// https://github.com/ethereum/wiki/wiki/Ethereum-Natural-Specification-Format

pragma solidity ^0.4.24;

/**
 * Using OpenZeppelin library for Roles & ACL
 * $ npm init -y
 * $ npm install --save-exact openzeppelin-solidity
 */

// import "../node_modules/openzeppelin-soliditycontracts/access/Roles.sol";
import "github.com/OpenZeppelin/zeppelin-solidity/contracts/access/Roles.sol";

// import "../contracts/AccountListLib.sol";
import "github.com/markdthompson/AccountListLib/AccountListLib.sol";

contract Marketplace{
    using Roles for Roles.Role;

    /**
     * storage variables
     */
    // marketplace owner
    address private owner;

    // circuit breaker
    bool private stopped = false;

    // acl roles
    Roles.Role private admins;
    Roles.Role private shopOwners;

    // account lists
    address[] private adminAccts;
    address[] private shopOwnerAccts;

    // shop data structures
    struct Shop {
        address shopOwner;
        string name;
        string category;
    }
    Shop[] public shops;
    mapping(address => uint) private ownerShopCount;

        // item data structures
    enum State {
      ForSale,
      Sold,
      Shipped,
      Received
    }

    struct Item {
        uint shopID;
        string name;
        uint price;
        State state;
        address seller;
        address buyer;
    }
    Item[] public items;
    mapping(uint => uint) private shopItemCount;
    mapping(address => uint) private customerItemCount;

    /**
     * events
     */
    // lifecycle
    event ToggledCircuit(bool _stopped);

    // acl
    event AddedAdmin(address _newAdmin);
    event RemovedAdminAccess(address addr);
    event AddedShopOwner(address _shopOwner);
    event RemovedShopOwnerAccess(address addr);

    // shop
    event CreatedShop(uint _shopID);
    event EditedShop(uint _shopID);

    // inventory
    event AddedItemToShop(uint _sku);
    event EditedItem(uint _sku);
    event SoldItem(uint _sku);
    event ShippedItem(uint _sku);
    event ReceivedItem(uint _sku);

    /**
     * modifiers
     */
    modifier stopInEmergency {
        if (!stopped) {
        _;
        } else {
            revert("Operation failed. Circuit is stopped.");
        }
    }

    modifier runInEmergency {
        if (stopped) {
            _;
        } else {
            revert("Operation failed. Circuit must be stopped before running.");
        }
    }

    modifier isOwner(){
        require(msg.sender == owner, "Operation failed. Caller must be owner.");
        _;
    }

    modifier isAdmin() {
        require(Roles.has(admins, msg.sender),"Operation failed. Caller must be admin.");
        _;
    }

    modifier isShopOwner() {
        require(Roles.has(shopOwners, msg.sender),"Operation failed. Caller must be shop owner.");
        _;
    }

    modifier isAdminOrOwner(address _owner) {
        require(Roles.has(admins, msg.sender) || (_owner == msg.sender), "caller must be admin or owner.");
        _;
    }

    modifier verifyCaller(address _address) {
        require (msg.sender == _address, "caller must be sender.");
        _;
    }

    modifier paidEnough(uint _price) {
        require(msg.value >= _price, "value must be greater than or equal to price.");
        _;
    }

    modifier checkValue(uint _sku) {
        //refund change
        _;
        uint _price = items[_sku].price;
        uint amountToRefund = msg.value - _price;
        items[_sku].buyer.transfer(amountToRefund);
    }

    modifier forSale(uint _sku) {
        require(items[_sku].state == State.ForSale, "item must be for sale.");
        _;
    }

    modifier sold(uint _sku) {
        require(items[_sku].state == State.Sold, "item must be already sold.");
        _;
    }

    modifier shipped(uint _sku) {
        require(items[_sku].state == State.Shipped,"item must have been shipped.");
        _;
    }

    /**
     * constructor
     */

    constructor() public {
        owner = msg.sender;
        Roles.add(admins, msg.sender);
        adminAccts.push(owner);
    }

    /**
     * functions
     */
    // BIG RED BUTTONS
    // clear all storage data on evm & pay out to owner;
    function destroy() public isOwner runInEmergency {
        selfdestruct(owner);
    }

    // clear all storage data on evm and pay out to _recipient
    function destroyAndSend(address _recipient) public isOwner runInEmergency {
        selfdestruct(_recipient);
    }

    // setters
    function toggleCircuitBreaker() public isAdmin {
        stopped = !stopped;

        emit ToggledCircuit(stopped);
    }

    // add a new admin acct
    function addAdmin(address _newAdmin) public isAdmin stopInEmergency {
        Roles.add(admins, _newAdmin);
        adminAccts.push(_newAdmin);

        emit AddedAdmin(_newAdmin);
    }

    // remove an admin's permissions and account
    function removeAdmin(uint _index) public isOwner {
        require(adminAccts[_index] != owner, "Can't remove admin perms from owner.");
        Roles.remove(admins, adminAccts[_index]);

        emit RemovedAdminAccess(adminAccts[_index]);
        delete adminAccts[_index];

        adminAccts = AccountList.ReorderSort(adminAccts, _index);
    }

    // add a new shop owner account
    function addShopOwner(address _shopOwner) public isAdmin stopInEmergency {
        Roles.add(shopOwners, _shopOwner);
        shopOwnerAccts.push(_shopOwner);

        emit AddedShopOwner(_shopOwner);
    }

    // remove a shop owner's permissions and account
    function removeShopOwner(uint _index) public isAdmin{
        Roles.remove(shopOwners, shopOwnerAccts[_index]);

        emit RemovedShopOwnerAccess(shopOwnerAccts[_index]);
        delete shopOwnerAccts[_index];

        shopOwnerAccts = AccountList.ReorderSort(shopOwnerAccts, _index);
    }

    function createShop(string memory _name, string memory _category) public isShopOwner{
        require(bytes(_name).length > 0, "Operation failed. Name cannot be empty.");

        shops.push(Shop({shopOwner:msg.sender, name:_name, category:_category}));
        ownerShopCount[msg.sender]++;

        emit CreatedShop(shops.length-1);
    }

    function editShop(uint _shopID, string memory _name, string memory _category) public {
        require(shops[_shopID].shopOwner == msg.sender, "Operation failed. Must be shop owner to edit shop.");
        require(bytes(_name).length > 0, "name cannot be empty.");

        shops[_shopID].name = _name;
        shops[_shopID].category = _category;

        emit EditedShop(_shopID);
    }

    function addItemToShop(uint _shopID, string memory _name, uint _price) public {
        require(shops[_shopID].shopOwner == msg.sender, "Operation failed. Must be shop owner to post item to store.");
        require(_shopID >= 0 && bytes(_name).length > 0 && _price > 0, "shopID, name and price cannot be empty.");

        items.push(Item({shopID:_shopID, name:_name, price:_price, state:State.ForSale, seller:msg.sender, buyer:0x00}));
        shopItemCount[_shopID]++;

        emit AddedItemToShop(items.length-1);
    }

    function editItem(uint _sku, uint _shopID, string memory _name, uint _price) public forSale(_sku) {
        require(shops[_shopID].shopOwner == msg.sender, "must be shop owner to post item to store.");
        require(_shopID >= 0 && bytes(_name).length > 0 && _price > 0, "shopID, name and price cannot be empty.");

        items[_sku].shopID = _shopID;
        items[_sku].name = _name;
        items[_sku].price = _price;

        emit EditedItem(_sku);
    }

    function buyItem(uint _sku) public payable forSale(_sku) {
        items[_sku].seller.transfer(items[_sku].price);
        items[_sku].buyer = msg.sender;
        items[_sku].state = State.Sold;

        customerItemCount[msg.sender]++;

        emit SoldItem(_sku);
    }

    function shipItem(uint _sku) public isShopOwner sold(_sku){
        items[_sku].state = State.Shipped;
        emit ShippedItem(_sku);
    }

    function receiveItem(uint _sku) public shipped(_sku){
        items[_sku].state = State.Received;

        emit ReceivedItem(_sku);
    }

    // getters

    // is the circuit closed (false) or open (true)
    function getCircuitState() public view isAdmin returns(bool){
        return stopped;
    }

    // list all admins -- order is important, index is used for removing permissions
    function listAdmins() public view isAdmin returns(address[]){
        return adminAccts;
    }

    // list all shop owners -- order is important, index is used for removing permissions
    function listShopOwners() public view isAdmin returns(address[]){
        return shopOwnerAccts;
    }

    // list shop id's by shop owner
    function getShopIDsByOwner(address _owner) public view isAdminOrOwner(_owner) returns (uint[]) {
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

    function getItemsByShopID(uint _shopID) public view returns (uint[]) {
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

    function getCustomerOrders(address _addr) public view verifyCaller(_addr) returns (uint[]) {
        uint[] memory result = new uint[](customerItemCount[_addr]);
        uint counter = 0;

        for (uint i = 0; i < items.length; i++) {
            if (items[i].buyer == _addr) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
}
