'use client'

import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addComment, deleteComment, updateComment } from '@/comment/commentSlice'
import { Trash2, Edit2, X } from 'lucide-react'

interface CommentsSectionProps {
  blogId: string
}

export default function CommentsSection({ blogId }: CommentsSectionProps) {
  const dispatch = useAppDispatch()
  const { comments } = useAppSelector((state) => state.comment)
  const user = useAppSelector((state) => state.auth.user)
  
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const handleAddComment = () => {
    if (!text.trim()) return
    dispatch(addComment({ blogId, content: text }))
    setText('')
  }

  const handleDeleteComment = (commentId: string) => {
    dispatch(deleteComment(commentId))
  }

  const handleEditComment = (commentId: string, newContent: string) => {
    if (!newContent.trim()) return
    dispatch(updateComment({ commentId, content: newContent }))
    setEditingId(null)
    setEditText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddComment()
    }
  }

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a comment..."
            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm text-foreground placeholder-foreground/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            rows={2}
          />
        </div>
        <button
          onClick={handleAddComment}
          disabled={!text.trim()}
          className="px-4 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-semibold transition-colors h-fit self-end"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-background/50 border border-border rounded-lg p-4 hover:border-border/80 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {comment.userId?.firstName || 'Anonymous'}
                  </p>
                  {/* <p className="text-xs text-foreground/50 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p> */}
                </div>

                {/* Action Buttons */}
                {user?.id === comment.author?._id && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingId(comment._id)
                        setEditText(comment.content)
                      }}
                      className="p-1.5 hover:bg-primary/10 rounded text-foreground/60 hover:text-foreground transition-colors"
                      title="Edit comment"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="p-1.5 hover:bg-destructive/10 rounded text-foreground/60 hover:text-destructive transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editingId === comment._id ? (
                <div className="flex gap-2 mt-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 bg-card border border-border rounded px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors resize-none"
                    rows={2}
                  />
                  <div className="flex flex-col gap-2 self-end">
                    <button
                      onClick={() => handleEditComment(comment._id, editText)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:bg-primary/90 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 hover:bg-background rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-foreground/80 leading-relaxed mt-2">
                  {comment.content}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-foreground/50 py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  )
}
