export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">CSS Test Page</h1>
      <div className="bg-blue-600 p-4 rounded-lg mb-4">
        <p>This should have a blue background</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-red-600 p-4 rounded">Red Box</div>
        <div className="bg-green-600 p-4 rounded">Green Box</div>
      </div>
      <p className="mt-4 text-gray-400">
        If you can see colors and proper styling, Tailwind CSS is working!
      </p>
    </div>
  );
}