import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import AddShopOwners from './AddShopOwners';
import ListShopOwners from './ListShopOwners';

export default class ManageShopOwners extends Component{
    render() {
        return(
            <Row>
                <Col>
                    <Row>
                        <Col><ListShopOwners drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /></Col>
                    </Row>

                    <Row>
                        <Col><AddShopOwners drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /></Col>
                    </Row>
                    <hr />
                </Col>
            </Row>
        )
    }
}