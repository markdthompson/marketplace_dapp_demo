import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Alert } from 'reactstrap';

export default class AddShop extends Component{

 
    render() {
        return(
            <div>
                <h4>Add Shop</h4>
                <form onSubmit={this.onSubmit}>
                    <input type = "text" />
                    <br/>
                    <Button type="submit">Add</Button>
                </form>
            </div>
        )
    }
}