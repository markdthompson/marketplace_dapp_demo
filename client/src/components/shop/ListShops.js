import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

export default class ListShops extends Component{

    constructor(props){
        super(props);
        this.state = { shopIDs: null };
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

        console.log(l);
        /*
        try{
           
            if(l.length !== undefined){

                const adminList = l.map((admin, index) =>
                    <tr key={index}><td>{admin}</td><td>
                        {
                           (index < 1) ? <Button type="button" disabled>Owner</Button>
                                        : <Button type="button" onClick={this.removeAdmin.bind(this, index)}>Remove</Button>
                        }   
                    </td></tr>
                )
            
                return (
                    <div>
                        <h3>Admin Accounts</h3>
                        <Table size="sm" striped>
                            <thead><tr><th>Account Address</th><th>Action</th></tr></thead>
                            <tbody>{adminList}</tbody>
                        </Table>
                    </div>
                )
            }    

        } catch(err){
           
        }
        */

        return(
            <div><p>No shops.</p></div>
        );
    }
}