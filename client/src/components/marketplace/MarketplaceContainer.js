import React, { Component } from 'react';
import ViewMarketplace from "./ViewMarketplace";

export default class MarketplaceContainer extends Component{

    constructor(props){
        super(props);

        this.state = {
            itemKeys: null,
            shopKeys: null
        }

        //console.log("MarketplaceContainer");
        //console.log(this.props);
    }

    componentDidMount(){
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];
        
        // shops
        const shopKeys = [];
        for( let i = 0; i<this.props.shopCount; i++){
            shopKeys.push(contract.methods['shops'].cacheCall(i,{from: account}));
        }
        this.setState({shopKeys});

        const itemKeys = [];
        for( let i = 0; i<this.props.itemCount; i++){
            itemKeys.push(contract.methods['items'].cacheCall(i,{from: account}));
        }
        this.setState({itemKeys});
    }

    render() {
        const { Marketplace } = this.props.drizzleState.contracts;

        if(this.state.shopKeys === null || this.state.itemKeys === null){
            //console.log('loading..');
            return (
                <div>Loading...</div>
            );

        } else {
            if(!this.state.shopKeys.length){
                return (
                    <div id="marketplace">
                    <h1>Welcome</h1>
                    <p>Welcome to the Marketplace Demo Dapp! To get started, follow these steps:</p>

                    <h2>I. Add a Shop Owner</h2>
                    <ol>
                        <li>Make sure you're logged into MetaMask as Account 1</li>
                        <li>Click the 'Admin' link to the top left of the header</li>
                        <li>Look to the bottom of the Admin page for the 'Add ShopOwner' section</li>
                        <li>In MetaMask, copy another account address, and then paste it into the 'Enter Account Address' field</li>
                        <li>Click the 'Add' Button</li>
                        <li>MetaMask will prompt you to confirm the transaction, confirm it</li>
                    </ol>

                    <h2>II. Open a Shop</h2>
                    <ol>
                        <li>In MetaMask, switch to the account you added to the ShopOwners list in step I</li>
                        <li>Reload the app to load the new account by clicking on the 'Marketplace Dapp Demo' link in the header</li>
                        <li>Check the Active External Account field in the header to make sure you're logged in with the ShopOwner account</li>
                        <li>Click the 'Manage Shops' link to the top left of the header</li>
                        <li>In the middle of the Manage Shops page find the 'Open Shop' section</li>
                        <li>Type in your shop name and category and click 'Create'</li>
                        <li>MetaMask will prompt you to confirm the transaction, confirm it</li>
                        <li>Click the 'Marketplace' link in the header to check if your shop is now listed</li>
                    </ol>
                    <h2>III. Add Some Products</h2>
                    <ol>
                        <li>While still logged in as ShopOwner, click again on the 'Manage Shops' link in the header</li>
                        <li>Toward the bottom of the Manage Shops page find the 'Add New Product' section</li>
                        <li>Type in the shop id, name, description, price and choose an image to upload - click 'Create'</li>
                        <li>MetaMask will prompt you to confirm the transaction, confirm it</li>
                        <li>Click the 'Marketplace' link in the header and click into your shop</li>
                        <li>Your product should now be listed</li>
                    </ol>

                    <h2>IV. Tell Your Friends!</h2>
                                    
                    </div>
                )
            } else {

                const items = [];
                const shops = [];
            
                this.state.itemKeys.forEach((key)=>{
                    let item = Marketplace.items[key]; 
                    //console.log(item && item.value);      
                    items.push(item && item.value);
                });
        
                this.state.shopKeys.forEach((key)=>{
                    let shop = Marketplace.shops[key];
                    //console.log(shop && shop.value);       
                    shops.push(shop && shop.value);
                });
        
                try {
        
                    if(!Boolean(shops[shops.length-1]) || !Boolean(shops[shops.length-1])){
                        return (
                            <div>Loading...</div>
                        )
                    } else {
                        return (
                            <ViewMarketplace 
                                drizzle={this.props.drizzle} 
                                drizzleState={this.props.drizzleState} 
                                shops={shops}
                                items={items}
                            />
                        )
                    }
        
                } catch(err){
                    console.log(err);
                }
            }
        }
    }
}