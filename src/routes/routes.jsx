import Home from '../pages/Home';
import CounterPage from '../pages/CounterPage';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/counter/:value?', element: <CounterPage /> },
];

export default routes;