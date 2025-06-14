const { axiosInstance } = require("./axiosinstance");

export const RegisterUser= async (data)=>{
    try{
       const response =  await axiosInstance.post("http://localhost:5000/register",data);
       return response.data;

    }catch(err){
        return err.response.data;
    }
}

export const LoginUser= async (data)=>{
    try{
       const response =  await axiosInstance.post("http://localhost:5000/login",data);
       console.log(response);
       return response.data;

    }catch(err){
        return err.response.data;
    }
}

