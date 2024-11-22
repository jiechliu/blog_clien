import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { getHistory } from './application/history';
import Layout from './presentation/layout';
import useAuth from './presentation/store/use-auth';
import { router } from './router';
import 'antd/dist/antd.min.css';

const App = () => {
  const { loginUser } = useAuth();
  React.useEffect(() => {
    loginUser();
  }, []);

  return (
    <Router history={getHistory()}>
      <Switch>
        {router.map((item, index) => {
          const { component, ...reset } = item;
          return (
            <Route key={index} {...reset} render={() => {
              return <Layout component={component} />
            }} />
          )
        })}
      </Switch>
    </Router>
  );
};

export default App;
