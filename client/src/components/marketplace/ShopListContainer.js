import React, { Component } from 'react';
import ShopContainer from "./ShopContainer";

export default class ShopListContainer extends Component{
    constructor(props){
        super(props);

        this.state = { 
            shopCountKey: null,
            itemCountKey: null,
            isShop: null,
            match: null
        };

        //console.log("shopListContainer");
        //console.log(this.props);
    }

    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        const shopCountKey = contract.methods["getShopCount"].cacheCall({from: account});
        this.setState({shopCountKey});
        
        const itemCountKey = contract.methods["getItemCount"].cacheCall({from: account});
        this.setState({itemCountKey});

        if(this.props.match.path === "/shops/:id"){
            this.setState({isShop: true});
        } else {
            this.setState({isShop: false});
        }

        this.setState({match: this.props.match});
    }
    
    render() {
        //console.log(this.state);
        const { Marketplace } = this.props.drizzleState.contracts;
        
        if(this.state.shopCountKey === null || this.state.itemCountKey === null){
            return (
                <div>Loading...</div>
            )
        } else {
            const sc = Marketplace.getShopCount[this.state.shopCountKey];
            const ic = Marketplace.getItemCount[this.state.itemCountKey];

            const shopCount = (sc && sc.value);
            const itemCount = (ic && ic.value);

            if((!Boolean(shopCount)) || (!Boolean(itemCount)) ){
                return(
                    <div>Loading...</div>
                )
            } else {

                return(
                    <ShopContainer 
                        drizzle={this.props.drizzle} 
                        drizzleState={this.props.drizzleState} 
                        shopCount= { shopCount }
                        itemCount={ itemCount }
                        isShop={this.state.isShop} 
                        match={this.state.match}
                    />
                )
            }
        }
    }
}