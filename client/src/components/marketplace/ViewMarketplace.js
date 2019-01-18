import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Table } from 'reactstrap';

export default class ViewMarketplace extends Component{

    constructor(props){
        super(props);
        this.state = { 
        };

         console.log('ViewMarketplace');
         console.log(this.props);
    }

    render() {  
        console.log(this.props);
            
            if(this.props.shops.length > 0 ){

                const shopList = this.props.shops.map((shop, index) => 
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
                    
                    </div>
                )
            }    

        return(
            <div><p>You haven't opened any shops yet.</p></div>
        );
    }
}

/*
                       <Switch>
                            <Route exact path="/shops/:id" render={(props) => <Shop {...props} drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} shops={this.props.shops} items={this.props.items} /> } /> 
                        </Switch>
                        */