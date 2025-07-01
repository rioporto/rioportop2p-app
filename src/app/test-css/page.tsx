"use client";

export default function TestCSS() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white">CSS Test Page</h1>
        
        <div className="space-y-8">
          {/* Test Tailwind Classes */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Tailwind CSS Classes</h2>
            <p className="mb-4">If you can see styled elements below, Tailwind is working:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-600 text-white p-4 rounded-lg">
                Blue Background (Tailwind)
              </div>
              <div className="bg-green-600 text-white p-4 rounded-lg">
                Green Background (Tailwind)
              </div>
              <div className="bg-red-600 text-white p-4 rounded-lg">
                Red Background (Tailwind)
              </div>
              <div className="bg-yellow-600 text-white p-4 rounded-lg">
                Yellow Background (Tailwind)
              </div>
            </div>
          </section>

          {/* Test Custom Classes */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Custom Component Classes</h2>
            <div className="space-y-4">
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-secondary">Secondary Button</button>
              <button className="btn btn-danger">Danger Button</button>
            </div>
          </section>

          {/* Test Form Styles */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
            <form className="space-y-4">
              <div>
                <label className="form-label">Input Field</label>
                <input type="text" className="form-input" placeholder="Type something..." />
              </div>
              <div>
                <label className="form-label">Textarea</label>
                <textarea className="form-input" rows={3} placeholder="Enter text..." />
              </div>
              <div>
                <label className="form-label">Select</label>
                <select className="form-input">
                  <option>Option 1</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            </form>
          </section>

          {/* Test Animations */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Animations</h2>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full animate-spin-slow" />
              <div className="w-16 h-16 bg-green-500 rounded animate-fade-in" />
              <div className="w-16 h-16 bg-purple-500 rounded animate-pulse" />
            </div>
          </section>

          {/* Test Typography */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Typography</h2>
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <h3 className="text-2xl font-semibold">Heading 3</h3>
            <h4 className="text-xl font-semibold">Heading 4</h4>
            <h5 className="text-lg font-medium">Heading 5</h5>
            <h6 className="text-base font-medium">Heading 6</h6>
            <p className="mt-4">Regular paragraph text with <a href="#" className="text-blue-400 hover:text-blue-300">a link</a>.</p>
          </section>

          {/* Test Dark Mode */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">Dark Mode Check</h2>
            <div className="bg-gray-800 p-4 rounded">
              <p>Background: Should be dark gray (#1f2937)</p>
              <p>Text: Should be light gray (#f3f4f6)</p>
              <p>Body: Should have dark background (#111827)</p>
            </div>
          </section>

          {/* CSS Status */}
          <section className="card p-6">
            <h2 className="text-2xl font-semibold mb-4">CSS Status</h2>
            <div className="space-y-2">
              <p>✅ If all elements above are styled correctly, CSS is working!</p>
              <p>✅ Dark theme applied</p>
              <p>✅ Responsive grid layout</p>
              <p>✅ Custom component classes</p>
              <p>✅ Form styling</p>
              <p>✅ Animations (spinning, fading, pulsing)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}