import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';
import {Link} from 'react-router-dom';

export default class Shop extends Component{
    constructor(props){
        super(props);
    
        console.log('Shop');
        console.log(this.props);
    }
   
    render() {
        const shopID = this.props.match.params.id;
        const myShop = this.props.shops[shopID];

        if(this.props.items[this.props.items.length-1] !== undefined ){

            // filter items for only those beloning to this shop
            let myItems = [];
            for(let i=0; i<this.props.items.length; i++){
                // make sure it's mine...
                if(this.props.items[i].shopID === shopID){
                    console.log(this.props.items[i]);
                    // and that it's available
                    if(this.props.items[i].state === '0'){
                        myItems.push(this.props.items[i]);
                    }
                }
            }

            // any shops in my store?
            if(myItems.length){

                const itemList = myItems.map((item, index) => {
                    return <Card key={index} >
                                <CardImg top src={'https://ipfs.io/ipfs/' +  item.ipfsImageHash} width="25"/>
                                <CardBody>
                                    <CardTitle>{item.name}</CardTitle>
                                    <CardSubtitle>{item.description}</CardSubtitle>
                                    <CardText>Price: {item.price} wei</CardText>
                                    <Button>Buy Now</Button>
                                </CardBody>
                            </Card>
                });
            
                return (
                    <div>
                        <h2>{myShop.name}</h2>

                        <h3>Available Items</h3>
                
                        <div className="inventory">{itemList}</div>
                                          
                        <div className="shop-footer">
                            <Link to="/">&lt;&lt; Back to Shops</Link>
                        </div>
                    </div>
                )

            } else {
                return (
                    <div>
                        <h2>{myShop.name}</h2>

                        <h3>Available Items</h3>
                
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
