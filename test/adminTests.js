var Marketplace = artifacts.require("Marketplace");

contract('Marketplace', (accounts) => {
    // account setup
    const owner = accounts[0];
    console.log('owner: ' + owner);
    const admin = accounts[1];
    console.log('admin: ' + admin);
    const shopOwner = accounts[2];
    console.log('shopOwner: ' + shopOwner);
    const user= accounts[3];
    console.log('user: ' + user);

    // 1) test that the admin list contains one admin (the owner) following initial deployment
    it("Admin list count should be one after initial contract deployment.", async ()=> {
        const initialAdminCount = 1;
        let result;

        mp = await Marketplace.deployed();

        result = await mp.listAdmins.call({from: owner})
        assert.equal(result.length, initialAdminCount);
    })
 
    // 2) test that the owner should be automatically added to the admin list on deploy
    it("Owner should be admin on contract deployment", async ()=> {
        let result;

        mp = await Marketplace.deployed();

        result = await mp.listAdmins.call({from: owner})
        assert.equal(result[0], owner);
    })

    // 4) test that a non-admin can NOT add another admin
    it("Non-admin should not be able to add another admin.", async () => {
        const expectedErr = 'Error: Returned error: VM Exception while processing transaction: revert Operation failed. Caller must be admin.';
        
        mp = await Marketplace.deployed();

        try {
            // this should fail since user is not an admin!
            await mp.addAdmin.call(user, {from: user});
        } catch(err){
            assert.equal(err, expectedErr);
        }
    });


    // 3) test that an admin can add another admin
    it("Admin should be able to add another admin.", ()=> {
        
        Marketplace.new()
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
        let intermediateCount = 2
        let expectedCount = 1;

        Marketplace.new()
            .then(mp => { 
                mp.addAdmin.call(admin, {from: owner});
                return mp;
            })
            .then(mp => {
                return mp.listAdmins.call({from: owner});
            })
            .then(result => {
                assert.equal(result.length, intermediateCount);
            })
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
   
        Marketplace.new()
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

        const shopOwnerID = 0;
        const expectedCount = 0;

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

    // 13) only admins can trigger circuit breaker
    it("Non-admins should NOT be able to trigger circuit breaker.", ()=> {
        
        let expectedState = false;

        Marketplace.new()
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

        Marketplace.new()
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
});