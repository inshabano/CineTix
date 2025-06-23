const { axiosInstance } = require("./axiosinstance");

export const getAllMovies= async (data)=>{
    try{
       const response =  await axiosInstance.get("http://localhost:5000/movies",data);
       return response.data;

    }catch(err){
        return err.response.data;
    }
}
