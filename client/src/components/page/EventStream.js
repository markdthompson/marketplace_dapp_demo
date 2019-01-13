import React, { Component } from 'react';

export default class EventStream extends Component{
    constructor(props){
        super(props);
        this.state = { event: null };
    }

    componentDidMount(){
        const { drizzle } = this.props;
        const contract = drizzle.contracts.Marketplace;

        contract.events.allEvents((err,result)=>{
            if(err){
                console.log(err);
            } else {
                //console.log(result);
                const event = result;
                this.setState({event});
            }
        });

    }

    // from : reddit logging_arbitrary_contract_events_with_truffle
    render() {
        let event = {
            name: null,
            address: null,
            block: null
        }

        let output = '';

        //console.log(this.state.event);

        if(this.state.event !== null) {
            event.name = this.state.event.event;
            event.address = this.state.event.address;
            event.block = this.state.event.blockNumber;

            output = <span>Event:{event.name}, Address:{event.address}, BlockNumber:{event.block}</span>
        }
            
        return(
            output
        )
    }
}