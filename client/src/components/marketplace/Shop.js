import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import {Link} from 'react-router-dom';

export default class Shop extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            shop: null
        };

        console.log('Shop');
    }

    componentDidMount(){
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

    }
   
    render() {
        const i = parseInt(this.props.match.params.id);
        const myShop = this.props.shops[i];

        return(
            <Row id="inventory">
                <Col>
                    <h3>{myShop.name}</h3>

                    <Link to="/">&lt;&lt; Back to Shops</Link>
                </Col>
            </Row>

        )

    }
}
