import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createBlogAPI } from "./blogAPI";
import type { CreateBlogPayload, Blog } from "./blogTypes";
import { getAllBlogsAPI, getUserBlogsAPI, editUserBlogAPI, deleteUserBlogAPI} from "./blogAPI";
import { likeBlogAPI, unlikeBlogAPI } from "./blogAPI";

interface BlogState {
    blogs: any[];
    userBlogs: Blog[];
    loading : boolean;
    error : string | null;
    success: boolean;
}

const initialState: BlogState = {
    blogs: [],
    userBlogs: [],
    loading: false,
    error: null,
    success: false,
}

export const createBlog = createAsyncThunk(
    "blogs/createBlog",
    async (data: CreateBlogPayload, {rejectWithValue}) => {
        try {
            const res = await createBlogAPI(data);
            return res.blog;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Error");
        }
    }
)

export const getBlogs = createAsyncThunk(
    "blogs/getBlogs",
    async(_,{rejectWithValue}) =>{
        try {
            const res = await getAllBlogsAPI();
            return res.blogs;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Error");
        }
    }
)

export const getUserBlogs = createAsyncThunk(
    "blogs/getUserBlogs",
    async(userId: string) => {
        const res = await getUserBlogsAPI(userId);
        return res.blogs;
    }
)

export const editUserBlog = createAsyncThunk(
    "blogs/editUserBlog",
    async({blogId, data}: {blogId: string, data: CreateBlogPayload}) => {
        const res = await editUserBlogAPI(blogId, data);
        return res.blog;
    }
)

export const deleteUserBlog = createAsyncThunk(
    "blogs/deleteUserBlog",
    async(blogId: string) => {
        await deleteUserBlogAPI(blogId);
        return blogId;
    }
)

export const likeBlog = createAsyncThunk(
    "blogs/likeBlog",
    async({blogId, userId}: {blogId:string; userId: string}) =>{
        const res = await likeBlogAPI(blogId, userId);
        return {blogId, userId, likesCount: res.likesCount};
    }
)

export const unlikeBlog = createAsyncThunk(
    "blogs/unlikeBlog",
    async({blogId, userId}: {blogId: string, userId: string}) => {
        await unlikeBlogAPI(blogId, userId);
        return {blogId, userId};
    }
)

const blogSlice = createSlice({
    name:'blog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        //CREATE BLOG
        .addCase(createBlog.pending,(state)=>{
            state.loading = true;
        })
        .addCase(createBlog.fulfilled,(state,action)=>{
            state.loading = false;
            state.success = true;
            if (action.payload) {
                state.blogs.unshift(action.payload);
                state.userBlogs.unshift(action.payload);
            }
        })
        .addCase(createBlog.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string
        })
        //GET BLOGS
        .addCase(getBlogs.pending,(state)=>{
            state.loading = true;
        })
        .addCase(getBlogs.fulfilled,(state,action)=>{
            state.loading = false;
            state.blogs = action.payload;
        })
        .addCase(getBlogs.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string;
        })

        //GET USER BLOGS
        .addCase(getUserBlogs.pending,(state)=>{
            state.loading = true;
        })
        .addCase(getUserBlogs.fulfilled,(state,action)=>{
            state.loading = false;
            state.userBlogs = action.payload;
        })
        .addCase(getUserBlogs.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string;
        })

        //EDIT USER BLOG
        .addCase(editUserBlog.pending,(state)=>{
            state.loading = true;
        })
        .addCase(editUserBlog.fulfilled,(state,action)=>{
            state.loading = false;
            state.success = true;
            if (action.payload) {
                const userBlogIndex = state.userBlogs.findIndex(b => b._id === action.payload._id);
                if (userBlogIndex !== -1) {
                    state.userBlogs[userBlogIndex] = action.payload;
                }

                const blogIndex = state.blogs.findIndex(b => b._id === action.payload._id);
                if (blogIndex !== -1) {
                    state.blogs[blogIndex] = action.payload;
                }
            }
        })
        .addCase(editUserBlog.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string;
        })

        //DELETE USER BLOG
        .addCase(deleteUserBlog.pending,(state)=>{
            state.loading = true;
        })
        .addCase(deleteUserBlog.fulfilled,(state,action)=>{
            state.loading = false;
            state.userBlogs = state.userBlogs.filter(b => b._id !== action.payload);
            state.blogs = state.blogs.filter(b => b._id !== action.payload);
        })
        .addCase(deleteUserBlog.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload as string;
        })

        //Like
        .addCase(likeBlog.fulfilled,(state,action)=>{
            const updateBlogLikes = (b: any) => {
                b.likesCount = action.payload.likesCount
                if (!b.likes) b.likes = [];
                const isLiked = b.likes.some((like: any) => 
                    (typeof like === 'string' ? like : like._id) === action.payload.userId
                );
                if (!isLiked) {
                    b.likes.push(action.payload.userId);
                }
            };

            const blog = state.blogs.find(b => b._id === action.payload.blogId);
            if(blog) updateBlogLikes(blog);

            const userBlog = state.userBlogs.find(b => b._id === action.payload.blogId);
            if(userBlog) updateBlogLikes(userBlog);
        })

        .addCase(unlikeBlog.fulfilled,(state,action)=>{
            const updateBlogUnlikes = (b: any) => {
                if (b.likesCount > 0) {
                    b.likesCount -= 1
                }
                if (b.likes) {
                    b.likes = b.likes.filter((like: any) => 
                        (typeof like === 'string' ? like : like._id) !== action.payload.userId
                    )
                }
            };

            const blog = state.blogs.find(b => b._id === action.payload.blogId)
            if(blog) updateBlogUnlikes(blog);

            const userBlog = state.userBlogs.find(b => b._id === action.payload.blogId);
            if(userBlog) updateBlogUnlikes(userBlog);
        })
        
        // Listen to comment creation from commentSlice
        .addCase("comments/addComment/fulfilled" as any, (state, action: any) => {
            const blogId = action.payload.blogId || action.payload.blog;
            const blog = state.blogs.find(b => b._id === blogId);
            if (blog) {
                blog.commentsCount = (blog.commentsCount || 0) + 1;
            }
            const userBlog = state.userBlogs.find(b => b._id === blogId);
            if (userBlog) {
                userBlog.commentsCount = (userBlog.commentsCount || 0) + 1;
            }
        })
    },
});

export default blogSlice.reducer;