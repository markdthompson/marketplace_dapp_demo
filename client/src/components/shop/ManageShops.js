import React, { Component } from 'react';
import ListShops from "./ListShops";
import AddShop from "./AddShop";
import {Row, Col} from 'reactstrap';

export default class ManageShops extends Component{
    constructor(props){
        super(props);

        this.state = { 
            shopKeys: null,
            refresh: false
        };

        this.ManageShopsCallback = this.ManageShopsCallback.bind(this);
    }

    componentDidMount() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        const shopKeys = contract.methods["getShopIDsByOwner"].cacheCall(account, {from: account});

        this.setState({ shopKeys});
    }

    ManageShopsCallback(){
        //this.setState({ refresh: !this.state.refresh });
    }
    
    render() {
        if(this.state.shopKeys === null){
            return (
                <div>Loading shopKeys...</div>
            )
        
        } else {
            const { Marketplace } = this.props.drizzleState.contracts;
            const ids = Marketplace.getShopIDsByOwner[this.state.shopKeys];

            try {
                if(!Boolean(ids && ids.value)) {
                    return (
                        <div>Loading...</div>
                    )
                } else {
                       
                    return (
                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <ListShops 
                                                drizzle={this.props.drizzle} 
                                                drizzleState={this.props.drizzleState} 
                                                ids={ids} 
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <AddShop 
                                                drizzle={this.props.drizzle} 
                                                drizzleState={this.props.drizzleState} 
                                                callback={this.ManageShopsCallback}
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

 