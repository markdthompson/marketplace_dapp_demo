import React, { Component } from 'react';
import { Table } from 'reactstrap';

export default class ActiveAddresses extends Component{

    render() {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;

        const ActiveUser = drizzleState.accounts[0];
        const ActiveContract = contract.address;

        const tableStyle = {
            marginBottom: 40
        }

        return(
            <Table size="sm" style={tableStyle} bordered>
                <thead><tr><th>Active User</th><th>Active Contract</th></tr></thead>
                <tbody><tr><td>{ActiveUser}</td><td>{ActiveContract}</td></tr></tbody>
            </Table>
        )
    }
}