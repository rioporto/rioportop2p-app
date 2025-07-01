'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: number;
    title: string;
    summary: string;
    author: string;
    date: string;
    category: string;
    imageUrl: string;
    readTime: string;
  };
}

export default function BlogCard({ post }: BlogCardProps) {
  const categoryColors = {
    Educação: 'bg-blue-100 text-blue-800',
    Análise: 'bg-green-100 text-green-800',
    Segurança: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          [Imagem do Post]
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'}`}>
            {post.category}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {post.readTime}
          </span>
        </div>
        
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.summary}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <User className="w-4 h-4 mr-1" />
            <span className="mr-3">{post.author}</span>
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
          </div>
          
          <Link 
            href={`/blog/${post.id}`}
            className="text-orange-500 hover:text-orange-600 font-semibold text-sm"
          >
            Ler mais →
          </Link>
        </div>
      </div>
    </div>
  );
}