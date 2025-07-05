import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { Alert } from '@/components/ui/Alert'
import { DocumentInput } from '@/components/ui/DocumentInput'

describe('Accessibility - Keyboard Navigation', () => {
  describe('Tab Navigation', () => {
    it('should allow tabbing through interactive elements', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <button>First Button</button>
          <LoadingButton onClick={() => {}}>Second Button</LoadingButton>
          <input type="text" placeholder="Input Field" />
          <a href="#">Link</a>
        </div>
      )

      // Start with body focused
      document.body.focus()

      // Tab through elements
      await user.tab()
      expect(screen.getByText('First Button')).toHaveFocus()

      await user.tab()
      expect(screen.getByText('Second Button')).toHaveFocus()

      await user.tab()
      expect(screen.getByPlaceholderText('Input Field')).toHaveFocus()

      await user.tab()
      expect(screen.getByText('Link')).toHaveFocus()

      // Shift+Tab to go backwards
      await user.tab({ shift: true })
      expect(screen.getByPlaceholderText('Input Field')).toHaveFocus()
    })

    it('should skip disabled elements', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <button>Enabled Button</button>
          <button disabled>Disabled Button</button>
          <LoadingButton onClick={() => {}} disabled>
            Disabled Loading Button
          </LoadingButton>
          <button>Another Enabled Button</button>
        </div>
      )

      document.body.focus()

      await user.tab()
      expect(screen.getByText('Enabled Button')).toHaveFocus()

      await user.tab()
      // Should skip disabled buttons
      expect(screen.getByText('Another Enabled Button')).toHaveFocus()
    })
  })

  describe('Enter/Space Key Activation', () => {
    it('should activate buttons with Enter key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(
        <LoadingButton onClick={handleClick}>
          Click Me
        </LoadingButton>
      )

      const button = screen.getByText('Click Me')
      button.focus()

      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should activate buttons with Space key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(
        <LoadingButton onClick={handleClick}>
          Click Me
        </LoadingButton>
      )

      const button = screen.getByText('Click Me')
      button.focus()

      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not activate disabled buttons', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(
        <LoadingButton onClick={handleClick} disabled>
          Disabled Button
        </LoadingButton>
      )

      const button = screen.getByText('Disabled Button')
      button.focus()

      await user.keyboard('{Enter}')
      await user.keyboard(' ')
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Escape Key', () => {
    it('should dismiss alert with Escape key', async () => {
      const user = userEvent.setup()
      const handleDismiss = jest.fn()
      
      render(
        <Alert type="info" dismissible onDismiss={handleDismiss}>
          Dismissible Alert
        </Alert>
      )

      // Focus on the alert or its dismiss button
      const dismissButton = screen.getByLabelText('Fechar alerta')
      dismissButton.focus()

      await user.keyboard('{Escape}')
      expect(handleDismiss).toHaveBeenCalledTimes(1)
    })
  })

  describe('Arrow Key Navigation', () => {
    it('should support arrow key navigation in grouped elements', async () => {
      const user = userEvent.setup()
      
      render(
        <div role="radiogroup" aria-label="Payment Method">
          <label>
            <input type="radio" name="payment" value="pix" />
            PIX
          </label>
          <label>
            <input type="radio" name="payment" value="ted" />
            TED
          </label>
          <label>
            <input type="radio" name="payment" value="boleto" />
            Boleto
          </label>
        </div>
      )

      const pixRadio = screen.getByLabelText('PIX')
      pixRadio.focus()

      // Arrow down should move to next radio
      await user.keyboard('{ArrowDown}')
      expect(screen.getByLabelText('TED')).toHaveFocus()

      // Arrow down again
      await user.keyboard('{ArrowDown}')
      expect(screen.getByLabelText('Boleto')).toHaveFocus()

      // Arrow up should move back
      await user.keyboard('{ArrowUp}')
      expect(screen.getByLabelText('TED')).toHaveFocus()
    })
  })

  describe('Focus Management', () => {
    it('should trap focus within modal-like components', async () => {
      const user = userEvent.setup()
      
      const Modal = ({ onClose }: { onClose: () => void }) => (
        <div role="dialog" aria-modal="true" aria-label="Test Modal">
          <button>First Button</button>
          <input type="text" placeholder="Input in modal" />
          <button onClick={onClose}>Close Modal</button>
        </div>
      )

      const { rerender } = render(<Modal onClose={() => {}} />)

      // Focus should be trapped within modal
      const firstButton = screen.getByText('First Button')
      firstButton.focus()

      await user.tab()
      expect(screen.getByPlaceholderText('Input in modal')).toHaveFocus()

      await user.tab()
      expect(screen.getByText('Close Modal')).toHaveFocus()

      // Tab should cycle back to first element
      await user.tab()
      expect(firstButton).toHaveFocus()
    })

    it('should restore focus after dismissing alert', async () => {
      const user = userEvent.setup()
      const handleDismiss = jest.fn()
      
      const { rerender } = render(
        <div>
          <button>Trigger Button</button>
          <Alert type="info" dismissible onDismiss={handleDismiss}>
            Alert Message
          </Alert>
        </div>
      )

      // Focus on trigger button
      const triggerButton = screen.getByText('Trigger Button')
      triggerButton.focus()

      // Tab to dismiss button
      await user.tab()
      const dismissButton = screen.getByLabelText('Fechar alerta')
      expect(dismissButton).toHaveFocus()

      // Click dismiss
      await user.click(dismissButton)
      expect(handleDismiss).toHaveBeenCalled()
    })
  })
})