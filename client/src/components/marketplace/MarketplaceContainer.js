import React, { Component } from 'react';
import Marketplace from "./Marketplace";

export default class MarketplaceContainer extends Component{

    constructor(props){
        super(props);

        this.shopIDsUpdateCallback = this.shopIDsUpdateCallback.bind(this);
        console.log("MarketplaceContainer");
    }


    shopIDsUpdateCallback(){

        const { Marketplace } = this.props.drizzleState.contracts;
        const count = Marketplace.getShopCount[this.props.shopCountKey];
        const limit = count && count.value;
     
        return (limit);
    }

    render() {

        const count = this.shopIDsUpdateCallback();

        if(count) {

            return (
                <Marketplace drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} shopCount={count} isShop={this.props.isShop} />
            )
        } else {
            // new install onboarding instructions here...
            return (
                <div id="marketplace">
                    <p>No shops!</p>
                </div>
            )
        }
    }
}