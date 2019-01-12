import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

export default class ListProducts extends Component{
    render() {

        return(
            
            <table>
                <thead><tr><th>Address</th><th>ShopID</th><th>SKU</th><th>Name</th><th>Price</th><th>State</th><th>Buyer</th><th>Seller</th><th>Action</th></tr></thead>
                <tbody>
                    <tr><td>0x000000000000000000000000</td><td>0</td><td>0</td><td>Product 01</td><td>3</td><td>0</td><td>0x000000000000000000000000</td><td>0x000000000000000000000000</td><td><Button type="submit">Remove</Button></td></tr>
                    <tr><td>0x000000000000000000000000</td><td>0</td><td>1</td><td>Product 02</td><td>5</td><td>0</td><td>0x000000000000000000000000</td><td>0x000000000000000000000000</td><td><Button type="submit">Remove</Button></td></tr>
                    <tr><td>0x000000000000000000000000</td><td>0</td><td>2</td><td>Product 03</td><td>10</td><td>1</td><td>0x000000000000000000000000</td><td>0x000000000000000000000000</td><td><Button type="submit">Ship</Button></td></tr>
                </tbody>
            </table>
        );
    }
}

