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

                    <h2>1) Add a Shop Owner</h2>

                    <h2>2) Open a Shop</h2>

                    <h2>3) Add Some Products</h2>

                    <h2>4) Tell Your Friends!</h2>
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