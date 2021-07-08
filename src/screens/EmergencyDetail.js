import React from 'react';
import EmergencyDetail from '../components/Detail/EmergencyDetail';
import GoBack from '../components/common/GoBack';
import Layout from '../components/common/Layout';

const EmergencyDetailScreen = (props) => {
  return (
    <Layout>
      <GoBack />
      <EmergencyDetail emergency={props.route.params.event} />
    </Layout>
  );
};
export default EmergencyDetailScreen;
