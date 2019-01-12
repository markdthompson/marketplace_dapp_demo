import React, { Component } from 'react';
import { Button } from 'reactstrap';
import ListProducts from "./ListProducts";
import ListOrders from "./ListOrders";

export default class Marketplace extends Component{
    render() {
        return(
            <div className="marketplace">
                
                <ListProducts />

                <ListOrders />
                
            </div>
        )
    }
}