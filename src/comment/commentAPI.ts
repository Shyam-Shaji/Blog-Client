import axiosInstance from "@/api/axios";

export const getCommentsAPI = async(blogId: string)=>{
    const res = await axiosInstance.get(`/comments/blog/${blogId}`);
    return res.data;
}

export const createCommentAPI = async(blogId: string, content: string) => {
    const res = await axiosInstance.post(`/comments/blog/${blogId}`,{
        content,
    });
    return res.data;
}

export const deleteCommentAPI = async(commentId: string) => {
    const res = await axiosInstance.delete(`/comments/${commentId}`);
    return res.data;
}

export const updateCommentAPI = async(commentId: string, content: string) => {
    const res = await axiosInstance.put(`/comments/${commentId}`, { content });
    return res.data;
}