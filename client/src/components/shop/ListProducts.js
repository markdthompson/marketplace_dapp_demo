import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

export default class ListProducts extends Component{

    constructor(props){
        super(props);
        this.state = { 
            itemKeys: []
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

        this.setState({itemKeys: items});
    }

    handleShip(sku) {
        console.log(sku);
        this.ship(sku);
    };

    ship(_sku) {
        const sku = parseInt(_sku);

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
    
        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["shipItem"].cacheSend(sku, {
          from: drizzleState.accounts[0]
        });
    
        // save the `stackId` for later reference
        this.setState({ stackId });
        this.setState({txAlert: true});
    };

    handleArchive(sku) {
        console.log(sku);
        this.archive(sku);
    };

    archive(_sku) {
        const sku = parseInt(_sku);

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
    
        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["archiveItem"].cacheSend(sku, {
          from: drizzleState.accounts[0]
        });
    
        // save the `stackId` for later reference
        this.setState({ stackId });
        this.setState({txAlert: true});
    };

    render() {

        const { Marketplace } = this.props.drizzleState.contracts;
        if(this.state.itemKeys === null){
            return (
                <div>
                    Loading...
                </div>
            )
        } else {
            if(!this.state.itemKeys.length){
                return (
                    <div>
                        No item keys!
                    </div>
                )
            } else {

                let items = [];
                this.state.itemKeys.forEach((key, index)=>{
                    let item= Marketplace.items[key];       
                    items.push(item && item.value);
                });
    
                try{
            
                    if(!Boolean(items[items.length-1])){
                        return (
                            <div>Loading...</div>
                        )
                    } else {

                        const itemList = items.map((item, index) =>
                            <tr key={index}>
                                <td>{item.shopID}</td>
                                <td>{item.name}</td>
                                <td>{item.sku}</td>
                                <td>{item.description}</td>
                                <td>
                                    <a href={'https:ipfs.io/ipfs/' + item.ipfsImageHash} rel="noopener norefferrer" target="_blank"  >
                                        {(item.ipfsImageHash !== '') ?
                                            <img 
                                                height="25" 
                                                width="25" 
                                                alt="" 
                                                src={'https:ipfs.io/ipfs/' + item.ipfsImageHash} 
                                            />
                                        : ''}
                                    </a>
                                </td>
                                <td>{item.price}</td>
                                <td>{item.buyer}</td>
                                <td>{item.state}</td>
                                { item.state === '0' ? (
                                        <td><Button disabled>Stocked</Button></td>
                                    ) :
                                        item.state === '1' ? (
                                            <td><Button onClick={this.handleShip.bind(this,item.sku)}>Ship</Button></td>
                                    ) : (
                                        item.state === '2' ? (
                                            <td><Button disabled>Shipped</Button></td>    
                                    ) : (
                                        item.state === '3' ? (
                                            <td><Button onClick={this.handleArchive.bind(this,item.sku)}>Archive</Button></td>
                                    ) : 
                                         <td><Button disabled>Archived</Button></td>
                                    ) 
                                )}
                                
                            </tr>
                        );
            
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
                                        <th>Buyer</th>
                                        <th>State</th>
                                        <th>Action</th>
                                    </tr></thead>
                                    <tbody>{itemList}</tbody>
                                </Table>
                            </div>
                        );
                    }    

                } catch(err){
           
                }
            }
        }
    }
}