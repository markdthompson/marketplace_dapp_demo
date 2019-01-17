import React, { Component } from 'react';
import MarketplaceContainer from "./MarketplaceContainer";

export default class ShopListContainer extends Component{
    constructor(props){
        super(props);

        this.state = { 
            shopCountKey: null,
            itemCountKey: null,
            isShop: false
        };

        console.log("shopListContainer");
    }

    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        this.setState((prevState)=> {
            prevState.shopCountKey = contract.methods["getShopCount"].cacheCall({from: account});
            prevState.itemCountKey = contract.methods["getItemCount"].cacheCall({from: account});
        });

        if(this.props.match.path === "/shops/:id"){
            this.setState({isShop: true});
        } else {
            this.setState({isShop: false});
        }
    }
    
    render() {
        return(
            <MarketplaceContainer 
                drizzle={this.props.drizzle} 
                drizzleState={this.props.drizzleState} 
                shopCountKey={this.state.shopCountKey} 
                itemCountKey={this.state.itemCountKey}
                isShop={this.state.isShop} 
            />
        )
    }
}
 