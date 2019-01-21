var Marketplace = artifacts.require("Marketplace");

contract('Marketplace', (accounts) => {
    // account setup
    const owner = accounts[0];
    console.log('owner: ' + owner);
    const shopOwner = accounts[2];
    console.log('shopOwner: ' + shopOwner);
    const user= accounts[3];
    console.log('user: ' + user);


    it("Shop owner should be able to create a shop.", ()=> {

        const shopName = "Test Shop";
        const shopCategory = "Test Category";

        Marketplace.new()
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
                assert.equal(result[0].name, shopName);
            })
    })


    it("Shop owner should be able to add items to their shop.", ()=> {
        const shopName = "Test Shop";
        const shopCategory = "Test Category";
        const shopID = 0;
        
        const itemName = "Test Item";
        const itemDesc = "A test product";
        const imgHash = '';
        const itemPrice = 3000000;

        expectedLength = 1;

        Marketplace.new()
            .then(mp => {
                mp.addShopOwner.call(shopOwner, {from: owner});
                return mp;
            })
            .then(mp => {
                mp.createShop.call(shopName, shopCategory, {from: shopOwner});
                return mp;
            })
            .then(mp => {
                mp.addItemToShop.call(shopID, itemName, itemDesc, imgHash, itemPrice, {from: shopOwner});
                return mp;
            })
            .then(mp => {
                mp.getItemsByShopID.call(shopID, {from: shopOwner});
                return mp;
            })
            .then(result => {
                assert.equal(result.length, expectedLength);
            })
    })


    it("Customer should be able to buy an item", ()=> {
        
        const itemID = 0;
        const itemPrice = 3000000;

        Marketplace.deployed()
            .then(mp => {
                mp.buyItem.call(itemID, {from: user, value: itemPrice});
                return mp;
            })
            .then(mp => {
                return mp.items.call(itemID, {from: user});
            })
            .then(result => {
                assert.equal(result.buyer, user);
            })
    })

    it("ShopOwner should be able to mark item shipped ", ()=> {
        
        const itemID = 0;
        const itemState = 2;

        Marketplace.deployed()
            .then(mp => {
                mp.shipItem.call(itemID, {from: shopOwner});
                return mp;
            })
            .then(mp => {
                return mp.items.call(itemID, {from: user});
            })
            .then(result => {
                assert.equal(result.state, itemState);
            })
    })

    it("Customer should be able to mark item received", ()=> {
        
        constitemID = 0;
        const itemState = 3;

        Marketplace.deployed()
            .then(mp => {
                mp.receiveItem.call(itemID, {from: user});
                return mp;
            })
            .then(mp => {
                return mp.items.call(itemID, {from: user});
            })
            .then(result => {
                assert.equal(result.state, itemState);
            })
    })

})