/**
 * Navigation bar component with logo and auth controls
 */

import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Leaf, BarChart3, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, signOut, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Leaf },
    { to: "/weekly", label: "Weekly Trends", icon: BarChart3 },
  ];

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 font-display text-xl font-semibold text-primary transition-colors hover:text-primary/80"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden sm:inline">GutHealth</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <Button 
                  variant={isActive ? "soft" : "ghost"} 
                  size="sm"
                  className={cn(
                    "gap-2",
                    isActive && "font-medium"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </div>

        {/* User section */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-sm text-muted-foreground">
            {user?.email}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-card animate-slide-up">
          <div className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link 
                  key={link.to} 
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button 
                    variant={isActive ? "soft" : "ghost"} 
                    className="w-full justify-start gap-3"
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}