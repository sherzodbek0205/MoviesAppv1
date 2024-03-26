import React, { useContext } from 'react';
import { Button, Input, InputRef, message, Typography } from 'antd';
import { Api, Mappers } from 'modules/auth';
import { session } from 'services';
import { AuthContext } from 'modules/auth/context';

const Login: React.FC = () => {
  const emailRef = React.useRef<InputRef>(null);
  const passwordRef = React.useRef<InputRef>(null);
  const { methods } = useContext(AuthContext);

  const handleSubmit: React.FormEventHandler = async e => {
    e.preventDefault();

    const email = emailRef.current?.input?.value!;
    const password = passwordRef.current?.input?.value!;

    try {
      const loginRes = await Api.Login({ email, password });
      const token = loginRes.data.data;

      session.add(token);

      const meRes = await Api.Me({ token });
      const user = Mappers.User(meRes.data);
      methods.login(user);

      message.success(`Successfully Logged in. Hi ${user.name} 🎉`);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className=" container mx-auto flex h-full flex-col items-center  gap-2">
      <form onSubmit={handleSubmit} className="flex w-[800px] flex-col gap-2">
        <Typography className="text-center text-3xl">Login Form</Typography>
        <Input autoFocus ref={emailRef} type="email" placeholder="email" size="large" />
        <Input.Password ref={passwordRef} placeholder="password" size="large" />
        <Button type="primary" htmlType="submit" size="large">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;