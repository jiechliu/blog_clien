import { createBrowserHistory } from 'history';

export const getHistory = () => {
  return createBrowserHistory({
    basename: '/'
  })
}