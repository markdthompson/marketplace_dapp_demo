import React, { Component } from 'react';
import { Button, Table } from 'reactstrap';
import AddShop from "./AddShop";
import ListShops from "./ListShops";

export default class ManageShops extends Component{

 render(){
        return(
            <div className="shops">

                <h3>Shops</h3>
            
                <AddShop />
            
                <ListShops />
            
            </div>
        );
    }
}
