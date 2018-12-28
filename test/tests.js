var Marketplace = artifacts.require("Marketplace");

contract('Marketplace', (accounts)=> {
    // account setup
    let owner = accounts[0];
    let admin1 = accounts[1];
    let admin2 = accounts[2];
    let shopOwner = accounts[3];
    let user = accounts[4];

    // test that the admin list contains one admin (the owner) following initial deployment
    it("Admin list count should be one after initial contract deployment.", ()=> 
    Marketplace.deployed()
        .then(mp => mp.listAdmins.call({from: owner}))
        .then(result => {
            //console.log("\nInitial adminList[] count: " + result.length);
            
            let initial_admins = 1;

            assert.equal(result.length, initial_admins);
        })
    )
    
    // test that the owner should be automatically added to the admin list on deploy
    it("Owner should be admin after initial contract deployment.", ()=> 
        Marketplace.deployed()
            .then(mp => mp.listAdmins.call({from: owner}))
            .then(result => {
                //console.log("\n" + "Owner address: " + owner);
                //console.log("1st admin account: " + result[0]);
                assert.equal(result[0], owner);
            })
    )
    
    // test that an admin can add another admin
    it("Admin should be able to add another admin.", ()=> 
        Marketplace.deployed()
            .then(mp => mp.addAdmin.call(admin1, {from: owner}))
         
            .then(Marketplace.deployed()
                .then(mp => mp.listAdmins.call({from: admin1}))
                .then(result => {
                    assert.equal(result[1], admin1);
                })
            )
    )
    
    // test owner ability to remove an admin's permissions
    it("Owner should be able to remove an admin.", ()=> 

        Marketplace.deployed()
            .then(mp => {
                mp.removeAdmin.call(1, {from: owner})
            })

            .then(Marketplace.deployed()
                .then(mp => mp.listAdmins.call({from: owner}))
                .then(result => {
                    assert.equal(result.length, 1);
                })
            )
    )

    // test admin ability to add a shop owner
    it("Admin should be able to add a shop owner.", ()=> 
        
        Marketplace.deployed()
            .then(mp => {
                mp.addAdmin.call(admin2, {from: owner})
        })

        .then(Marketplace.deployed()
                .then(mp => {
                    mp.addShopOwner.call(shopOwner, {from: admin2})
                })

                .then(Marketplace.deployed()
                    .then(mp => mp.listShopOwners.call({from: admin2}))
                    .then(result => {
                        assert.equal(result[0], shopOwner);
                    })
                )
        )
    )

    // test admin ability to remove a shop owner
    it("Admin should be able to remove a shop owner.", ()=> 

    Marketplace.deployed()
        .then(mp => {
            mp.removeShopOwner.call(0, {from: admin2})
        })

        .then(Marketplace.deployed()
            .then(mp => mp.listShopOwners.call({from: admin2}))
            .then(result => {
                assert.equal(result.length, 0);
            })
        )
    )

    // shop owner should be able to create a shop

    // shop owner should be able to add items to their shop

    // user should be able to buy an item from a shop

    // shop owner should be able to ship an ordered item

    // user should be able to mark item received

    // admins should be able to trip a circuit breaker in an emergency
    it("Admin should be able to trip the circuit breaker.", ()=> 

        Marketplace.deployed()
            .then(mp => {
                mp.toggleCircuitBreaker.call({from: admin2})
            })

            .then(Marketplace.deployed()
                .then(mp => mp.getCircuitState.call({from: admin2}))
                .then(result => {
                    assert.equal(result.length, true);
                })
            )
    )

})