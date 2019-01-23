import React, { Component } from 'react';
import { Table } from 'reactstrap';

export default class ActiveAddresses extends Component{

    render() {

        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.Marketplace;

        const networkID = drizzleState.web3.networkId;
        const ActiveUser = drizzleState.accounts[0];
        const ActiveContract = contract.address;

        let network;

        switch(networkID){
            case 3: 
                network = 'Ropsten';
                break;
            case 4: 
                network = 'Rinkeby';
                break;

            default:
                network = '';
        }

        const tableStyle = {
            marginBottom: 40
        }

        const ActiveUserLink = <a target="_blank" href={'https://'+ network +'.etherscan.io/address/' + ActiveUser}>{ActiveUser}</a>;
        const ActiveContractLink = <a target="_blank" href={'https://'+ network +'.etherscan.io/address/' + ActiveContract}>{ActiveContract}</a>;

        return(
            <Table size="sm" style={tableStyle} bordered responsive>
                <thead><tr><th>Network</th><th>Active External Account</th><th>Active Contract Account</th></tr></thead>
                <tbody><tr>
                    <td>{(networkID === 3 || networkID === 4) ? network : 'Development'}</td>
                    <td>{(networkID === 3 || networkID === 4) ? ActiveUserLink : ActiveUser}</td>
                    <td>{(networkID === 3 || networkID === 4) ? ActiveContractLink : ActiveContract}</td>
                </tr></tbody>
            </Table>
        )
    }
}