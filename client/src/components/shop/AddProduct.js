import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Alert } from 'reactstrap';

export default class AddProduct extends Component{

    constructor(props){
        super(props);
       
        this.state = { 
            stackId: null, 
            txAlert: false, 
            shopID:null,
            name:null,
            description:null,
            ipfsHash:null,
            price:null,
            buffer:''
          };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    //Take file input from user
    captureFile =(event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        if(file == null)
            return;
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => this.convertToBuffer(reader)
    };

    //Convert the file to buffer to store on IPFS
    convertToBuffer = async(reader) => {
        //file is converted to a buffer for upload to IPFS
        const buffer = await Buffer.from(reader.result);
        //set this buffer-using es6 syntax
        this.setState({buffer});
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        
        const shopID = parseInt(e.target.shopID.value);
        const name = e.target.prod_name.value;
        const description = e.target.prod_desc.value;
        const price = parseInt(e.target.prod_price.value);
        
        this.setState({shopID, name, description, price});
    
        //save document to IPFS,return its hash#, and set hash# to state
        const IPFS = require('ipfs-http-client');
        const ipfs = new IPFS('ipfs.infura.io', '5001', { protocol: 'https' });
    
        await ipfs.add(this.state.buffer, (err, ipfsHash) => {
            
            //setState by setting ipfsHash to ipfsHash[0].hash
            this.setState({ ipfsHash:ipfsHash[0].hash });
            
            this.setValues();
        });
      };

    onDismiss(){
        this.setState({txAlert: false});
    }
    
    setValues() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
    
        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["addItemToShop"].cacheSend(
            this.state.shopID, 
            this.state.name, 
            this.state.description,
            this.state.ipfsHash,
            this.state.price,
            {from: drizzleState.accounts[0]}
        );
    
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
                <h3>Add New Product</h3>
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label htmlFor="shopID">Shop ID</Label>
                        <Input id="shopID" name="shopID" type="text" placeholder="0" />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="prod_name">Name</Label>
                        <Input id="prod_name" name="prod_name" type="text" placeholder="My New Product" />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="prod_desc">Description</Label>
                        <Input id="prod_desc" name="prod_desc" type="text" placeholder="This product is..." />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="prod_price">Price</Label>
                        <Input id="prod_price" name="prod_price" type="text" placeholder="3" />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="prod_image">Product Image</Label>
                        <Input id="prod_image" name="prod_image" type="file" onChange = {this.captureFile} />
                    </FormGroup>
                    
                    <FormGroup>
                        <Button>Create</Button>
                    </FormGroup>
                    
                    <FormGroup>
                        <Alert color="info" isOpen={this.state.txAlert} toggle={this.onDismiss}>{this.getTxStatus()}</Alert>
                    </FormGroup>
                </Form>
            </div>
        )
    }
}