'use client'

import { useState, useEffect } from 'react'

interface ClientFavoriteButtonProps {
  toolName: string
  toolHref: string
  className?: string
}

export default function ClientFavoriteButton({ toolName, toolHref, className }: ClientFavoriteButtonProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFavoriteClick = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('ai-tools-favorites') || '[]');
      const tool = { name: toolName, href: toolHref };
      const exists = favorites.find((fav: any) => fav.href === tool.href);
      
      if (!exists) {
        favorites.push(tool);
        localStorage.setItem('ai-tools-favorites', JSON.stringify(favorites));
        alert(`${toolName} added to favorites!`);
      } else {
        alert(`${toolName} is already in your favorites!`);
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
      alert('Error saving to favorites. Please try again.');
    }
  };

  if (!mounted) {
    return (
      <div className={className || "inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg"}>
        Save to Favorites
      </div>
    )
  }

  return (
    <button 
      onClick={handleFavoriteClick}
      className={className || "inline-flex items-center px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"}
    >
      Save to Favorites
    </button>
  )
}