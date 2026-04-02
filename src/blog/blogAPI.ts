import axiosInstance from "@/api/axios";
import type { CreateBlogPayload } from "./blogTypes";

export const createBlogAPI = async(data: CreateBlogPayload) => {
    const formData = new FormData();

    formData.append("title",data.title);
    formData.append("content",data.content);
    formData.append("status",data.status);

    if (data.banner_image) {
    formData.append("banner_image", data.banner_image);
  }

    const res = await axiosInstance.post("/blogs",formData);
    
    return res.data;
}

export const getAllBlogsAPI = async()=>{
    const res = await axiosInstance.get("/blogs");
    return res.data;
}

export const getUserBlogsAPI = async(userId: string) => {
    const res = await axiosInstance.get(`/blogs/user/${userId}`);
    return res.data;
}

export const editUserBlogAPI = async(blogId: string, data: CreateBlogPayload) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("status", data.status);

    if (data.banner_image) {
        formData.append("banner_image", data.banner_image);
    }

    const res = await axiosInstance.put(`/blogs/${blogId}`, formData);
    return res.data;
}

export const deleteUserBlogAPI = async(blogId: string) => {
    const res = await axiosInstance.delete(`/blogs/${blogId}`);
    return res.data;
}

export const likeBlogAPI = async(blogId: string, userId: string)=>{
    const res = await axiosInstance.post(`/likes/blog/${blogId}`,{
        userId,
    });
    return res.data;
}

export const unlikeBlogAPI = async(blogId: string, userId: string)=>{
    await axiosInstance.delete(`/likes/blog/${blogId}`,{
        data: {userId},
    });
};