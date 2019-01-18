import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Alert } from 'reactstrap';

export default class AddAdmins extends Component{

    constructor(props){
        super(props);
        this.state = { stackId: null, txAlert: false };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss(){
        this.setState({txAlert: false});
    }
    
    handleSubmit(e) {
        e.preventDefault(); 
        if(e.target.admin_address.value === '') return;
        this.setValue(e.target.admin_address.value);
        e.target.admin_address.value = '';
    };
    
    setValue(address) {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
    
        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["addAdmin"].cacheSend(address, {
          from: drizzleState.accounts[0]
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

    

    render() {
        return(
            <div>
                <h3>Add New Admin</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="address">Enter Account Address</Label>
                        <Input id="new_amdin_address" name="admin_address" type="text" placeholder="0x000000000000000000000000000000000000000000" />
                    </FormGroup>
                    
                    <FormGroup>
                        <Button>Add</Button>
                    </FormGroup>
                    
                    <FormGroup>
                        <Alert color="success" isOpen={this.state.txAlert} toggle={this.onDismiss}>{this.getTxStatus()}</Alert>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}