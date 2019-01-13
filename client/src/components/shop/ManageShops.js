import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import AddShop from "./AddShop";
import ListShops from "./ListShops";

export default class ManageShops extends Component{
    constructor(props){
        super(props);
        this.state = { isAdmin: null, isShopOwner: null };
    }
    
    render() {

        return(
            <Row>
                <Col>
                    <Row>
                        <Col><ListShops drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /></Col>
                    </Row>

                    <Row>
                        <Col><AddShop drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /></Col>
                    </Row>

                    <hr />
                </Col>
            </Row>
        )
    }
}
 