var Marketplace = artifacts.require("Marketplace");

contract('Marketplace', async (accounts) => {

    let mp;

    beforeEach("Set up a new contract for each test.", async () => {
        mp = await Marketplace.deployed(); //.new();
    });

    // 1.
    it("Admin list count should be one after initial contract deployment.", async () => {
        let owner = accounts[0];
        let initialAdmins = 1;

        let result = await mp.listAdmins.call({from: owner});

        assert.equal(result.length, initialAdmins);
    });

    // 2.
    it("Owner should be admin after initial contract deployment.", async () => {
        let owner = accounts[0];

        let result = await mp.listAdmins.call({from: owner});

        assert.equal(result[0], owner);
    });

    // 3.
    it("Non-admin should not be able to add another admin.", async () => {
        let user = accounts[1];
        let expectedErr = 'Error: Returned error: VM Exception while processing transaction: revert Operation failed. Caller must be admin.';
        
        try {
            // this should fail since user is not an admin!
            await mp.addAdmin.call(user, {from: user});
        } catch(err){
            assert.equal(err, expectedErr);
        }
    });

    // 4.
    it("Admin should be able to add another admin.", async ()=> {
        let owner = accounts[0];
        let admin = accounts[1];
        let result;
        let r1;

        try {
            r1 = await mp.addAdmin.call(admin, {from: owner});
        } catch (err){
            assert.fail(err);
        }

        assert.equal(r1, true);
         
    });
});
