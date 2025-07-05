'use client'

import { motion } from 'framer-motion'
import { useAnimationVariants, useTransition } from '@/hooks/useAnimation'
import { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function AnimatedCard({ children, className = '', delay = 0 }: AnimatedCardProps) {
  const variants = useAnimationVariants({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  })

  const transition = useTransition({
    duration: 0.5,
    delay,
    ease: 'easeOut'
  })

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Example usage:
// <AnimatedCard delay={0.1} className="bg-white p-6 rounded-lg shadow">
//   <h2>Card Title</h2>
//   <p>Card content...</p>
// </AnimatedCard>