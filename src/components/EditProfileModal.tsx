'use client'
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Camera, User as UserIcon, Globe, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import type { User } from "@/auth/authTypes";

interface EditProfileModalProps {
  isOpen: boolean
  user: User | null
  loading?: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export function EditProfileModal({
  isOpen,
  user,
  loading = false,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [bio, setBio] = useState("")
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  
  // Social links
  const [website, setWebsite] = useState("")
  const [facebook, setFacebook] = useState("")
  const [instagram, setInstagram] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [x, setX] = useState("")
  const [youtube, setYoutube] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateURL = (url: string) => {
    if (!url) return true
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!firstName.trim()) newErrors.firstName = "First name is required"
    if (!lastName.trim()) newErrors.lastName = "Last name is required"
    
    if (!validateURL(website)) newErrors.website = "Please enter a valid URL"
    if (!validateURL(facebook)) newErrors.facebook = "Please enter a valid URL"
    if (!validateURL(instagram)) newErrors.instagram = "Please enter a valid URL"
    if (!validateURL(linkedin)) newErrors.linkedin = "Please enter a valid URL"
    if (!validateURL(x)) newErrors.x = "Please enter a valid URL"
    if (!validateURL(youtube)) newErrors.youtube = "Please enter a valid URL"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "")
      setLastName(user.lastName || "")
      setBio(user.bio || "")
      setProfilePreview(user.profilePicture || null)
      setCoverPreview(user.coverPicture || null)
      
      setWebsite(user.socialLinks?.website || "")
      setFacebook(user.socialLinks?.facebook || "")
      setInstagram(user.socialLinks?.instagram || "")
      setLinkedin(user.socialLinks?.linkedin || "")
      setX(user.socialLinks?.x || "")
      setYoutube(user.socialLinks?.youtube || "")
    }
  }, [user, isOpen])

  const handleProfileImageChange = (file: File | null) => {
    if (!file) return
    setProfileFile(file)
    setProfilePreview(URL.createObjectURL(file))
  }

  const handleCoverImageChange = (file: File | null) => {
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    onSave({
      firstName,
      lastName,
      bio,
      profilePicture: profileFile || undefined,
      coverPicture: coverFile || undefined,
      website,
      facebook,
      instagram,
      linkedin,
      x,
      youtube,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-card z-30">
          <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-foreground/70" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-8">
          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-foreground/70">Cover Picture</label>
            <div className="relative group h-40 w-full rounded-xl bg-muted/30 overflow-hidden border border-white/5 shadow-inner">
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                  <Camera size={48} />
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                <div className="bg-white/20 p-3 rounded-full border border-white/30">
                    <Camera size={24} className="text-white" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleCoverImageChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="flex justify-center -mt-20 relative z-20">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full border-4 border-card bg-muted/30 overflow-hidden shadow-xl ring-1 ring-white/10">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                    <UserIcon size={40} />
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                  <div className="bg-white/20 p-2 rounded-full border border-white/30">
                    <Camera size={20} className="text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProfileImageChange(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex-1">
                <label className="text-xs font-medium text-foreground/50 ml-1">First Name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors(prev => {
                        const { firstName, ...rest } = prev;
                        return rest;
                      });
                    }}
                    aria-invalid={!!errors.firstName}
                    className="w-full px-4 py-2.5 bg-background/50 border border-white/10 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all outline-none"
                    placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-[10px] text-destructive ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.firstName}
                  </p>
                )}
                </div>
                 <div className="space-y-1.5 flex-1">
                <label className="text-xs font-medium text-foreground/50 ml-1">Last Name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors(prev => {
                        const { lastName, ...rest } = prev;
                        return rest;
                      });
                    }}
                    aria-invalid={!!errors.lastName}
                    className="w-full px-4 py-2.5 bg-background/50 border border-white/10 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all outline-none"
                    placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-[10px] text-destructive ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.lastName}
                  </p>
                )}
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground/50 ml-1">Bio</label>
                <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 bg-background/50 border border-white/10 rounded-xl text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all outline-none resize-none min-h-[100px]"
                placeholder="Share a short bio..."
                />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary/70">Social Presence</h3>
            <div className="space-y-3">
              <SocialInput icon={<Globe size={18} />} placeholder="Website URL" value={website} error={errors.website} onChange={(val) => {
                setWebsite(val);
                if (errors.website) setErrors(prev => { const { website, ...rest } = prev; return rest; });
              }} />
              <SocialInput icon={<Facebook size={18} />} placeholder="Facebook Profile" value={facebook} error={errors.facebook} onChange={(val) => {
                setFacebook(val);
                if (errors.facebook) setErrors(prev => { const { facebook, ...rest } = prev; return rest; });
              }} />
              <SocialInput icon={<Instagram size={18} />} placeholder="Instagram Handle" value={instagram} error={errors.instagram} onChange={(val) => {
                setInstagram(val);
                if (errors.instagram) setErrors(prev => { const { instagram, ...rest } = prev; return rest; });
              }} />
              <SocialInput icon={<Linkedin size={18} />} placeholder="LinkedIn URL" value={linkedin} error={errors.linkedin} onChange={(val) => {
                setLinkedin(val);
                if (errors.linkedin) setErrors(prev => { const { linkedin, ...rest } = prev; return rest; });
              }} />
              <SocialInput icon={<Twitter size={18} />} placeholder="X (Twitter) Profile" value={x} error={errors.x} onChange={(val) => {
                setX(val);
                if (errors.x) setErrors(prev => { const { x, ...rest } = prev; return rest; });
              }} />
              <SocialInput icon={<Youtube size={18} />} placeholder="YouTube Channel" value={youtube} error={errors.youtube} onChange={(val) => {
                setYoutube(val);
                if (errors.youtube) setErrors(prev => { const { youtube, ...rest } = prev; return rest; });
              }} />
            </div>
          </div>

          <div className="flex gap-4 pt-6 sticky bottom-0 bg-card/80 backdrop-blur-md pb-2 z-10">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 rounded-xl h-11 border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button 
                type="submit" 
                className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl h-11 shadow-lg shadow-primary/20 transition-all font-semibold"
                disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                </div>
              ) : "Update Profile"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SocialInput({ icon, placeholder, value, error, onChange }: { icon: React.ReactNode, placeholder: string, value: string, error?: string, onChange: (val: string) => void }) {
    return (
        <div className="space-y-1">
          <div className={`flex items-center gap-3 bg-muted/20 border ${error ? "border-destructive ring-2 ring-destructive/20" : "border-white/5"} rounded-xl px-3 group focus-within:border-primary/40 transition-all`}>
              <div className={`text-muted-foreground ${error ? "text-destructive" : "group-focus-within:text-primary"} transition-colors`}>
                  {icon}
              </div>
              <input
                  type="url"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  aria-invalid={!!error}
                  className="w-full py-2.5 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40"
              />
          </div>
          {error && (
            <p className="text-[10px] text-destructive ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {error}
            </p>
          )}
        </div>
    )
}
