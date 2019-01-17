import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import AddProduct from "./AddProduct";

export default class ManageProducts extends Component{
    constructor(props){
        super(props);
        this.state = { 
            itemIDs: null
        };
    }

    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        this.setState({ itemIDs: contract.methods["getItemsBySeller"].cacheCall(account, {from: account})});
    }
    
    render() {

        return(  
             <AddProduct drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} itemIDs={this.state.itemIDs}/>     
        )
    }
}
 