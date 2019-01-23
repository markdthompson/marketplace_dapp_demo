import React, { Component } from 'react';
import ManageAdmins from './ManageAdmins';
import ManageShopOwners from './ManageShopOwners';
import DangerZone from './DangerZone'
import { Row, Col } from 'reactstrap';

export default class Administration extends Component{
    constructor(props){
        super(props);
        this.state = { isAdmin: null };
    }

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];
    
        // let drizzle know we want to watch the `get` method
        const isAdmin = contract.methods["isAnAdmin"].cacheCall({from: account});
    
        // save the `dataKey` to local component state for later reference
        this.setState({ isAdmin });
    }
    
    render() {
        // get the contract state from drizzleState
        const { Marketplace } = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const Admin = Marketplace.isAnAdmin[this.state.isAdmin];

        if(Boolean(Admin && Admin.value)) {
               
        return(
            <Row id="administration">
                <Col>
 
                    <Row>
                        <Col>
                            <ManageAdmins drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                            <ManageShopOwners drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                        </Col>
                    </Row>
           
                    <Row>
                        <Col>
                            <DangerZone drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
        } else {
            return(
                <div id="administration">
                    <Row>
                        <Col><p>You must have administrative privileges to access this page. Return to <a href="/">the Marketplace</a></p></Col>
                    </Row>
                </div>
            )
        }

    }
}