import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom"; // Use react-router-dom for Link and useNavigate

import "./index.css";
import { RegisterUser } from "../../services/auth";

const Register = () => {
  const navigate = useNavigate();

  const onRegister = async (values) => {
    console.log(values);
    const { username, email, password } = values;
    const input = {
      username,
      email,
      password,
    };
    const response = await RegisterUser(input);
    console.log(response);
    if (response.success) {
      message.success(response.message);
      navigate("/login");
    } else {
      message.error(response.message);
    }
  };

  return (
    <div>
      <Form layout={"vertical"} onFinish={onRegister}>
        <div className="form-header">
          <h1>Register</h1>
          <p>Create a free account</p>
        </div>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!", // Added custom message
            },
          ]}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              type: "email",
              message: "The input is not a valid E-mail!",
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
              message: "Please input your password!", // Added custom message
            },
            {
              min: 6,
              message: "Password must be at least 6 characters long!",
            },
          ]}
          labelCol={{
            span: 20,
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
            Register
          </Button>
        </Form.Item>
        <p>
          Already a user? <Link to="/login">Login Here</Link>
        </p>
      </Form>
    </div>
  );
};

export default Register;
