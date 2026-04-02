import { ProfileHeader } from "@/components/ProfileHeader";
import { toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import UserPost from "@/components/UserPost";
import type { Blog } from "@/blog/blogTypes";
import { useEffect, useState } from "react";
import { PostModal } from "@/components/PostModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { createBlog, getUserBlogs, likeBlog, unlikeBlog, editUserBlog, deleteUserBlog } from "@/blog/blogSlice";
import { getComments } from "@/comment/commentSlice";
import { getUserById, clearSelectedUser } from "@/auth/authSlice";
import type { CreateBlogPayload } from "@/blog/blogTypes";
import { Footer } from "@/components/Footer";
import { useParams } from "react-router-dom";
import { EditProfileModal } from "@/components/EditProfileModal";
import { updateUser, resetUserState } from "@/user/userSlice";


const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = useAppSelector((state) => state.auth.user);
  const selectedUser = useAppSelector((state) => state.auth.selectedUser);
  const authLoading = useAppSelector((state) => state.auth.loading);
  const authError = useAppSelector((state) => state.auth.error);
  const dispatch = useAppDispatch();

  const isOwnProfile = !userId || userId === currentUser?.id || userId === (currentUser as any)?._id;
  const displayUser = isOwnProfile ? currentUser : selectedUser;
  const profileId = userId || currentUser?.id || (currentUser as any)?._id;

  console.log("ProfilePage Debug:", {
    userId: currentUser?.id,
    currentUserId: currentUser?.id,
    isOwnProfile,
    selectedUser,
    displayUser,
    profileId,
    authLoading
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Blog | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {userBlogs} = useAppSelector((state) => state.blog);
  const {loading: userUpdateLoading} = useAppSelector(state => state.user);

  useEffect(() => {
    if (profileId) {
      dispatch(getUserBlogs(profileId));
      if (!isOwnProfile) {
        dispatch(getUserById(profileId));
      }
    }
    
    return () => {
      dispatch(clearSelectedUser());
      dispatch(resetUserState());
    };
  }, [profileId, isOwnProfile, dispatch]);

  useEffect(() => {
    if (!currentUser || userBlogs.length === 0) return;
    const liked = userBlogs
      .filter((blog) => {
        if (!(blog as any).likes) return false;
        return (blog as any).likes.some((like: any) => 
          (typeof like === 'string' ? like : like._id) === currentUser.id || 
          (typeof like === 'string' ? like : like._id) === (currentUser as any)?._id
        );
      })
      .map((blog) => blog._id);
    setLikedPosts(liked);
  }, [userBlogs, currentUser]);


  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleEditProfileSave = async (data: any) => {
    if (!currentUser) return;
    try {
      await dispatch(updateUser({ data })).unwrap();
      toast.success("Profile updated successfully");
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to update profile");
    }
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (post: Blog) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleDeletePost = (postId: string) => {
    setPostToDelete(postId);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    try {
      await dispatch(deleteUserBlog(postToDelete)).unwrap();
      toast.success("Blog deleted successfully");
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : "Failed to delete blog");
    } finally {
      setPostToDelete(null);
    }
  };

  const handleLikePost = (postId: string) => {
    const activeUserId = currentUser?.id || (currentUser as any)?._id;
    if (!activeUserId) return;

    if (likedPosts.includes(postId)) {
      dispatch(unlikeBlog({ blogId: postId, userId: activeUserId }));
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
    } else {
      dispatch(likeBlog({ blogId: postId, userId: activeUserId }));
      setLikedPosts((prev) => [...prev, postId]);
    }
  };

  const handleSavePost = async (data: CreateBlogPayload) => {
    try {
      if (editingPost && editingPost._id) {
        await dispatch(editUserBlog({ blogId: editingPost._id, data })).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await dispatch(createBlog(data)).unwrap();
        toast.success("Blog created successfully");
      }
  
      setIsModalOpen(false);
      setEditingPost(null);
    } catch (error: any) {
      toast.error(typeof error === 'string' ? error : "An error occurred");
    }
  };

  const toggleComments = (blogId: string) => {
    if (openComments === blogId) {
      setOpenComments(null);
    } else {
      setOpenComments(blogId);
      dispatch(getComments(blogId));
    }
  };

  if (authLoading && !displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground/60 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (authError && !displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg">{authError}</p>
          <Footer />
        </div>
      </div>
    );
  }

  if (!displayUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <p className="text-foreground/60">User not found</p>
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileHeader
        user={displayUser}
        isOwnProfile={isOwnProfile}
        onEditClick={handleEditProfile}
        postCount={userBlogs?.length || 0}
      />

      <UserPost
        posts={userBlogs}
        isOwnProfile={isOwnProfile}
        onAddPost={handleAddPost}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
        onLikePost={handleLikePost}
        likedPosts={likedPosts}
        onToggleComments={toggleComments}
        openComments={openComments}
      />

      <PostModal
        isOpen={isModalOpen}
        editingPost={editingPost}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSavePost}
      />

      <ConfirmDeleteModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={confirmDeletePost}
      />
      
      <EditProfileModal
        isOpen={isEditModalOpen}
        user={currentUser}
        loading={userUpdateLoading}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProfileSave}
      />

      <Footer />
    </>
  );
};

export default ProfilePage;