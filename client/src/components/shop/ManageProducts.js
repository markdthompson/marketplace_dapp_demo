import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import AddProduct from "./AddProduct";
import ListProducts from "./ListProducts";

export default class ManageProducts extends Component{
    constructor(props){
        super(props);
        this.state = { isAdmin: null, isShopOwner: null };
    }
    
    render() {

        return(
            <Row>
                <Col>
                    <Row>
                        <Col><ListProducts drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /></Col>
                    </Row>

                    <Row>
                        <Col><AddProduct drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /></Col>
                    </Row>

                    <hr />
                </Col>
            </Row>
        )
    }
}
 