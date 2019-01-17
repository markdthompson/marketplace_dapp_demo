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

        let items = [];
        
        this.props.ids.value.forEach((itemID)=>{
            items.push(contract.methods["items"].cacheCall(itemID, {from: account}));
        }); 

        this.setState({items});
    }

    componentWillReceiveProps(props){
        const {ids} = this.props;
        if(props.ids !== ids){
            const { drizzle, drizzleState } = this.props;
            const contract = drizzle.contracts.Marketplace;
            const account = drizzleState.accounts[0];

            let itemID = this.state.items.length;
            this.state.items.push(contract.methods["items"].cacheCall(itemID, {from: account}));
        }
     
    }

    render() {

        const { Marketplace } = this.props.drizzleState.contracts;

        let items = [];
        this.state.items.forEach((key, index)=>{
            let item= Marketplace.items[key];       
            items.push(item && item.value);
        });
    
        try{
            
            if(items.length >0 ){

                const itemList = items.map((item, index) =>
                    <tr key={index}>
                        <td>{item.shopID}</td>
                        <td>{item.name}</td>
                        <td></td>
                        <td>{item.description}</td>
                        <td>
                            <a href={'https:ipfs.io/ipfs/' + item.ipfsImageHash} target="_blank" >
                            {
                                (item.ipfsImageHash !== '') ?
                                    <img height="25" width="25" src={'https:ipfs.io/ipfs/' + item.ipfsImageHash} />
                                : ''
                            }
                            </a>
                        </td>
                        <td>{item.price}</td>
                        <td>{item.state}</td>
                        <td>{item.buyer}</td>
                    </tr>
                )
            
                return (
                    <div>
                        <h3>My Products</h3>
                        <Table size="sm" striped responsive>
                            <thead><tr>
                                <th>ShopID</th>
                                <th>Name</th>
                                <th>SKU</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Price</th>
                                <th>State</th>
                                <th>Buyer</th>
                            </tr></thead>
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