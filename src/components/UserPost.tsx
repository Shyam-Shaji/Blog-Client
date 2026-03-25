import React, { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Heart, MessageCircle, Trash2, Edit2, ArrowDown } from "lucide-react"
import type { Blog } from "@/blog/blogTypes"
import CommentsSection from "@/components/CommentsSection"

interface UserPostsProps {
  posts: Blog[]
  isOwnProfile: boolean
  onAddPost: () => void
  onEditPost: (post: Blog) => void
  onDeletePost: (postId: string) => void
  onLikePost: (postId: string) => void
  likedPosts?: string[]
  onToggleComments?: (postId: string) => void
  openComments?: string | null
}

const UserPost: React.FC<UserPostsProps> = ({
  posts,
  isOwnProfile,
  onAddPost,
  onEditPost,
  onDeletePost,
  onLikePost,
  likedPosts,
  onToggleComments,
  openComments,
}) => {
  const [expandedPosts, setExpandedPosts] = useState<string[]>([]);
  const toggleExpand = (blogId: string) => {
    setExpandedPosts(prev => prev.includes(blogId) ? prev.filter(id => id !== blogId) : [...prev, blogId]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 mt-10">

      {/* Create Blog */}
      {isOwnProfile && (
        <Card className="bg-card border-border p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Create a Blog
            </h3>

            <Button
              onClick={onAddPost}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Write New Blog
            </Button>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {posts.length === 0 ? (
        <Card className="bg-card border-border p-12 text-center">
          <p className="text-foreground/60 text-lg">
            No blogs yet. {isOwnProfile && "Create your first blog!"}
          </p>
        </Card>
      ) : (
        [...posts]
          .sort((a, b) => {
            const dateA = new Date(a.publishedAt).getTime();
            const dateB = new Date(b.publishedAt).getTime();
            if (isNaN(dateA) || isNaN(dateB)) {
              return b._id.localeCompare(a._id);
            }
            return dateB - dateA;
          })
          .map((post) => (
          <Card
            key={post._id}
            className="bg-card border-border overflow-hidden hover:border-primary/50 transition-colors"
          >
            <div className="p-6">

              {/* Blog Title */}
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {post.title}
              </h2>

              {/* Blog Banner */}
              {post.banner?.url && (
                <div className="relative h-80 rounded-lg overflow-hidden mb-4">
                  <img
                    src={post.banner.url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Blog Content */}
              <p className={`text-foreground text-base leading-relaxed mb-4 transition-all ${expandedPosts.includes(post._id) ? '' : 'line-clamp-4'}`}>
                {post.content}
              </p>

              {/* Published Date */}
              <p className="text-foreground/50 text-xs mb-4">
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-foreground/60 py-3 border-t border-b border-border">
                <div className="flex items-center gap-4">

                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{post.likesCount}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentsCount}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    👁
                    <span>{post.viewsCount}</span>
                  </div>

                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 flex-wrap">

                {/* Like */}
                <button
                  onClick={() => onLikePost(post._id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors ${
                    likedPosts?.includes(post._id)
                      ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                      : "text-foreground/70 hover:bg-background/50"
                  }`}
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      likedPosts?.includes(post._id) ? "fill-current text-red-500" : ""
                    }`} 
                  />
                  <span className="text-sm font-medium">Like</span>
                </button>

                {/* Comment */}
                <button 
                  onClick={() => onToggleComments?.(post._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-foreground/70 hover:bg-background/50 rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Comment</span>
                </button>

                {/* Read */}
                <button 
                  onClick={() => toggleExpand(post._id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-foreground/70 hover:bg-background/50 rounded-lg transition-colors group/btn"
                >
                  <ArrowDown className={`w-4 h-4 transition-transform ${expandedPosts.includes(post._id) ? '-rotate-90' : 'group-hover/btn:translate-y-1'}`} />
                  <span className="text-sm font-medium">{expandedPosts.includes(post._id) ? 'Read Less' : 'Read'}</span>
                </button>

                {/* Owner Actions */}
                {isOwnProfile && (
                  <>
                    <button
                      onClick={() => onEditPost(post)}
                      className="flex items-center gap-2 px-3 py-2 text-foreground/70 hover:bg-background/50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeletePost(post._id)}
                      className="flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}

              </div>

              {/* Comments Section */}
              {openComments === post._id && (
                <div className="mt-6 pt-6 border-t border-border">
                  <CommentsSection blogId={post._id} />
                </div>
              )}

            </div>
          </Card>
        ))
      )}
    </div>
  )
}

export default UserPost;