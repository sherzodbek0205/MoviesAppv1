import React from 'react';
import { AuthContext } from '../context';
import { session } from 'services';
import { IContext, IEntity } from '../types';
import { Spin, message } from 'antd';
import { Api, Mappers } from '..';
import { AxiosError } from 'axios';

interface AuthProps {
  children: React.ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children }) => {
  const [state, setState] = React.useState<Omit<IContext, 'methods'>>(() => ({
    isLoading: !!session.get(),
    user: null
  }));

  const login = (user: IEntity.User) => {
    setState({ isLoading: false, user });
  };

  const logout = () => {
    setState({ isLoading: false, user: null });
    session.remove();
  };

  React.useEffect(() => {
    const token = session.get();

    const loadUser = async () => {
      try {
        const { data } = await Api.Me({ token });
        const user = Mappers.User(data);
        setState({ isLoading: false, user });
      } catch (err) {
        session.remove();
        if (err instanceof AxiosError) {
          setState(prev => ({ ...prev, isLoading: false }));
          message.error(err.response?.data as string);
        }
      }
    };

    if (token) loadUser();
  }, []);

  if (state.isLoading)
    return (
      <div className="grid h-screen w-screen place-items-center">
        <Spin size="large" />
      </div>
    );

  return <AuthContext.Provider value={{ ...state, methods: { login, logout } }}>{children}</AuthContext.Provider>;
};

export default Auth;
