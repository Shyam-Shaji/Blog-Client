'use client'
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Image as ImageIcon } from "lucide-react";
import type { Blog } from "@/blog/blogTypes";

interface PostModalProps {
  isOpen: boolean
  editingPost: Blog | null
  onClose: () => void
  onSave: (data: {
    title: string
    content: string
    status: "draft" | "published"
    banner_image?: File
  }) => void
}

export function PostModal({
  isOpen,
  editingPost,
  onClose,
  onSave,
}: PostModalProps) {

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title)
      setContent(editingPost.content)
      setStatus(editingPost.status)
      setPreview(editingPost.banner?.url || null)
    }
  }, [editingPost])

  const handleImageChange = (file: File | null) => {
    if (!file) return

    setBannerFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) return

    onSave({
      title,
      content,
      status,
      banner_image: bannerFile || undefined,
    })

    handleClose()
  }

  const handleClose = () => {
    setTitle("")
    setContent("")
    setStatus("draft")
    setBannerFile(null)
    setPreview(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-foreground">
            {editingPost ? "Edit Blog" : "Create Blog"}
          </h2>

          <button
            onClick={handleClose}
            className="p-1 hover:bg-background rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-foreground/70" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog..."
              rows={6}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1 text-foreground">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background"
            >
              <option value="draft">Draft</option>
              <option value="published">Publish</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <ImageIcon size={16} />
              Blog Banner
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              {editingPost ? "Update Blog" : "Create Blog"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}