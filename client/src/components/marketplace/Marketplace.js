import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ListProducts from "./ListProducts";
import ListOrders from "./ListOrders";
import { Row, Col } from 'reactstrap';

export default class Marketplace extends Component{
   
    render() {
               
        return(
            <Row id="administration">
                <Col>
                    <Row>
                        <Col>
                            <Link to="/shop/12">Shop 12</Link>
                            <ListProducts drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                            <ListOrders drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )

    }
}
