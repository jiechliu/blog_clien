import { observable, computed, action, runInAction, makeObservable } from 'mobx';
import React from 'react';
import { UserData, getCurrentUser } from '@/application/service/user';

class AuthStore {
    @observable
      user: UserData | null = null;

    @computed
    get isLogin() {
      return !!this.user?.username;
    }

    constructor() {
      makeObservable(this);
    }

    @action
      loginUser = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const { data } = await getCurrentUser();
            runInAction(() => {
              this.user = data;
            })
          }
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
}

const context = React.createContext(new AuthStore());

export default () => React.useContext(context);
