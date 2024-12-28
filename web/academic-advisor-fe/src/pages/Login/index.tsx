import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { response } from "~/services/axios";
interface User {
  account: string,
  password: string
}
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const loginUser = async (user: User) => {
    const res = await response.post('/api/user/login', user)
    return res
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
     const user: User = {
      account: email,
      password: password
    }
    try {
      const res = await loginUser(user)
      if (res.user ) {
        localStorage.setItem('user', JSON.stringify(res.user))
        toast.success("Đăng nhập thành công!", {
          position: 'bottom-right',
          autoClose: 3000
        })
        navigate('/')
      }
    }
    catch(err) {
      console.log(err)
      toast.error("Sai mật khẩu!", {
        position: 'bottom-right',
        autoClose: 3000
      })
    }
  }
  return (
    <div className="inset-0 flex items-center justify-center bg-teal-200 min-h-screen">
      <div className="bg-slate-100 px-20 py-8 mx-auto rounded-lg w-5/12">
        <form onSubmit={handleSubmit} className="w-full mx-auto">
          <div className="mb-5">
            <label
              htmlFor="account"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your account
            </label>
            <input
              type="account"
              id="account"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter your account"
              value={email}
              onChange={e => setEmail(e.target.value)}

            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Your password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
