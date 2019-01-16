import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

export default class ListProducts extends Component{

    constructor(props){
        super(props);
        this.state = { 
            items: []
        };
    }
    
    componentDidMount() {
    
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];
    
        // let drizzle know we want to watch the `get` method
        const items = contract.methods["getItemsBySeller"].cacheCall(account, {from: account});
    
        // save the `dataKey` to local component state for later reference
        this.setState({ items });
    }

    render() {

        // get the contract state from drizzleState
        const { Marketplace } = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const myItems = Marketplace.getItemsBySeller[this.state.items];

        const l = (myItems && myItems.value);
        
        try{
           
            if(l.length !== undefined){

                const itemList = l.map((item, index) =>
                    <tr key={index}><td>{item}</td></tr>
                )
            
                return (
                    <div>
                        <h3>My Products</h3>
                        <Table size="sm" striped>
                            <thead><tr><th>ItemID</th></tr></thead>
                            <tbody>{itemList}</tbody>
                        </Table>
                    </div>
                )
            }    

        } catch(err){
           
        }
    
        return(
            <div><p>No products.</p></div>
        );
    }
}