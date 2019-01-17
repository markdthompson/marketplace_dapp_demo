import React, { Component } from 'react';
import Marketplace from "./Marketplace";

export default class MarketplaceContainer extends Component{

    constructor(props){
        super(props);

        this.state = {
            itemCount: 0
        }

        console.log("MarketplaceContainer");
        console.log(this.props);
    }

    componentDidMount(){
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        contract.methods.getItemCount().call({from: account}).then((result) =>{
            this.setState({itemCount: result});
        });
    }


    getShopCountHandler(){

        const { Marketplace } = this.props.drizzleState.contracts;
        const count = Marketplace.getShopCount[this.props.shopCountKey];
        const limit = count && count.value;
     
        return (limit);
    }

    getItemCountHandler(){

        const { Marketplace } = this.props.drizzleState.contracts;
        const count = Marketplace.getItemCount[this.props.itemCountKey];
        const limit = count && count.value;
     
        return (limit);
    }

    render() {

        const shopCount = this.getShopCountHandler();
        const itemCount = this.state.itemCount;

        if(shopCount) {
            return (
                <Marketplace 
                    drizzle={this.props.drizzle} 
                    drizzleState={this.props.drizzleState} 
                    shopCount={shopCount} 
                    itemCount={itemCount} 
                    isShop={this.props.isShop} 
                />
            )
        } else {
            // new install onboarding instructions here...
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
        }
    }
}