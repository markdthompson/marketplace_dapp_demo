import React, { Component } from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';

// UI componenets
import Unav from "./components/page/Unav";

import Marketplace from "./components/marketplace/Marketplace";
import ManageShops from "./components/shop/ManageShops";
import Administration from "./components/admin/Administration";

class App extends Component {
  state = { loading: true, drizzleState: null };

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
    if (this.state.loading) return (
      <Container>
        <Row><Col>Loading Drizzle...</Col></Row>
      </Container>
    )
    return (
      <Router>
        <Container>
          <Unav drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} />
  
          <Route exact path="/" component={Marketplace} />
          <Route path="/manage-shops" component={ManageShops} />
          <Route path="/admin" render={(props) => <Administration {...props} drizzle={this.props.drizzle} drizzleState={this.state.drizzleState} /> } /> 
          
        </Container>
      </Router>
    );
  }
}

export default App;