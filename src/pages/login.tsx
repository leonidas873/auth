import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../redux/hooks';
import { login, setUserName } from '../redux/slices/userSlice';
import axios from 'axios';

type FormData = {
  username: string;
  password: string;
};

function decodeJWT(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


export default function Login() {

    const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
  } = useForm<FormData>();
  const onSubmit = handleSubmit((data) => {
      const asynclogin = async () => {
        try {
          const response = await axios.post('http://localhost:8080/login', {...data});
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          // console.log(decodeJWT(response.data.accessToken))
          const username = decodeJWT(response.data.accessToken).username;
          dispatch(setUserName(username))
          dispatch(login())
        } catch (err){
          console.log(err);
        }
      }
      asynclogin()
  }
);

  return (
    <><h3 className='m-auto w-fit p-2'>login form</h3><form onSubmit={onSubmit} className='bg-slate-400 flex flex-col max-w-80 m-auto p-4'>
          <label>First Name</label>
          <input {...register('username')} placeholder='firstName'/>
          <label>password</label>
          <input {...register('password')} placeholder='password'/>
          <button type="submit" className='bg-green-400 my-2 w-fit mx-auto px-6'>login</button>
      </form></>
  );
}
