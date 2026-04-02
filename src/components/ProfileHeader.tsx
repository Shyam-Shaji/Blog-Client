'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2, Camera, Globe, Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import type { User } from '@/auth/authTypes'

interface ProfileHeaderProps {
  user: User
  isOwnProfile: boolean
  onEditClick: () => void
  postCount?: number
}

export function ProfileHeader({
  user,
  isOwnProfile,
  onEditClick,
  postCount = 0,
}: ProfileHeaderProps) {
  const [coverImageError, setCoverImageError] = useState(false)
  const [avatarImageError, setAvatarImageError] = useState(false)
  
  console.log("ProfileHeader Rendering User:", user);

  return (
    <div className="bg-card border-b border-border shadow-sm">
      {/* Cover Photo */}
      <div className="relative h-80 bg-linear-to-br from-primary/20 to-primary/5 overflow-hidden">
        {user.coverPicture && !coverImageError ? (
          <img
            src={user.coverPicture}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={() => {
                console.error("Cover image failed to load:", user.coverPicture);
                setCoverImageError(true);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-primary/30">
            📸
          </div>
        )}

        {isOwnProfile && (
          <button className="absolute top-4 right-4 bg-background/80 backdrop-blur-md hover:bg-background rounded-xl p-2.5 transition-all shadow-lg border border-border group">
            <Camera className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end gap-8 pb-8 pt-4">
          {/* Avatar */}
          <div className="relative -mt-24 shrink-0">
            <div className="relative w-40 h-40 rounded-full border-4 border-card bg-linear-to-br from-primary/20 to-primary/5 overflow-hidden shadow-2xl">
              {user.profilePicture && !avatarImageError ? (
                <img
                  src={user.profilePicture}
                  alt={user.firstName}
                  className="w-full h-full object-cover"
                  onError={() => {
                    console.error("Avatar image failed to load:", user.profilePicture);
                    setAvatarImageError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  👤
                </div>
              )}
            </div>

            {isOwnProfile && (
              <button 
                onClick={onEditClick}
                className="absolute bottom-2 right-2 bg-primary hover:bg-primary/90 text-white rounded-full p-2.5 transition-all shadow-xl ring-4 ring-card group cursor-pointer"
              >
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="grow space-y-4 min-w-0">
            <div>
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight truncate">
                {user.firstName} {user.lastName}
              </h1>
              {user.bio ? (
                <p className="text-foreground/70 text-base max-w-2xl mt-2 leading-relaxed italic">
                  "{user.bio}"
                </p>
              ) : (
                <p className="text-foreground/40 text-sm mt-2">No bio yet.</p>
              )}
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 items-center pt-1">
              {user.socialLinks?.website && (
                <SocialLink href={user.socialLinks.website} icon={<Globe size={16} />} label="Website" />
              )}
              {user.socialLinks?.facebook && (
                <SocialLink href={user.socialLinks.facebook} icon={<Facebook size={16} />} label="Facebook" />
              )}
              {user.socialLinks?.instagram && (
                <SocialLink href={user.socialLinks.instagram} icon={<Instagram size={16} />} label="Instagram" />
              )}
              {user.socialLinks?.linkedin && (
                <SocialLink href={user.socialLinks.linkedin} icon={<Linkedin size={16} />} label="LinkedIn" />
              )}
              {user.socialLinks?.x && (
                <SocialLink href={user.socialLinks.x} icon={<Twitter size={16} />} label="X" />
              )}
              {user.socialLinks?.youtube && (
                <SocialLink href={user.socialLinks.youtube} icon={<Youtube size={16} />} label="YouTube" />
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-10 pt-4">
              <Stat label="Posts" value={postCount} />
              <Stat label="Followers" value={0} />
              <Stat label="Following" value={0} />
            </div>
          </div>

          {/* Edit Button */}
          {isOwnProfile && (
            <Button
              onClick={onEditClick}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-6 rounded-xl flex items-center gap-2.5 transition-all shadow-lg shadow-primary/20 font-semibold mb-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const validHref = href.startsWith('http') ? href : `https://${href}`;
  
  return (
    <a 
      href={validHref} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-all bg-muted/30 hover:bg-muted/50 px-3 py-1.5 rounded-full border border-border text-xs font-medium"
      title={label}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
      <span className="text-foreground/50 text-[10px] font-bold uppercase tracking-widest mt-1">{label}</span>
    </div>
  )
}
