import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Alert } from 'reactstrap';

export default class AddProduct extends Component{
    render() {
        return(
            <div>
                <h4>Add Product</h4>
                <form onSubmit={this.Submit}>
                    <input type="test" />
                    <br/>
                    <Button type="submit">Add</Button>
                </form>
            </div>
        )
    }
}
    
