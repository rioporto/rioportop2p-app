import Image from 'next/image'
import { useState } from 'react'

interface AccessibleImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  // Additional accessibility props
  longDescription?: string
  decorative?: boolean
  caption?: string
}

export function AccessibleImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  longDescription,
  decorative = false,
  caption,
}: AccessibleImageProps) {
  const [imageError, setImageError] = useState(false)
  
  // For decorative images, use empty alt text
  const altText = decorative ? '' : alt
  
  // Generate a unique ID for aria-describedby if long description is provided
  const descriptionId = longDescription ? `img-desc-${src.replace(/[^a-zA-Z0-9]/g, '-')}` : undefined

  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}
        style={fill ? undefined : { width, height }}
        role={decorative ? 'presentation' : undefined}
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Imagem não disponível
        </span>
      </div>
    )
  }

  return (
    <figure className={caption ? 'relative' : undefined}>
      <Image
        src={src}
        alt={altText}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={className}
        priority={priority}
        fill={fill}
        sizes={sizes}
        onError={() => setImageError(true)}
        aria-describedby={descriptionId}
        role={decorative ? 'presentation' : undefined}
      />
      
      {/* Hidden long description for screen readers */}
      {longDescription && (
        <span id={descriptionId} className="sr-only">
          {longDescription}
        </span>
      )}
      
      {/* Visible caption */}
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Usage examples in comments:
/*
// Regular image with alt text
<AccessibleImage
  src="/images/bitcoin-logo.png"
  alt="Logo do Bitcoin"
  width={200}
  height={200}
/>

// Image with long description for complex graphics
<AccessibleImage
  src="/images/trading-chart.png"
  alt="Gráfico de trading"
  longDescription="Gráfico mostrando o preço do Bitcoin nas últimas 24 horas, com uma tendência de alta de 5.3%, volume de negociação de $2.5 bilhões"
  width={600}
  height={400}
/>

// Decorative image (no alt text needed)
<AccessibleImage
  src="/images/decorative-pattern.png"
  alt=""
  decorative={true}
  width={100}
  height={100}
/>

// Image with caption
<AccessibleImage
  src="/images/security-features.png"
  alt="Recursos de segurança da plataforma"
  caption="Nossa plataforma utiliza criptografia de ponta a ponta"
  width={400}
  height={300}
/>
*/