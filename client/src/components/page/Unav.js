import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, Row, Col } from 'reactstrap'; 
import ActiveAddresses from "./ActiveAddresses.js"

export default class Unav extends Component{

    constructor(props){
        super(props);
        this.state = { isAdmin: null, isShopOwner: null };
    }

    componentDidMount() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];

        //console.log(contract);
    
        // let drizzle know we want to watch the `get` method
        const isAdmin = contract.methods["isAnAdmin"].cacheCall({from: account});
        const isShopOwner = contract.methods["isAShopOwner"].cacheCall({from: account});
    
        // save the `dataKey` to local component state for later reference
        this.setState({ isAdmin, isShopOwner });
    }

    render() {
        // get the contract state from drizzleState
        const { Marketplace } = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const isAdmin = Marketplace.isAnAdmin[this.state.isAdmin];
        const isShopOwner = Marketplace.isAShopOwner[this.state.isShopOwner];

        const links = [{link: <Link to="/" className="nav-link">Marketplace</Link>, key:'marketplace'}];
        if(Boolean(isShopOwner && isShopOwner.value)) links.push({link: <Link to="/manage-shops" className="nav-link">Manage Shops</Link>, key:"manageshops"});
        if(Boolean(isAdmin && isAdmin.value)) links.push({link:<Link to="/admin" className="nav-link">Admin</Link>, key:"admin"});

        const navlist = links.map((link) => 
            <NavItem key={link.key}>{link.link}</NavItem>
        );

        return(
            <Row>
                <Col>
                    <Navbar color="dark" dark expand="lg">
                        <NavbarBrand className="logo" href="./#/">Marketplace Dapp Demo</NavbarBrand>
                        <Nav className="ml-auto" navbar>
                            {navlist}
                        </Nav>
                    </Navbar>
                    <ActiveAddresses drizzle={this.props.drizzle} drizzleState={this.props.drizzleState} />
                </Col>
            </Row>
        )
    }
}