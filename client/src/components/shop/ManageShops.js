import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import AddShop from "./AddShop";

export default class ManageShops extends Component{
    constructor(props){
        super(props);

        this.state = { 
            shopIds: null
        };
    }

    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        this.setState({ shopIDs: contract.methods["getShopIDsByOwner"].cacheCall(account, {from: account})});
    }
    
    render() {
        return(
            <AddShop drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} shopIDs={this.state.shopIDs} />
        )
    }
}
 