import React from 'react';
import { Container, Table, Progress, Divider } from 'semantic-ui-react';

const endpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:1337/graphql' : '/graphql';

const OrderRow = ({ orderId, name, estimateDate, progress }) => {
    return (
        <Table.Row key={orderId}>
            <Table.Cell>
                <b>{orderId}</b>
            </Table.Cell>
            <Table.Cell>{name}</Table.Cell>
            <Table.Cell>
                {new Date(estimateDate).toLocaleDateString('fr', 'fr-FR')}
            </Table.Cell>
            <Table.Cell>
                <Progress percent={progress} progress indicating />
            </Table.Cell>
        </Table.Row>
    );
};

class OrderList extends React.Component {
  state = { orders: [] };

  componentWillMount() {
      fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              query: '{ orders { name orderId estimateDate progress } }',
          }),
      })
          .then(data => data.json())
          .then(({ data }) => this.setState({ orders: data.orders }));
  }

  render() {
      const { orders } = this.state;

      return (
          <Table basic="very" celled>
              <Table.Header>
                  <Table.Row>
                      <Table.HeaderCell>Numéro de commande</Table.HeaderCell>
                      <Table.HeaderCell>Nom de la commande</Table.HeaderCell>
                      <Table.HeaderCell>Date de livraison estimée</Table.HeaderCell>
                      <Table.HeaderCell>Progression</Table.HeaderCell>
                  </Table.Row>
              </Table.Header>
              <Table.Body>
                  {orders
                      ? orders
                          .sort((a, b) => a.progress < b.progress)
                          .map(order => <OrderRow key={order.orderId} {...order} />)
                      : 'Loading'}
              </Table.Body>
          </Table>
      );
  }
}

const App = () => (
    <Container>
        <Divider hidden />
        <OrderList />
    </Container>
);

export default App;
