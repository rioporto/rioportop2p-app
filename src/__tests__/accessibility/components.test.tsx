import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { Alert } from '@/components/ui/Alert'
import { DocumentInput } from '@/components/ui/DocumentInput'
import { SkipLinks } from '@/components/ui/SkipLinks'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Accessibility - Component Tests', () => {
  describe('LoadingButton', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <LoadingButton onClick={() => {}}>
          Click me
        </LoadingButton>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no violations when loading', async () => {
      const { container } = render(
        <LoadingButton onClick={() => {}} loading loadingText="Loading...">
          Click me
        </LoadingButton>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper aria attributes when disabled', () => {
      const { getByRole } = render(
        <LoadingButton onClick={() => {}} disabled>
          Disabled Button
        </LoadingButton>
      )
      const button = getByRole('button')
      expect(button).toHaveAttribute('disabled')
      expect(button).toHaveAttribute('aria-disabled', 'true')
    })
  })

  describe('Alert', () => {
    it('should have no accessibility violations for info alert', async () => {
      const { container } = render(
        <Alert type="info" title="Information">
          This is an info message
        </Alert>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have proper role for different alert types', () => {
      const { rerender, getByRole } = render(
        <Alert type="error" title="Error">
          Error message
        </Alert>
      )
      expect(getByRole('alert')).toBeInTheDocument()

      rerender(
        <Alert type="warning" title="Warning">
          Warning message
        </Alert>
      )
      expect(getByRole('alert')).toBeInTheDocument()
    })

    it('should have dismiss button with proper label', () => {
      const { getByLabelText } = render(
        <Alert type="info" dismissible onDismiss={() => {}}>
          Dismissible alert
        </Alert>
      )
      expect(getByLabelText('Fechar alerta')).toBeInTheDocument()
    })
  })

  describe('DocumentInput', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <DocumentInput
          value=""
          onChange={() => {}}
          label="CPF/CNPJ"
          placeholder="Digite seu documento"
        />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should associate label with input', () => {
      const { getByLabelText } = render(
        <DocumentInput
          value=""
          onChange={() => {}}
          label="Documento"
          placeholder="Digite seu documento"
        />
      )
      expect(getByLabelText('Documento')).toBeInTheDocument()
    })

    it('should have proper aria attributes for error state', () => {
      const { getByRole } = render(
        <DocumentInput
          value="123"
          onChange={() => {}}
          label="CPF"
          error="CPF inválido"
        />
      )
      const input = getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby')
    })
  })

  describe('SkipLinks', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<SkipLinks />)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should contain navigation skip links', () => {
      const { getByText } = render(<SkipLinks />)
      expect(getByText('Pular para o conteúdo principal')).toBeInTheDocument()
      expect(getByText('Pular para a navegação')).toBeInTheDocument()
    })

    it('should have proper href attributes', () => {
      const { getByText } = render(<SkipLinks />)
      const mainLink = getByText('Pular para o conteúdo principal')
      const navLink = getByText('Pular para a navegação')
      
      expect(mainLink).toHaveAttribute('href', '#main-content')
      expect(navLink).toHaveAttribute('href', '#main-navigation')
    })
  })
})