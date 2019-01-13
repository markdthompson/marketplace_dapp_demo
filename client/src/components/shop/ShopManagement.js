import React, { Component } from 'react';
import ManageShops from "./ManageShops";
import ManageProducts from "./ManageProducts";
import { Row, Col } from 'reactstrap';

export default class Administration extends Component{
    constructor(props){
        super(props);
        this.state = { isShopOwner: null };
    }

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];
    
        // let drizzle know we want to watch the `get` method
        const isShopOwner = contract.methods["isAShopOwner"].cacheCall({from: account});
    
        // save the `dataKey` to local component state for later reference
        this.setState({ isShopOwner });
    }
    
    render() {
        // get the contract state from drizzleState
        const { Marketplace } = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const ShopOwner = Marketplace.isAShopOwner[this.state.isShopOwner];

        if(Boolean(ShopOwner && ShopOwner.value)) {
               
        return(
            <Row id="shop_management">
                <Col>
 
                    <Row>
                        <Col>
                            <ManageShops drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col>
                            <ManageProducts drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                        </Col>
                    </Row>
           
                </Col>
            </Row>
        )
        } else {
            return(
                <div id="shop_management">
                    <Row>
                        <Col><p>You must have shopowner privileges to access this page. Return to <a href="/">the Marketplace</a></p></Col>
                    </Row>
                </div>
            )
        }

    }
}