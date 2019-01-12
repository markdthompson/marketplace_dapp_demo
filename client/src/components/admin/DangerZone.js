import React, { Component } from 'react';
import { Button, FormGroup, Alert } from 'reactstrap';

class DangerZone extends Component{
    constructor(props){
        super(props);
        this.state = { circuitState: null, owner: null}; 

        this.toggleCircuit = this.toggleCircuit.bind(this);
        this.destroyContract = this.destroyContract.bind(this);
    }

    componentDidMount() {
        const { drizzle, drizzleState } = this.props; 
        const contract = drizzle.contracts.Marketplace;
        const account = drizzleState.accounts[0];
    
        // let drizzle know we want to watch these methods
        const circuitState = contract.methods["getCircuitState"].cacheCall();
        const owner = contract.methods["isTheOwner"].cacheCall({from:account});
    
        // save the `dataKey` to local component state for later reference
        this.setState({ circuitState, owner });
      }

    toggleCircuit(event){
        const { drizzle } = this.props;
        const contract = drizzle.contracts.Marketplace;
        contract.methods["toggleCircuitBreaker"].cacheSend();
    }

    destroyContract(event){
        const { drizzle } = this.props;
        const contract = drizzle.contracts.Marketplace;
        contract.methods["destroy"].cacheSend();
    }

    render() {
         // get the contract state from drizzleState
        const { Marketplace } = this.props.drizzleState.contracts;

        // using the saved `dataKey`, get the variable we're interested in
        const circuit = Marketplace.getCircuitState[this.state.circuitState];

        const circuitstate = (Boolean(circuit && circuit.value))?<Alert color="danger">Circuit is Off</Alert>:<Alert color="success">Circuit is On</Alert>

        const ownr = Marketplace.isTheOwner[this.state.owner];

        const isOwner=(ownr && ownr.value);

        var destroyBttn = null;

        if(isOwner && (Boolean(circuit && circuit.value)===true)){
            destroyBttn = <Button id="destroy" type="submit" onClick={this.destroyContract} color="danger">Destroy Contract</Button>
        } else {
            destroyBttn = <Button id="destroy" type="submit" onClick={this.destroyContract} color="danger" disabled>Destroy Contract</Button>
        }

        return(
            <div>
                <h3>Security &amp; Life Cycle</h3>
                <FormGroup>
                    <Button type="submit" onClick={this.toggleCircuit} color="danger">Toggle Circuit Breaker</Button>
                </FormGroup>
                <FormGroup>
                    {circuitstate}
                </FormGroup>
                <FormGroup>
                    {destroyBttn}
                </FormGroup>
            </div>
        )
    }
}

export default DangerZone;