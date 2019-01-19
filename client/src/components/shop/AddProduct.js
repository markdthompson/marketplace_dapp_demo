import React, { Component } from 'react';
import ListProducts from "./ListProducts";
import { Button, Form, FormGroup, Input, Label, Alert, Row, Col } from 'reactstrap';

export default class AddProduct extends Component{

    constructor(props){
        super(props);
       
        this.state = { 
            stackId: null, 
            prodTxAlert: false,
            buffer:''
          };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onProdDismiss = this.onProdDismiss.bind(this);
        this.itemIDsUpdateCallback = this.itemIDsUpdateCallback.bind(this);
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

        if(shopID === '' || description === '' || price === 0) return;
        
        if(this.state.buffer !== ''){
            //save document to IPFS, return its hash#
            const IPFS = require('ipfs-http-client');
            const ipfs = new IPFS('ipfs.io', '5001', { protocol: 'https' });

            await ipfs.add(this.state.buffer, (err, ipfsHash) => {

                if(err){
                    //console.log(err);
                    return;
                }

                const hash = ipfsHash[0].hash;
                
                this.setValues(shopID, name, description, price, hash );
            });
        } else {
            this.setValues(shopID, name, description, price, '' );
        }
        
      };

    onProdDismiss(){
        this.setState({prodTxAlert: false});
    }
    
    setValues(shopID, name, desc, price, hash) {
        //console.log("in setValues");
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["addItemToShop"].cacheSend(
            shopID, 
            name, 
            desc,
            hash,
            price,
            {from: account}
        );
    
        // save the `stackId` for later reference
        this.setState({ stackId });
        this.setState({txAlert: true});
    };
    
    getProdTxStatus(){
        //console.log("in getTxStatus");
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

    itemIDsUpdateCallback(){
        //console.log("in itemIDsUpdateCallback");
        const { Marketplace } = this.props.drizzleState.contracts;
        const ids = Marketplace.getItemsBySeller[this.props.itemIDs];
        //console.log(ids);
        return (ids);
    }

    render() {
        //console.log("in render")
        const ids = this.itemIDsUpdateCallback();

        if(Boolean(ids && ids)) {

        return(
            <Row>
                <Col>
                    <Row>
                        <Col>
                            <ListProducts drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} ids={ids}  />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
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
                        <Alert color="info" isOpen={this.state.prodTxAlert} toggle={this.onProdDismiss}>{this.getProdTxStatus()}</Alert>
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
                <Row>
                <Col>
                    <Row>
                        <Col>
                            <p>You haven't entered any products yet.</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
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
                        <Alert color="info" isOpen={this.state.prodTxAlert} toggle={this.onProdDismiss}>{this.getProdTxStatus()}</Alert>
                    </FormGroup>
                </Form>
            </div>
                        </Col>
                    </Row>
                </Col>

            </Row>
            )
        }
    }
}