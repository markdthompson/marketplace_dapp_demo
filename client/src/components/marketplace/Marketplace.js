import React, { Component } from 'react';
import Shop from "./Shop";
import { Switch, Route, Link } from 'react-router-dom';
import { Row, Col, Table } from 'reactstrap';

export default class Marketplace extends Component{

    constructor(props){
        super(props);
        this.state = { 
            shops: [],
         };

         console.log('Marketplace');
    }
    
    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        let shops = [];

        for( let i = 0; i<this.props.shopCount; i++){
            shops.push(contract.methods["shops"].cacheCall(i, {from: account}));
        }

        this.setState({shops});
    }

    render() {
        
        const { Marketplace } = this.props.drizzleState.contracts;

        let shops = [];
        this.state.shops.forEach((key)=>{
            let shop = Marketplace.shops[key];       
            shops.push(shop && shop.value);
        });
    
        try{
            
            if(shops.length >0 ){

                const shopList = shops.map((shop, index) => 
                    <tr key={index}>
                        <td><Link to={{ pathname: '/shops/' + index }} >{shop.name}</Link></td>
                        <td>{shop.category}</td>
                    </tr>
                )
                if(this.props.isShop){
                    console.log('This is a shop!!!')
                }
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
                            <Route exact path="/shops/:id" render={(props) => <Shop {...props} drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} shops={shops} /> } /> 
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