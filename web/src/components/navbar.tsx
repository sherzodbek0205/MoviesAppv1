import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, Typography } from 'antd';
import { AuthContext } from 'modules/auth/context';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { methods, user } = useContext(AuthContext);

  return (
    <div className="w-full bg-slate-200 py-4">
      <div className="container mx-auto flex items-center gap-10">
        <Typography className="cursor-pointer font-aeonik text-3xl font-bold" onClick={() => navigate('/')}>
          Movies
        </Typography>

        {user ? (
          <div className="flex items-center gap-4 text-[30px]">
            <div className="text-xl">
              <Typography className="text-[20px]">{user.name}</Typography>
            </div>
            <div className="text-xl">
              <div className="cursor-pointer text-[20px] text-stone-600 hover:text-stone-800" onClick={methods.logout}>
                Logout
              </div>
            </div>
            <Button onClick={() => navigate('/movies/add')}>Add Movie</Button>
          </div>
        ) : (
          <div className="flex flex-1 justify-between">
            <div className="flex gap-4 text-[30px]">
              <div className="text-xl">
                <NavLink
                  to="/auth/login"
                  className={({ isActive }) =>
                    `${isActive ? 'text-stone-900' : ''} text-stone-600 no-underline hover:text-stone-900`
                  }
                >
                  Login
                </NavLink>
              </div>
              <div className="text-xl">
                <NavLink
                  to="/auth/register"
                  className={({ isActive }) =>
                    `${isActive ? 'text-stone-900' : ''} text-stone-600 no-underline hover:text-stone-900`
                  }
                >
                  Register
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;
