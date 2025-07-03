import { useState, useEffect } from 'react'
import { Timer, AlertCircle } from 'lucide-react'

interface CountdownTimerProps {
  deadline: string
  onExpire?: () => void
}

export default function CountdownTimer({ deadline, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number
    minutes: number
    seconds: number
    expired: boolean
  }>({ hours: 0, minutes: 0, seconds: 0, expired: false })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const deadlineTime = new Date(deadline).getTime()
      const difference = deadlineTime - now

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true })
        if (onExpire) onExpire()
        return false
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds, expired: false })
      return true
    }

    // Calculate immediately
    const shouldContinue = calculateTimeLeft()

    // Set up interval if not expired
    if (shouldContinue) {
      const interval = setInterval(() => {
        const shouldContinue = calculateTimeLeft()
        if (!shouldContinue) {
          clearInterval(interval)
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [deadline, onExpire])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  const getTimeColor = () => {
    if (timeLeft.expired) return 'text-red-600 dark:text-red-400'
    if (timeLeft.hours === 0 && timeLeft.minutes < 5) return 'text-red-600 dark:text-red-400'
    if (timeLeft.hours === 0 && timeLeft.minutes < 15) return 'text-orange-600 dark:text-orange-400'
    return 'text-green-600 dark:text-green-400'
  }

  const getBackgroundColor = () => {
    if (timeLeft.expired) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    if (timeLeft.hours === 0 && timeLeft.minutes < 5) return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    if (timeLeft.hours === 0 && timeLeft.minutes < 15) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
    return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
  }

  return (
    <div className={`border-b ${getBackgroundColor()}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {timeLeft.expired ? (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            ) : (
              <Timer className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {timeLeft.expired ? 'Prazo de pagamento expirado' : 'Prazo para pagamento:'}
            </span>
          </div>
          
          {!timeLeft.expired && (
            <div className={`text-2xl font-mono font-bold ${getTimeColor()}`}>
              {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
            </div>
          )}
        </div>
        
        {!timeLeft.expired && timeLeft.hours === 0 && timeLeft.minutes < 15 && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Atenção: O tempo está acabando. Complete o pagamento o quanto antes.
          </p>
        )}
      </div>
    </div>
  )
}