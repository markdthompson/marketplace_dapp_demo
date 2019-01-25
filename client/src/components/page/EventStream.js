import React, { Component } from 'react';
import {UncontrolledAlert} from 'reactstrap';

export default class EventStream extends Component{
    constructor(props){
        super(props);
        this.state = { 
            event: null,

        };
    }

    componentDidMount(){
        const { drizzle } = this.props;
        const contract = drizzle.contracts.Marketplace;

        contract.events.allEvents((err,result)=>{
            if(err){
                console.log(err);
            } else {
                const event = result;
                this.setState({event});
            }
        });

    }

    render() {
        const { drizzleState } = this.props;

        const networkID = drizzleState.web3.networkId;

        let network;

        switch(networkID){
            case 3: 
                network = 'Ropsten';
                break;
            case 4: 
                network = 'Rinkeby';
                break;
            case 42: 
                network = 'Kovan';
                break;

            default:
                network = '';
        }

        let event = {
            name: null,
            txHash: null,
            block: null
        }

        let output = '';

        if(this.state.event !== null) {
            event.name = this.state.event.event;
            event.txHash = this.state.event.transactionHash;
            event.block = this.state.event.blockNumber;

            let txLink = <a href={'https://'+ network +'.etherscan.io/tx/' + event.txHash}>{event.txHash}</a>

            output = <UncontrolledAlert color="info">
                <em>Last Event</em>: {event.name}, Tx: {network != '' ? txLink : event.txHash}, BlockNumber: {event.block}</UncontrolledAlert>
        }
            
        return(
            output
        )
    }
}