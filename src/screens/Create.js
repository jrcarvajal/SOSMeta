import React from 'react';
import Create from '../components/Create/Create';
import GoBack from '../components/common/GoBack';
import Layout from '../components/common/Layout';

const CreateScreen = (props) => {
  return (
    <Layout>
      <GoBack />
      <Create />
    </Layout>
  );
};

export default CreateScreen;
