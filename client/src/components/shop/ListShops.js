import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';

export default class ListShops extends Component{

 render(){
        return(
            <div>
            <h3>List Shops</h3>
            <table>
                <thead><tr><th>Address</th><th>ID</th><th>Name</th><th>Category</th><th>Action</th></tr></thead>
                <tbody>
                    <tr><td>0x000000000000000000000000</td><td>0</td><td>Store 00</td><td></td><td><Button type="submit">Delete</Button></td></tr>
                </tbody>
            </table>
            </div>
        );
    }
}