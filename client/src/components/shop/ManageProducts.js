import React, { Component } from 'react';
import {Row, Col} from 'reactstrap';
import AddProduct from './AddProduct';
import ListProducts from './ListProducts';

export default class ManageProducts extends Component{
    constructor(props){
        super(props);
        this.state = { 
            itemsKey: null
        };
    }

    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        const itemsKey = contract.methods["getItemsBySeller"].cacheCall(account, {from: account});

        this.setState({ itemsKey });
    }
    
    render() {
        //console.log("ManageProducts");

        if(this.state.itemsKey === null){
            return (
                <div>Loading items key...</div>
            )
        
        } else {
            const { Marketplace } = this.props.drizzleState.contracts;
            const ids = Marketplace.getItemsBySeller[this.state.itemsKey];

            try {
                if(!Boolean(ids && ids.value)) {
                    return (
                        <div>Loading...</div>
                    )
                } else {
                    console.log(ids);
                    return (
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <ListProducts 
                                                drizzle={this.props.drizzle} 
                                                drizzleState={this.props.drizzleState} 
                                                ids={ids} 
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <AddProduct 
                                                drizzle={this.props.drizzle} 
                                                drizzleState={this.props.drizzleState} 
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                    )
                }

            } catch (err) {
                console.log(err);
            }
        }         
    }
}