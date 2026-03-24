import { ProfileHeader } from "@/components/ProfileHeader";
import { toast } from "sonner";
import { useAppSelector } from "@/app/hooks";
import UserPost from "@/components/UserPost";
import type { Blog } from "@/blog/blogTypes";
import { useEffect, useState } from "react";
import { PostModal } from "@/components/PostModal";
import { ConfirmDeleteModal } from "@/components/ConfirmDeleteModal";
import { useAppDispatch } from "@/app/hooks";
import { createBlog, getUserBlogs, likeBlog, unlikeBlog, editUserBlog, deleteUserBlog } from "@/blog/blogSlice";
import { getComments } from "@/comment/commentSlice";
import type { CreateBlogPayload } from "@/blog/blogTypes";


const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Blog | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // temporary blog list (later fetch from API / RTK Query)
  // const blogs: Blog[] = [];
  const {userBlogs} = useAppSelector((state) => state.blog);
  console.log("userBlogs",userBlogs);

  useEffect(()=>{
    if(user?.id){
      dispatch(getUserBlogs(user.id));
    }
  },[user, dispatch]);

  useEffect(() => {
    if (!user || userBlogs.length === 0) return;
    const liked = userBlogs
      .filter((blog) => {
        if (!(blog as any).likes) return false;
        return (blog as any).likes.some((like: any) => 
          (typeof like === 'string' ? like : like._id) === user.id
        );
      })
      .map((blog) => blog._id);
    setLikedPosts(liked);
  }, [userBlogs, user]);

  const handleEditProfile = () => {
    console.log("Edit profile clicked");
  };

  const handleAddPost = () => {
    console.log("Add blog clicked");
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleEditPost = (post: Blog) => {
    console.log("Edit blog", post);
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
    if (!user?.id) return;

    if (likedPosts.includes(postId)) {
      dispatch(unlikeBlog({ blogId: postId, userId: user.id }));
      setLikedPosts((prev) => prev.filter((id) => id !== postId));
    } else {
      dispatch(likeBlog({ blogId: postId, userId: user.id }));
      setLikedPosts((prev) => [...prev, postId]);
    }
  };

  const handleSavePost = async (data: CreateBlogPayload) => {
    console.log("Save blog", data);
  
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

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <ProfileHeader
        user={user}
        isOwnProfile={true}
        onEditClick={handleEditProfile}
        postCount={userBlogs?.length || 0}
      />

      <UserPost
        posts={userBlogs}
        isOwnProfile={true}
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
      onClose={()=> {
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
    </>
  );
};

export default ProfilePage;