import React, { Component } from 'react';
import { Table, Row, Col } from 'reactstrap';
import {Link} from 'react-router-dom';

export default class Shop extends Component{
    constructor(props){
        super(props);
    
        console.log('Shop');
        console.log(this.props);
    }
   
    render() {
        const shopID = this.props.match.params.id;
        const myShop = this.props.shops[shopID];

        if(this.props.items.length > 0 ){

            const itemList = this.props.items.map((item, index) => {
               if(item.shopID === shopID)
                    return <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                            </tr>

                    return ''
            });

            if(this.props.isShop){
                console.log('This is a shop!!!')
            }

            return (
                
                <div>
                    <h2>{myShop.name}</h2>

                    <h3>Available Items</h3>
                
                    <Table size="sm" striped>
                        <thead><tr>
                            <th>Name</th>
                            <th>Description</th>
                        </tr></thead>
                        <tbody>{itemList}</tbody>
                    </Table>
                    
                    <Link to="/">&lt;&lt; Back to Shops</Link>

                </div>
            )
        } else {
            return (
                <div>
                    <h2>{myShop.name}</h2>
                    <div>No items for sale!</div>

                    <Link to="/">&lt;&lt; Back to Shops</Link>
                </div>
            )
        }    
    }
}
