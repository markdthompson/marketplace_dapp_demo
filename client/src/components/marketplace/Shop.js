import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';

export default class Shop extends Component{

    componentDidMount(){
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        console.log(account);
        console.log(contract);
    }
   
    render() {
        const store = this.props.match.params;

        return(
            <Row id="inventory">
                <Col>
                    <Row>
                        <Col>
                            <h3>Shop {store.id}</h3>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )

    }
}
