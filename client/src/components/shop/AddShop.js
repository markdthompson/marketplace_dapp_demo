import React, { Component } from 'react';
import ListShops from "./ListShops";
import { Button, Form, FormGroup, Input, Label, Alert, Row, Col} from 'reactstrap';

export default class AddShop extends Component{

    constructor(props){
        super(props);
        this.state = { 
            stackId: null, 
            txAlert: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss(){
        this.setState({txAlert: false});
    }
    
    handleSubmit(e) {
        e.preventDefault(); 
        if(e.target.shop_name.value === '') return;
        this.setValues(e.target.shop_name.value, e.target.shop_cat.value);
        e.target.shop_name.value = '';
        e.target.shop_cat.value = '';
    };
    
    setValues(name, category) {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];
    
        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["createShop"].cacheSend(name, category, {
          from: account
        });
    
        // save the `stackId` for later reference
        this.setState({ stackId });
        this.setState({txAlert: true});
    };
    
    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.props.drizzleState;
    
        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId];
    
        // if transaction hash does not exist, don't display anything
        if (!txHash) {

            return 'Connecting...';
        }

        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash].status}`;
    };



    shopIDsUpdateCallback(){
        const { Marketplace } = this.props.drizzleState.contracts;
        const ids = Marketplace.getShopIDsByOwner[this.props.shopIDs];
        return (ids);
    }

    render() {

        const ids = this.shopIDsUpdateCallback();

        if(Boolean(ids && ids)) {

        return(
            <Row>
                <Col>
            <Row>
                <Col>
                    <ListShops drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} ids={ids} />
                </Col>
            </Row>
            <Row>
                <Col>
            <div>
                <h3>Open New Shop</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="shop_name">Shop Name</Label>
                        <Input id="shop_name" name="shop_name" type="text" placeholder="My New Shop" />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="shop_cat">Shop Category</Label>
                        <Input id="shop_cat" name="shop_cat" type="text" placeholder="My Category" />
                    </FormGroup>
                    
                    <FormGroup>
                        <Button>Create</Button>
                    </FormGroup>
                    
                    <FormGroup>
                        <Alert color="success" isOpen={this.state.txAlert} toggle={this.onDismiss}>{this.getTxStatus()}</Alert>
                    </FormGroup>
                </Form>
            </div>
                </Col>
            </Row>
            </Col>
        </Row>
        )
        } else {
            return (
                <div id="manage_shop">
                    <Row>
                        <Col><p>No shops!</p></Col>
                    </Row>
                </div>
            )
        }
    }
}