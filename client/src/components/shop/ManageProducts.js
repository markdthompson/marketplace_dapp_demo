import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';
import AddProduct from "./AddProduct";
import ListProducts from "./ListProducts";

export default class ManageProducts extends Component{

 render(){
        return(
            <div className="Products">
            <h3>Products</h3>

            <ListProducts />
            
            <AddProduct />
        </div>  
        );
    }
}