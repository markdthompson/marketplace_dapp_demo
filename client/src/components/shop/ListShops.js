import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

export default class ListShops extends Component{

    constructor(props){
        super(props);
        this.state = { shopIDs: null, shops: [] };
    }
    
    componentDidMount() {
    
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];
    
        // let drizzle know we want to watch the `get` method
        const shopIDs = contract.methods["getShopIDsByOwner"].cacheCall(account, {from: account});
    
        // save the `dataKey` to local component state for later reference
        this.setState({ shopIDs });
    }

    render() {

        // get the contract state from drizzleState
        const { Marketplace } = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const myIDs = Marketplace.getShopIDsByOwner[this.state.shopIDs];

        const l = (myIDs && myIDs.value);
        
        try{
            
            if(l.length !== undefined){

                l.forEach((shop, index)=>{
                    //console.log(shop);

                })

                const shopList = l.map((shop, index) =>
                    <tr key={index}><td>{shop}</td></tr>
                )
            
                return (
                    <div>
                        <h3>My Shops</h3>
                        <Table size="sm" striped>
                            <thead><tr><th>ShopID</th></tr></thead>
                            <tbody>{shopList}</tbody>
                        </Table>
                    </div>
                )
            }    

        } catch(err){
           //console.log(err);
        }
    
        return(
            <div><p>No shops.</p></div>
        );
    }
}