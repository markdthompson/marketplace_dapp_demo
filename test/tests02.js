var Marketplace = artifacts.require("Marketplace");

contract('Marketplace', (accounts) => {
    // account setup
    let owner = accounts[0];
    let admin = accounts[1];
    let shopOwner = accounts[2];
    let customer = accounts[3];
    let user = accounts[4];

    // 1) test that the admin list contains one admin (the owner) following initial deployment
    it("Admin list count should be one after initial contract deployment.", ()=> {
        let initial_admins = 1;

        Marketplace.deployed()
            .then(mp => {
                return mp.listAdmins.call({from: owner})
            })
            .then(result => {
                assert.equal(result.length, initial_admins);
            })
    })
 
    // 2) test that the owner should be automatically added to the admin list on deploy
    it("Owner should be admin after initial contract deployment.", ()=> {
        Marketplace.deployed()
            .then(mp => {
                return mp.listAdmins.call({from: owner});
            })
            .then(result => {
                assert.equal(result[0], owner);
            })
    })

    // 3) test that an admin can add another admin
    it("Non-admin should not be able to add another admin.", ()=> {
        let expected_admins = 1;

        Marketplace.deployed()
            .then(mp => { 
                mp.addAdmin.call(user, {from: user});
                return mp;
            })
            .then(mp => { 
                return mp.listAdmins.call({from: user});
            })     
            .then(result => {
                assert.equal(result.length, expected_admins, "Admin list length should still be 1.");
            })
    })
    
    // 4) test that an admin can add another admin
    it("Admin should be able to add another admin.", ()=> {
        Marketplace.deployed()
            .then(mp => { 
                mp.addAdmin.call(admin, {from: owner});
                return mp;
            })
            .then(mp => { 
                return mp.listAdmins.call({from: owner});
            })     
            .then(result => {
                assert.equal(result[1], admin);
            })
        })

    // 5) test owner ability to remove an admin's permissions
    it("Owner should be able to remove an admin.", ()=> {
        
        let adminIndex = 1;
        let expectedCount = 1;

        Marketplace.deployed()
            .then(mp => {
                mp.removeAdmin.call(adminIndex, {from: owner});
                return mp;
            })
            .then(mp => {
                return mp.listAdmins.call({from: owner});
            })
            .then(result => {
                assert.equal(result.length, expectedCount);
            })
    })

    // 6) test admin ability to add a shop owner
    it("Admin should be able to add a shop owner.", ()=> {
   
        Marketplace.deployed()
            .then(mp => {
                mp.addShopOwner.call(shopOwner, {from: owner});
                return mp;
            })
            .then(mp => {
                return mp.listShopOwners.call({from: owner});
            })
            .then(result => {
                   assert.equal(result[0], shopOwner);
            })
    })

    // 7) test admin ability to remove a shop owner
    it("Admin should be able to remove a shop owner.", ()=> {


        let shopOwnerID = 0;
        let expectedCount = 0;

        Marketplace.deployed()
            .then(mp => {
                mp.removeShopOwner.call(shopOwnerID, {from: owner});
                return mp;
            })
            .then(mp => {
                return mp.listShopOwners.call({from: owner})
            })
            .then(result => {
                assert.equal(result.length, expectedCount);
            })
    })

    // 8) shop owner should be able to create a shop
    it("Shop owner should be able to create a shop.", ()=> {

        let shopName = "Test Shop";
        let shopCategory = "Test Category";
        let expectedCount = 1;

        Marketplace.deployed()
            .then(mp => {
                mp.addShopOwner.call(shopOwner, {from: owner});
                return mp;
            })
            .then(mp => {
                mp.createShop.call(shopName, shopCategory, {from: shopOwner});
                return mp;
            })
            .then(mp => {
                return mp.getShopIDsByOwner.call(shopOwner, {from: owner})
            })
            .then(result => {
                assert.equal(result.length, expectedCount);
            })
    })

    // 9) shop owner should be able to add items to their shop
    it("Shop owner should be able to add items to their shop.", ()=> {
        let shopID = 0;
        let itemID = 0;
        let itemName = "Lettuce";
        let itemPrice = 3;

        Marketplace.deployed()
            .then(mp => {
                mp.addItemToShop.call(shopID, itemName, itemPrice, {from: shopOwner});
                return mp;
            })
            .then(mp => {
                return mp.items.call(itemID, {from: owner});
            })
            .then(result => {
                assert.equal(result.name, itemName);
            })
    })

    // 10) Customer should be able to order an item
    it("Customer should be able to buy an item", ()=> {
        let itemID = 0;
        let itemPrice = 3;

        Marketplace.deployed()
            .then(mp => {
                mp.buyItem.call(itemID, {from: customer, value: itemPrice});
                return mp;
            })
            .then(mp => {
                return mp.items.call(itemID, {from: customer});
            })
            .then(result => {
                assert.equal(result.buyer, customer);
            })
    })

    // 11) Shop owner should be able to ship an ordered item
    it("Shop owner should be able to ship an ordered item", ()=> {
        let itemID = 0;
        let expectedState = 1;

        Marketplace.deployed()
            .then(mp => {
                mp.shipItem.call(itemID, {from: shopOwner});
                return mp;
            })
            .then(mp => {
                return mp.items.call(itemID, {from: shopOwner});
            })
            .then(result => {
                assert.equal(result.state, expectedState);
            })
    })

    // 12) Customer should be able to mark item as received
    it("Customer should be able to mark item as received", ()=> {
        let itemID = 0;
        let expectedState = 2;

        Marketplace.deployed()
            .then(mp => {
                mp.shipItem.call(itemID, {from: customer});
                return mp;
            })
            .then(mp => {
                return mp.items.call(itemID, {from: customer});
            })
            .then(result => {
                assert.equal(result.state, expectedState);
            })
    })

    // 13) only admins can trigger circuit breaker
    it("Non-admins should NOT be able to trigger circuit breaker.", ()=> {
        
        let expectedState = false;

        Marketplace.deployed()
            .then(mp => {
                mp.toggleCircuitBreaker.call({from: user});
                return mp;
            })
            .then(mp => {
                return mp.getCircuitState.call({from: owner});
            })
            .then(result => {
                assert.equal(result, expectedState, "Non-admins shouldn't be able to trigger the circuit breaker.");
            })
    })

    // 14) admins should be able to trip a circuit breaker in an emergency
    it("Admin should be able to trip the circuit breaker.", ()=> {
        
        let expectedState = true;

        Marketplace.deployed()
            .then(mp => {
                mp.toggleCircuitBreaker.call({from: owner});
                return mp;
            })
            .then(mp => {
                return mp.getCircuitState.call({from: owner});
            })
            .then(result => {
                assert.equal(result, expectedState);
            })
    })
})