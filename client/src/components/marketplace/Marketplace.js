import React, { Component } from 'react';
import Shop from "./Shop";
import { Switch, Route, Link } from 'react-router-dom';
import { Table } from 'reactstrap';

export default class Marketplace extends Component{

    constructor(props){
        super(props);
        this.state = { 
            shops: [],
            items: []
         };

         console.log('Marketplace');
         console.log(this.props);
    }
    
    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        // shops
        let shops = [];
        for( let i = 0; i<this.props.shopCount; i++){
            shops.push(contract.methods["shops"].cacheCall(i, {from: account}));
        }
        console.log(shops);
        this.setState({shops});

        // items
        let items = [];
        for( let i = 0; i<this.props.itemCount; i++){
            contract.methods.items(i).call({from: account}).then((result) => {
                items.push(result);
                console.log(items);
                this.setState({items});
            });
        }
        
    }

    render() {
        
        const { Marketplace } = this.props.drizzleState.contracts;

        // shops
        let shops = [];
        this.state.shops.forEach((key)=>{
            let shop = Marketplace.shops[key];       
            shops.push(shop && shop.value);
        });

        // items
        let items = [];
        this.state.items.forEach((key)=>{
            let item = Marketplace.items[key];       
            items.push(item && item.value);
        });
    
        try{
            
            if(shops.length > 0 ){

                const shopList = shops.map((shop, index) => 
                    <tr key={index}>
                        <td><Link to={{ pathname: '/shops/' + index }} >{shop.name}</Link></td>
                        <td>{shop.category}</td>
                    </tr>
                )
                
                return (
                    
                    <div>
                        <h3>The Shops</h3>
                    
                        <Table size="sm" striped>
                            <thead><tr>
                                <th>Name</th>
                                <th>Category</th>
                            </tr></thead>
                            <tbody>{shopList}</tbody>
                        </Table>

                        <Switch>
                            <Route exact path="/shops/:id" render={(props) => <Shop {...props} drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} shops={shops} items={this.state.items} /> } /> 
                        </Switch>
                    
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