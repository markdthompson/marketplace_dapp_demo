import React, { Component } from 'react';
import { Button } from 'reactstrap';

export default class ListOrders extends Component{
    render() {
        return(
            <div className="purchases">
                <h3>My Orders</h3>
                <table>
                    <thead><tr><th>ShopID</th><th>SKU</th><th>Product Name</th><th>Price</th><th>State</th><th>Buyer</th><th>Seller</th><th>Action</th></tr></thead>
                    <tbody><tr><td>0x000000000000000000000000</td><td>0</td><td>2</td><td>Product 03</td><td>10</td><td>1</td><td>0x000000000000000000000000</td><td>0x000000000000000000000000</td><td><Button type="submit">Receive</Button></td></tr></tbody>
                </table>
            </div>               
        )
    }
}