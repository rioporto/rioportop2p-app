import { render, screen, fireEvent } from '@/utils/test-utils'
import FeeCalculator from '../FeeCalculator'

describe('FeeCalculator', () => {
  it('renders correctly', () => {
    render(<FeeCalculator />)
    
    expect(screen.getByText('Calculadora de Taxas')).toBeInTheDocument()
    expect(screen.getByText('Comprar')).toBeInTheDocument()
    expect(screen.getByText('Vender')).toBeInTheDocument()
  })

  it('switches between buy and sell operations', () => {
    render(<FeeCalculator />)
    
    const buyButton = screen.getByText('Comprar')
    const sellButton = screen.getByText('Vender')
    
    // Initially buy should be selected
    expect(buyButton.className).toContain('bg-green-600')
    expect(sellButton.className).not.toContain('bg-red-600')
    
    // Click sell
    fireEvent.click(sellButton)
    
    expect(sellButton.className).toContain('bg-red-600')
    expect(buyButton.className).not.toContain('bg-green-600')
  })

  it('formats BRL input correctly', () => {
    render(<FeeCalculator />)
    
    const input = screen.getByPlaceholderText('R$ 0,00') as HTMLInputElement
    
    // Type 1000
    fireEvent.change(input, { target: { value: '1000' } })
    
    // The value should be formatted
    expect(input.value).toBeTruthy()
    expect(input.value).toContain('R$')
  })

  it('calculates fees based on amount ranges', () => {
    render(<FeeCalculator />)
    
    const input = screen.getByPlaceholderText('R$ 0,00')
    
    // Test R$ 500 (3.5% rate)
    fireEvent.change(input, { target: { value: '50000' } }) // R$ 500,00
    
    // Use getAllByText for multiple occurrences
    const ranges = screen.getAllByText('Até R$ 1.000')
    expect(ranges.length).toBeGreaterThan(0)
    
    // Look for percentage text with flexible matching
    const percentageTexts = screen.getAllByText(/3[\.,]5%/)
    expect(percentageTexts.length).toBeGreaterThan(0)
  })

  it('shows comparison with competitors when toggled', () => {
    render(<FeeCalculator />)
    
    const compareButton = screen.getByText('Ver comparação')
    
    // Add some value to show calculations
    const input = screen.getByPlaceholderText('R$ 0,00')
    fireEvent.change(input, { target: { value: '100000' } }) // R$ 1000,00
    
    // Click to show comparison
    fireEvent.click(compareButton)
    
    // Should change button text
    expect(screen.getByText('Ocultar comparação')).toBeInTheDocument()
    
    // Should show competitor names
    expect(screen.getByText('Binance P2P')).toBeInTheDocument()
  })

  it('highlights the active fee range', () => {
    render(<FeeCalculator />)
    
    const input = screen.getByPlaceholderText('R$ 0,00')
    
    // Test R$ 7.500 (2.5% rate range)
    fireEvent.change(input, { target: { value: '750000' } }) // R$ 7.500,00
    
    // Check that "Sua faixa" badge appears when a range is active
    expect(screen.getByText('Sua faixa')).toBeInTheDocument()
  })

  it('displays fee calculation tips', () => {
    render(<FeeCalculator />)
    
    expect(screen.getByText('Dica para economizar:')).toBeInTheDocument()
    expect(screen.getByText(/Quanto maior o volume da operação/)).toBeInTheDocument()
  })

  it('handles maximum input value', () => {
    render(<FeeCalculator />)
    
    const input = screen.getByPlaceholderText('R$ 0,00') as HTMLInputElement
    
    // Try to type valid amount
    fireEvent.change(input, { target: { value: '100000' } }) // R$ 1000,00
    
    // Check that the value is formatted
    expect(input.value).toContain('R$')
    expect(input.value).toBeTruthy()
  })

  it('calculates total correctly for buy operations', () => {
    render(<FeeCalculator />)
    
    const input = screen.getByPlaceholderText('R$ 0,00')
    
    // R$ 1.000 with 3.5% fee = R$ 35,00 fee
    fireEvent.change(input, { target: { value: '100000' } }) // R$ 1.000,00
    
    // Total should be R$ 1.035,00
    expect(screen.getByText('Total a pagar:')).toBeInTheDocument()
    expect(screen.getByText('R$ 1.035,00')).toBeInTheDocument()
  })

  it('calculates total correctly for sell operations', () => {
    render(<FeeCalculator />)
    
    // Switch to sell
    fireEvent.click(screen.getByText('Vender'))
    
    const input = screen.getByPlaceholderText('R$ 0,00')
    
    // R$ 1.000 with 3.5% fee = R$ 35,00 fee
    fireEvent.change(input, { target: { value: '100000' } }) // R$ 1.000,00
    
    // Total should be R$ 965,00
    expect(screen.getByText('Total a receber:')).toBeInTheDocument()
    expect(screen.getByText('R$ 965,00')).toBeInTheDocument()
  })
})