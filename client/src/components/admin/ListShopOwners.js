import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

class ListShopOwners extends Component{

    constructor(props){
        super(props);
        this.state = { shopowners: null };

        this.removeAdmin = this.removeAdmin.bind(this);
    }
    
    componentDidMount() {
    
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];
    
        // let drizzle know we want to watch the `get` method
        const shopowners = contract.methods["listShopOwners"].cacheCall({from: account});
    
        // save the `dataKey` to local component state for later reference
        this.setState({ shopowners });
    }

    removeAdmin(index) {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
    
        contract.methods["removeShopOwner"].cacheSend(index, {
          from: drizzleState.accounts[0]
        });
    
    }

    render() {

        // get the contract state from drizzleState
        const { Marketplace } = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const shopownrs = Marketplace.listShopOwners[this.state.shopowners];

        const l = (shopownrs && shopownrs.value);
        try{
           
            if(l.length !== undefined){

                const ownerList = l.map((owner, index) =>
                    <tr key={index}><td>{owner}</td><td>
                        <Button type="button" onClick={this.removeAdmin.bind(this, index)}>Remove</Button>
                    </td></tr>
                )
            
                return (
                    <div>
                        <h3>Shop Owner Accounts</h3>
                        <Table size="sm" striped>
                            <thead><tr><th>Account Address</th><th>Action</th></tr></thead>
                            <tbody>{ownerList}</tbody>
                        </Table>
                    </div>
                )
            }    

        } catch(err){
           
        }

        return(
            <div><p>No Shop Owners.</p></div>
        );
    }
}

export default ListShopOwners;