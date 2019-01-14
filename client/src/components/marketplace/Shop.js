import React, { Component } from 'react';
import ListProducts from "./ListProducts";
import { Row, Col } from 'reactstrap';

export default class Shop extends Component{
    constructor(props){
        super(props);
        this.state = {storeID: null};
    }

    componenetDidMount(){
        const storeID = this.props.match.params;
        this.setState({storeID});
        console.log(storeID);
    }
   
    render() {
               
        return(
            <Row id="inventory">
                <Col>
                    <Row>
                        <Col>
                            <ListProducts drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        )

    }
}
