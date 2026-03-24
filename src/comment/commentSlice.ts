import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCommentsAPI, createCommentAPI, deleteCommentAPI, updateCommentAPI } from "./commentAPI";

export const updateComment = createAsyncThunk(
    "comments/updateComment",
    async({commentId, content}: {commentId: string, content: string}) => {
        const res = await updateCommentAPI(commentId, content);
        return res.comment || res; // return updated comment
    }
);

export const getComments = createAsyncThunk(
    "comments/getComments",
    async(blodId: string) => {
        const res = await getCommentsAPI(blodId);
        return res.comments;
    }
);

export const addComment = createAsyncThunk(
    "comments/addComment",
    async({blogId, content}: {blogId: string, content: string}, { getState }) => {
        const res = await createCommentAPI(blogId, content);
        
        // Add user info to the returned comment so it renders correctly right away
        const state: any = getState();
        const user = state.auth.user;
        
        const newComment = {
            ...res.comment,
            blogId: blogId, // ensure blogId is present for blogSlice listener
            createdAt: res.comment.createdAt || new Date().toISOString(), // Ensure date is present
            userId: { 
                _id: user.id || user._id, 
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePicture
            }
        };

        return newComment;
    }
);

export const deleteComment = createAsyncThunk(
    "comments/deleteComment",
    async(commentId: string) => {
        await deleteCommentAPI(commentId);
        return commentId;
    }
);

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        comments: [] as any[],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getComments.pending, (state) => {
            state.loading = true;
        })
        .addCase(getComments.fulfilled, (state, action) => {
            state.loading = false;
            state.comments = action.payload;
        })
        .addCase(getComments.rejected, (state) => {
            state.loading = false;
        })
        .addCase(addComment.fulfilled, (state, action) => {
            state.comments.push(action.payload);
        })
        .addCase(deleteComment.fulfilled, (state, action) => {
            state.comments = state.comments.filter((comment) => comment._id !== action.payload);
        })
        .addCase(updateComment.fulfilled, (state, action) => {
            const index = state.comments.findIndex(c => c._id === action.payload._id);
            if (index !== -1) {
                state.comments[index] = action.payload;
            }
        })
    }
});

export default commentSlice.reducer;