"use client";

import { useState } from "react";
import { Menu, X, Search, LogOut, User, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { logout } from "@/auth/authSlice";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  console.log(user);

  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/home" },
    { name: "Articles", href: "/articles" },
    { name: "About", href: "#" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout Successfully");
    navigate("/");
  };
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50 rounded-lg" />
          <span className="text-xl font-bold text-foreground">WriteFlow</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 hover:bg-card rounded-lg transition-colors cursor-pointer">
            <Search className="w-5 h-5 text-foreground/70" />
          </button>
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            Subscribe
          </Button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-card rounded-lg transition-colors group cursor-pointer"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white text-sm font-semibold">
                  {user?.firstName?.slice(0, 2).toUpperCase()}
                </div>
              )}

              <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                {user?.firstName}
              </span>
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-border bg-background/50">
                  <p className="text-sm font-semibold text-foreground">
                    {user?.firstName}
                  </p>
                  <p className="text-xs text-foreground/60">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    to="/profile"
                    className="w-full px-4 py-2 flex items-center gap-3 text-sm text-foreground/70 hover:bg-background/80 hover:text-foreground transition-colors block"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </Link>
                  <button className="w-full px-4 py-2 flex items-center gap-3 text-sm text-foreground/70 hover:bg-background/80 hover:text-foreground transition-colors">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-border">
                  <button
                    className="w-full px-4 py-2 flex items-center gap-3 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 hover:bg-card rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-card/50">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile User Profile */}
            <div className="mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={user?.avatar}
                  alt={user?.firstName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {user?.firstName}
                  </p>
                  <p className="text-xs text-foreground/60">{user?.email}</p>
                </div>
              </div>
              <Link
                to="/profile"
                className="w-full px-4 py-2 flex items-center gap-3 text-sm text-foreground/70 hover:bg-background/80 hover:text-foreground transition-colors block"
              >
                <User className="w-4 h-4" />
                View Profile
              </Link>
              <button className="w-full text-left px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-background/50 rounded transition-colors flex items-center gap-2 mt-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-sm text-foreground/70 hover:text-foreground transition-colors py-2"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-3 space-y-2">
              <Button
                size="sm"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Subscribe
              </Button>
              <button className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors flex items-center justify-center gap-2 border border-destructive/20">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
