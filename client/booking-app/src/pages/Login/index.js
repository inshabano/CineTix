import { Button, Form, Input, message } from "antd";
import "./index.css";
import { Link, useNavigate } from "react-router";
import { LoginUser } from "../../services/auth";
const Login = () => {
  const navigate = useNavigate();
  const onLogin = async (values) => {
    console.log(values);
    const {email,password} = values;
    const input = {
       email,password
    }
    const response = await LoginUser(input);
    console.log(response);
    if(response.success){
      message.success(response.message);
      const jwtToken = response.accessToken;
      localStorage.setItem("token",jwtToken);
      localStorage.setItem('username', response.username);
      navigate("/");
    }
    else{
      message.error(response.message);
    }
  };


  const [form] = Form.useForm();

  return (
    <div>
      <Form layout={"vertical"} form={form} onFinish={onLogin}>
        <div className="form-header">
          <h1>Log in</h1>
        </div>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
            },
          ]}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
        >
          <Input.Password
            className="input-pass"
            placeholder="Enter your password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
        <p>
          New User? <Link to="/register">Register Here</Link>
        </p>
        <p>
          Forgot Password? <Link to="/forgotpassword"></Link>      
        </p>
      </Form>
    </div>
  );
};
export default Login;
