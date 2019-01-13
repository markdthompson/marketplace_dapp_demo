import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import AddAdmins from './AddAdmins';
import ListAdmins from './ListAdmins';

export default class ManageAdmins extends Component{
    constructor(props){
        super(props);
        this.state = { isAdmin: null, isShopOwner: null };
    }
    
    render() {

        return(
            <Row>
                <Col>
                    <Row>
                        <Col><ListAdmins drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /></Col>
                    </Row>

                    <Row>
                        <Col><AddAdmins drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} /></Col>
                    </Row>
                    <hr />
                </Col>
            </Row>
        )
    }
}
 
