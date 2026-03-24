'use client'

import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import { Card } from '@/components/ui/card'
import { ArrowRight, Eye, Heart, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { getBlogs, likeBlog, unlikeBlog } from '@/blog/blogSlice'
import { getComments } from '@/comment/commentSlice'
import CommentsSection from '@/components/CommentsSection'

export default function ArticlesPage() {
  const dispatch = useAppDispatch()
  const { blogs } = useAppSelector((state) => state.blog)
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const user = useAppSelector((state) => state.auth.user)
  const userId = user?.id
  const [openComments, setOpenComments] = useState<string | null>(null)

  useEffect(() => {
    dispatch(getBlogs())
  }, [dispatch])

  useEffect(() => {
    if (!user || blogs.length === 0) return
    const liked = blogs
      .filter((blog) => {
        if (!blog.likes) return false;
        // Check if likes is an array of objects (like { _id: "..." }) or an array of strings
        return blog.likes.some((like: any) => 
          (typeof like === 'string' ? like : like._id) === userId
        );
      })
      .map((blog) => blog._id)
    setLikedPosts(liked)
  }, [blogs, user])

  const toggleLike = (blogId: string) => {
    if (!userId) return

    if (likedPosts.includes(blogId)) {
      dispatch(unlikeBlog({ blogId, userId }))
      setLikedPosts((prev) => prev.filter((id) => id !== blogId))
    } else {
      dispatch(likeBlog({ blogId, userId }))
      setLikedPosts((prev) => [...prev, blogId])
    }
  }

  const toggleComments = (blogId: string) => {
    if (openComments === blogId) {
      setOpenComments(null)
    } else {
      setOpenComments(blogId)
      dispatch(getComments(blogId))
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">
              All Articles
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl">
              Browse our complete collection of in-depth articles about web development, design, and technology.
            </p>
          </div>

          {/* Articles Feed */}
          <div className="space-y-6">
            {[...blogs]
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
                className="bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden group hover:shadow-lg"
              >
                {/* Post Header */}
                <div className="p-6 border-b border-border">
                  <h2 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
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

                  <div className="flex items-center gap-3 text-sm text-foreground/60">
                    <span className="font-medium text-foreground">
                      {post.author.firstName}
                    </span>
                    <span className="text-foreground/40">•</span>
                    <span>{post.publishedAt}</span>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-6">
                  <p className="text-foreground/70 leading-relaxed line-clamp-3">
                    {post.content}
                  </p>
                </div>

                {/* Post Footer with Engagement */}
                <div className="px-6 py-4 border-t border-border bg-background/50">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-foreground/60">
                      <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <button
                        onClick={() => toggleLike(post._id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                          likedPosts.includes(post._id)
                            ? 'bg-primary/20 text-primary'
                            : 'text-foreground/60 hover:bg-background hover:text-foreground'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            likedPosts.includes(post._id) ? 'fill-current' : ''
                          }`}
                        />
                        <span className="text-sm font-medium">{post.likesCount}</span>
                      </button>
                      <button
                        onClick={() => toggleComments(post._id)}
                        className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCount}</span>
                      </button>
                        
                      </div>
                      <Eye className="w-4 h-4" />
                        <span>{(post.views ?? 0).toLocaleString()}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-foreground/60 hover:bg-background hover:text-foreground transition-all group/btn">
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        <span className="text-sm">Read</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {openComments === post._id && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <CommentsSection blogId={post._id} />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center mt-12">
            <button className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl">
              Load More Articles
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
