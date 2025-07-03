'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Tag,
  MoreVertical,
  FileText,
  Image
} from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  author: string
  category: string
  tags: string[]
  status: 'draft' | 'published' | 'scheduled'
  publishedAt: string | null
  views: number
  featured: boolean
  featuredImage?: string
}

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como começar a investir em Bitcoin de forma segura',
    slug: 'como-comecar-investir-bitcoin-segura',
    excerpt: 'Guia completo para iniciantes que querem entrar no mundo das criptomoedas com segurança.',
    author: 'João Silva',
    category: 'Educação',
    tags: ['bitcoin', 'iniciantes', 'segurança'],
    status: 'published',
    publishedAt: '2024-01-08T10:00:00',
    views: 1234,
    featured: true,
    featuredImage: '/blog/bitcoin-guide.jpg'
  },
  {
    id: '2',
    title: 'Entendendo as taxas P2P e como economizar',
    slug: 'entendendo-taxas-p2p-como-economizar',
    excerpt: 'Aprenda como funcionam as taxas em plataformas P2P e dicas para reduzir seus custos.',
    author: 'Maria Santos',
    category: 'Tutorial',
    tags: ['p2p', 'taxas', 'economia'],
    status: 'published',
    publishedAt: '2024-01-07T14:30:00',
    views: 856,
    featured: false
  },
  {
    id: '3',
    title: 'Novidades da plataforma - Janeiro 2024',
    slug: 'novidades-plataforma-janeiro-2024',
    excerpt: 'Confira as últimas atualizações e melhorias implementadas na plataforma.',
    author: 'Admin',
    category: 'Novidades',
    tags: ['atualizações', 'plataforma'],
    status: 'draft',
    publishedAt: null,
    views: 0,
    featured: false
  }
]

export default function BlogManagement() {
  const [posts, setPosts] = useState(mockPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  const handleToggleFeatured = (id: string) => {
    setPosts(posts.map(p => 
      p.id === id ? { ...p, featured: !p.featured } : p
    ))
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    }

    const labels = {
      draft: 'Rascunho',
      published: 'Publicado',
      scheduled: 'Agendado'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
        <Link
          href="/admin/blog/novo"
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Post</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Posts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Publicados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {posts.filter(p => p.status === 'published').length}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Rascunhos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {posts.filter(p => p.status === 'draft').length}
              </p>
            </div>
            <Edit className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {posts.reduce((acc, p) => acc + p.views, 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Todas Categorias</option>
            <option value="Educação">Educação</option>
            <option value="Tutorial">Tutorial</option>
            <option value="Novidades">Novidades</option>
            <option value="Segurança">Segurança</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Todos Status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="scheduled">Agendados</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Post
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Autor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {post.featuredImage ? (
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded mr-3">
                          <Image className="w-10 h-10 text-gray-500" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {post.title}
                          {post.featured && (
                            <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">★ Destaque</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {post.excerpt.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">{post.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-white">{post.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(post.status)}
                      {post.publishedAt && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.publishedAt).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {post.views.toLocaleString('pt-BR')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/blog/${post.id}/editar`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleToggleFeatured(post.id)}
                        className={`${
                          post.featured 
                            ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400' 
                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
                        }`}
                      >
                        <Tag className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}