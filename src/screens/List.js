import React from 'react';
import GoBack from '../components/common/GoBack';
import Layout from '../components/common/Layout';
import EmergencyList from '../components/EmergencyList/EmergencyList';

const ListScreen = (props) => {
  return (
    <Layout>
      <GoBack />
      <EmergencyList />
    </Layout>
  );
};
export default ListScreen;
