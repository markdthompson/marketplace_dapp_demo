import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';

export default class ListShops extends Component{

    constructor(props){

        super(props);

        this.state = { 
            shops: [],
         };
    }
    
    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        let shops = [];
        
        this.props.ids.value.forEach((shopID)=>{
            shops.push(contract.methods["shops"].cacheCall(shopID, {from: account}));
        }); 

        this.setState({shops});
    }

    handleWithdrawal(_shopID){
        this.setValue(_shopID);
    }

    setValue(_shopID) {
        const shopID = parseInt(_shopID);

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
    
        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["withdrawFunds"].cacheSend(shopID, {
          from: drizzleState.accounts[0]
        });
    
        // save the `stackId` for later reference
        this.setState({ stackId });
        this.setState({txAlert: true});
    };

    render() {
        
        const { Marketplace } = this.props.drizzleState.contracts;

        let shops = [];
        this.state.shops.forEach((key, index)=>{
            let shop = Marketplace.shops[key];       
            shops.push(shop && shop.value);
        });
    
        try{
            
            if(shops.length >0 ){

                const shopList = shops.map((shop, index) =>
                    <tr key={index}>
                        <td>{shop.shopID}</td>
                        <td>{shop.name}</td>
                        <td>{shop.category}</td>
                        <td>{this.props.drizzle.web3.utils.fromWei(shop.balance, 'finney')} </td>
                        {shop.balance === '0' ? (
                            <td><Button disabled>Withdraw Balance</Button></td>
                        ) : (
                            <td><Button onClick={this.handleWithdrawal.bind(this, index)}>Withdraw Balance</Button></td>
                        )}
                        
                    </tr>
                )
            
                return (
                    <div>
                        <h3>My Shops</h3>
                        <Table size="sm" striped>
                            <thead><tr>
                                <th>ShopID</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Balance (finney)</th>
                                <th>Action</th>
                            </tr></thead>
                            <tbody>{shopList}</tbody>
                        </Table>
                    </div>
                )
            }    

        } catch(err){
           //console.log(err);
        }
    
        return(
            <div><p>You haven't opened any shops yet.</p></div>
        );
    }
}