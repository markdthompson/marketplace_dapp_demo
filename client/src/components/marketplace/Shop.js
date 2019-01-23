import React, { Component } from 'react';
import { CardColumns, Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import {Link} from 'react-router-dom';

export default class Shop extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            stackID: null,
            txAlert: false
        }
    
        //console.log('Shop');
        //console.log(this.props);
    }

    onDismiss(){
        this.setState({txAlert: false});
    }

    handleBuy(sku, price) {
        //console.log(price);
        this.buy(sku, price);
    };

    buy(_sku, _price) {
        const sku = parseInt(_sku);
        const price = parseInt(_price);

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
    
        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["buyItem"].cacheSend(sku, {
          from: drizzleState.accounts[0], value: price
        });
    
        // save the `stackId` for later reference
        this.setState({ stackId });
        this.setState({txAlert: true});
    };

    handleReceive(sku) {
        //console.log(sku);
        this.receive(sku);
    };

    receive(_sku) {
        const sku = parseInt(_sku);

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
    
        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["receiveItem"].cacheSend(sku, {
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
        const account = this.props.drizzleState.accounts[0];

        const shopID = this.props.match.params.id;
        const myShop = this.props.shops[shopID];

        if(this.props.items[this.props.items.length-1] !== undefined ){

            // filter items for only those beloning to this shop
            let myItems = [];
            for(let i=0; i<this.props.items.length; i++){
                
                // make sure it belongs to this store
                if(this.props.items[i].shopID === shopID){
                    // and that it's still for sale
                    if(this.props.items[i].state === '0') {
                        myItems.push(this.props.items[i]);
                    } else {
                        // or that it ws ordered by this user
                        if(this.props.items[i].buyer === account) {
                            // and is awaiting shipment or was shipped but not received
                            if(this.props.items[i].state === '1' || this.props.items[i].state === '2'){
                                myItems.push(this.props.items[i]);
                            }  
                        }
                    }
                    
                }
            }

            // any shops in my store?
            if(myItems.length){
                
                const itemList = myItems.map((item, index) => {
                    return <Card key={index}>
                                <CardImg top src={'https://ipfs.io/ipfs/' +  item.ipfsImageHash} />
                                <CardBody>
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardSubtitle>{item.description}</CardSubtitle>
                                    <CardText>Price: {this.props.drizzle.web3.utils.fromWei(item.price,'finney')} finney</CardText>
                                    
                                    {item.state === '0' ? (
                                        <Button onClick={this.handleBuy.bind(this, item.sku, item.price)} >Buy Now</Button> ) : (
                                            item.state === '1' && item.buyer === account ? (
                                                <Button disabled>Ordered</Button> 
                                            ) : (
                                                item.state === '2' && item.buyer === account ? (
                                                    <Button onClick={this.handleReceive.bind(this, item.sku)} >Receive</Button>
                                                ) : (
                                                <Button disabled>Sold!</Button> 
                                                )
                                            )
                                    )}
                                </CardBody>
                            </Card>
                });
            
                return (
                    <div>
                        <h1>{myShop.name}</h1>
                
                        <CardColumns>
                            {itemList}
                        </CardColumns>
                                          
                        <div className="shop-footer">
                            <Link to="/">&lt;&lt; Back to Shops</Link>
                        </div>
                    </div>
                )

            } else {
                return (
                    <div>
                        <h2>{myShop.name}</h2>
                
                        <div>{myShop.name} doesn't have any items posted for sale.</div>
                    
                        <Link to="/">&lt;&lt; Back to Shops</Link>

                    </div>
                )
            }

        } else {
            return (
                <div>
                    <h2>{myShop.name}</h2>
                    <div>No items for sale!</div>

                    <Link to="/">&lt;&lt; Back to Shops</Link>
                </div>
            )
        }    
    }
}
