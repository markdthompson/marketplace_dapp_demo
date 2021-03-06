import React, { Component } from "react";
import { Switch, Route } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

// UI componenets
import Unav from "./components/page/Unav";
import EventStream from "./components/page/EventStream";

import MarketplaceListContainer from "./components/marketplace/MarketplaceListContainer";
import ShopListContainer from "./components/marketplace/ShopListContainer";
import ShopManagement from "./components/shop/ShopManagement";
import Administration from "./components/admin/Administration";
import NotFound from "./components/page/NotFound";


export default class App extends Component {
  state = { 
    loading: true, 
    drizzleState: null,
  };

  componentDidMount() {
      const { drizzle } = this.props;
  
      // subscribe to changes in the store
      this.unsubscribe = drizzle.store.subscribe(() => {
  
        // every time the store updates, grab the state from drizzle
        const drizzleState = drizzle.store.getState();
  
        // check to see if it's ready, if so, update local component state
        if (drizzleState.drizzleStatus.initialized) {

          this.setState({ loading: false, drizzleState });
        }
      });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.loading) {
      return (
      <Container>
        <Row>
          <Col>
            Loading Drizzle...
          </Col>
        </Row>
      </Container>
    )
  } else {

    return (
        
        <Container>
          
          <Unav drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />
          <EventStream drizzle={this.props.drizzle} drizzleState={this.state.drizzleState}/>

          <Switch>
            <Route exact path="/" render={(props) => <MarketplaceListContainer {...props} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /> } />
            <Route path="/manage-shops" render={(props) => <ShopManagement {...props} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /> } />
            <Route path="/admin" render={(props) => <Administration {...props} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /> } /> 
            <Route path="/shops/:id" render={(props) => <ShopListContainer {...props} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /> } /> 
            <Route component={NotFound} />
          </Switch>
         
        </Container>
      
    );
    }
  }
}