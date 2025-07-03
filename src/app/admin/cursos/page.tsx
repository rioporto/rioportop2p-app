'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Clock,
  DollarSign,
  Award,
  BookOpen,
  Video,
  Star,
  MoreVertical
} from 'lucide-react'

interface Course {
  id: string
  title: string
  subtitle: string
  slug: string
  instructor: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // horas
  price: number
  status: 'draft' | 'published' | 'archived'
  enrolled: number
  rating: number
  ratingCount: number
  modules: number
  lessons: number
  featured: boolean
  thumbnail?: string
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introdução às Criptomoedas',
    subtitle: 'Aprenda os conceitos básicos do mundo crypto',
    slug: 'introducao-criptomoedas',
    instructor: 'Prof. João Silva',
    category: 'Criptomoedas',
    level: 'beginner',
    duration: 4.5,
    price: 0,
    status: 'published',
    enrolled: 1234,
    rating: 4.8,
    ratingCount: 256,
    modules: 5,
    lessons: 24,
    featured: true
  },
  {
    id: '2',
    title: 'Trading Avançado de Bitcoin',
    subtitle: 'Estratégias profissionais para maximizar lucros',
    slug: 'trading-avancado-bitcoin',
    instructor: 'Maria Santos',
    category: 'Trading',
    level: 'advanced',
    duration: 12,
    price: 297,
    status: 'published',
    enrolled: 456,
    rating: 4.6,
    ratingCount: 89,
    modules: 8,
    lessons: 42,
    featured: false
  },
  {
    id: '3',
    title: 'Segurança em Transações P2P',
    subtitle: 'Proteja seus investimentos em plataformas P2P',
    slug: 'seguranca-transacoes-p2p',
    instructor: 'Carlos Mendes',
    category: 'Segurança',
    level: 'intermediate',
    duration: 6,
    price: 147,
    status: 'draft',
    enrolled: 0,
    rating: 0,
    ratingCount: 0,
    modules: 4,
    lessons: 18,
    featured: false
  }
]

export default function CoursesManagement() {
  const [courses, setCourses] = useState(mockCourses)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este curso?')) {
      setCourses(courses.filter(c => c.id !== id))
    }
  }

  const handleToggleFeatured = (id: string) => {
    setCourses(courses.map(c => 
      c.id === id ? { ...c, featured: !c.featured } : c
    ))
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      published: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      archived: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }

    const labels = {
      draft: 'Rascunho',
      published: 'Publicado',
      archived: 'Arquivado'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getLevelBadge = (level: string) => {
    const styles = {
      beginner: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
    }

    const labels = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[level as keyof typeof styles]}`}>
        {labels[level as keyof typeof labels]}
      </span>
    )
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus
  })

  const totalRevenue = courses
    .filter(c => c.status === 'published')
    .reduce((acc, c) => acc + (c.price * c.enrolled), 0)

  const totalEnrolled = courses.reduce((acc, c) => acc + c.enrolled, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cursos</h1>
        <Link
          href="/admin/cursos/novo"
          className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Curso</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Cursos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{courses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Alunos Matriculados</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalEnrolled.toLocaleString('pt-BR')}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avaliação Média</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(courses.reduce((acc, c) => acc + c.rating, 0) / courses.filter(c => c.rating > 0).length || 0).toFixed(1)}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-400" />
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
                placeholder="Buscar cursos..."
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
            <option value="Criptomoedas">Criptomoedas</option>
            <option value="Trading">Trading</option>
            <option value="Segurança">Segurança</option>
            <option value="DeFi">DeFi</option>
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Todos Níveis</option>
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">Todos Status</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
            <option value="archived">Arquivados</option>
          </select>
        </div>
      </div>

      {/* Courses List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Instrutor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nível
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Alunos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 h-10 bg-gray-300 dark:bg-gray-600 rounded mr-3">
                        <Video className="w-16 h-10 text-gray-500 p-2" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.title}
                          {course.featured && (
                            <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">★ Destaque</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {course.modules} módulos • {course.lessons} aulas • {course.duration}h
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">{course.instructor}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getLevelBadge(course.level)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {course.price === 0 ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">Gratuito</span>
                      ) : (
                        `R$ ${course.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {course.enrolled.toLocaleString('pt-BR')}
                      </div>
                      {course.rating > 0 && (
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Star className="w-3 h-3 text-yellow-400 mr-1" />
                          {course.rating.toFixed(1)} ({course.ratingCount})
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/cursos/${course.id}`}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        href={`/admin/cursos/${course.id}/editar`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleToggleFeatured(course.id)}
                        className={`${
                          course.featured 
                            ? 'text-orange-600 hover:text-orange-900 dark:text-orange-400' 
                            : 'text-gray-400 hover:text-gray-600 dark:text-gray-500'
                        }`}
                      >
                        <Award className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
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