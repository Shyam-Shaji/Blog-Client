'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Edit2, Camera } from 'lucide-react'
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
    console.log("user",user);
  return (
    <div className="bg-card border-b border-border">
      {/* Cover Photo */}
      <div className="relative h-80 bg-linear-to-br from-primary/20 to-primary/5 overflow-hidden">
        {!coverImageError && user.avatar ? (
          <img
            src={user.avatar}
            alt="Cover photo"
        
            className="object-cover"
            onError={() => setCoverImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-primary/30">
            📸
          </div>
        )}

        {isOwnProfile && (
          <button className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background rounded-lg p-2 transition-colors">
            <Camera className="w-5 h-5 text-primary" />
          </button>
        )}
      </div>

      {/* Profile Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end gap-6 py-6">
          {/* Avatar */}
          <div className="relative -mt-20 shrink-0">
            <div className="relative w-40 h-40 rounded-full border-4 border-card bg-linear-to-br from-primary/20 to-primary/5 overflow-hidden">
              {!avatarImageError && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  
                  className="object-cover"
                  onError={() => setAvatarImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  👤
                </div>
              )}
            </div>

            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 bg-primary hover:bg-primary/90 rounded-full p-2 transition-colors">
                <Camera className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="grow">
            <h1 className="text-4xl font-bold text-foreground mb-2">{user?.firstName + " " + user?.lastName}</h1>
            {/* <p className="text-lg text-primary mb-1">{user.profession}</p>
            <p className="text-foreground/70 text-sm mb-4">{user.location}</p>
            <p className="text-foreground/60 max-w-2xl mb-4">{user.bio}</p> */}

            {/* Stats */}
            <div className="flex gap-8 mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {postCount}
                </p>
                <p className="text-foreground/60 text-sm">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {/* {user.followersCount} */} 0
                </p>
                <p className="text-foreground/60 text-sm">Followers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {/* {user.followingCount} */} 0
                </p>
                <p className="text-foreground/60 text-sm">Following</p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          {isOwnProfile && (
            <Button
              onClick={onEditClick}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 self-end cursor-pointer"
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

