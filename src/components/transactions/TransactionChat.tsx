import { useState, useEffect, useRef } from 'react'
import { Send, MessageCircle, Paperclip, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Message {
  id: string
  transaction_id: string
  sender_id: string
  content: string
  attachment_url?: string
  attachment_type?: string
  created_at: string
}

interface TransactionChatProps {
  transactionId: string
  currentUserId: string
  otherPartyName: string
}

export default function TransactionChat({ 
  transactionId, 
  currentUserId, 
  otherPartyName 
}: TransactionChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadMessages()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`chat:${transactionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'transaction_messages',
        filter: `transaction_id=eq.${transactionId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
        scrollToBottom()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [transactionId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    try {
      // In a real app, this would fetch from the API
      // For now, we'll use mock data
      const mockMessages: Message[] = [
        {
          id: '1',
          transaction_id: transactionId,
          sender_id: currentUserId,
          content: 'Olá! Vou realizar o pagamento agora.',
          created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          transaction_id: transactionId,
          sender_id: 'other-user-id',
          content: 'Ok! Assim que receber, libero as crypto.',
          created_at: new Date(Date.now() - 9 * 60 * 1000).toISOString()
        }
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch(`/api/transactions/${transactionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      })

      if (!response.ok) throw new Error('Failed to send message')

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, this would upload the file and send as attachment
    console.log('File selected:', file.name)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col h-[500px]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="font-medium text-gray-900 dark:text-white">
            Chat com {otherPartyName}
          </h3>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">Nenhuma mensagem ainda.</p>
            <p className="text-xs mt-1">Inicie uma conversa!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.sender_id === currentUserId
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[70%] px-4 py-2 rounded-lg
                    ${isOwn 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                    }
                  `}
                >
                  {message.attachment_url && (
                    <div className="mb-2">
                      {message.attachment_type?.startsWith('image/') ? (
                        <img 
                          src={message.attachment_url} 
                          alt="Attachment"
                          className="rounded max-w-full h-auto"
                        />
                      ) : (
                        <a 
                          href={message.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-sm underline"
                        >
                          <Paperclip className="h-4 w-4" />
                          <span>Anexo</span>
                        </a>
                      )}
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-orange-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            className={`
              p-2 rounded-lg transition-colors
              ${newMessage.trim() && !sending
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}