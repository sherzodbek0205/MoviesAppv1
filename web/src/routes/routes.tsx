import React, { useContext } from 'react';
import { Navigate, Outlet, Route, Routes as Switch, useNavigate } from 'react-router-dom';
import { Auth, Movies } from 'pages';
import { Navbar } from 'components';
import { AuthContext } from 'modules/auth/context';
import { Movie } from 'modules/movies/api';

const Routes: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isAuthenticated = !!user;

  return (
    <>
      <Navbar />
      <Switch>
        <Route path="movies">
          <Route index element={<Movies.Main />} />

          <Route
            path=":movieId"
            element={isAuthenticated ? <Movies.Single navigate={navigate} /> : <Navigate to="/auth" />}
          />{' '}
          <Route path="auth" element={isAuthenticated ? <Auth.Login /> : <Movies.Single navigate={navigate} />} />
          <Route path="*" element={<Navigate to="/movies" />} />
        </Route>
        <Route path="movies/genre/:id" element={<Movies.Main/>} />

        <Route path="auth" element={isAuthenticated ? <Navigate to="/movies" /> : <Outlet />}>
          <Route path="login" element={<Auth.Login />} />
          <Route path="register" element={<Auth.Register navigate={navigate} />} />
          <Route index path="*" element={<Navigate to="/auth/login" />} />
        </Route>

        <Route path="*" element={<Navigate to="/movies" />} />
      </Switch>
    </>
  );
};

export default Routes;
