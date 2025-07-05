export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 right-0 z-[100] bg-white dark:bg-gray-900 p-2 text-center">
        <a
          href="#main-content"
          className="inline-block px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Pular para o conteúdo principal
        </a>
        <a
          href="#main-navigation"
          className="inline-block ml-2 px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Pular para a navegação
        </a>
      </div>
    </div>
  )
}