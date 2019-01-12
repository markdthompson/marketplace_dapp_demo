import React, { Component } from 'react';
import { Button } from 'reactstrap';

import ManageShops from "./ManageShops";
import ManageProducts from "./ManageProducts";

export default class ShopManagement extends Component{
    render() {
        return(
            <div id="shopowners">

                <ManageShops />

                <ManageProducts />
 
            </div>
        )
    }
}