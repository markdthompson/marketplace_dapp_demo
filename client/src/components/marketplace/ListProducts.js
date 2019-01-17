import React, { Component } from 'react';
//import { Button } from 'reactstrap';

export default class ListProducts extends Component{
    render() {
        return(
                
            <div className="shops">
                    
                <h2>Marketplace</h2>
                    
                <div className="shop">
                    <h3>Shop 00</h3>
                    <p>products listed here in cards</p>
                </div>

                <div className="shop">
                    <h3>Shop 01</h3>
                    <p>products listed here in cards</p>
                </div>

            </div>

        )
    }
}