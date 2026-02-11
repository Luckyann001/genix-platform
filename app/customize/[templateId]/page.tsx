import { Palette, Type, Image, Layout, Download, Save } from 'lucide-react'

export const metadata = {
  title: 'Customize Template | Genix',
  description: 'Customize your purchased template',
}

export default function CustomizePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-bold">Template Customizer</h1>
              <p className="text-sm text-gray-600">SaaS Starter Pro</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-secondary flex items-center gap-2">
                <Save size={16} />
                Save Progress
              </button>
              <button className="btn btn-primary flex items-center gap-2">
                <Download size={16} />
                Download Code
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-[350px,1fr] gap-8">
          {/* Customization Panel */}
          <div className="space-y-6">
            {/* Colors */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Palette className="text-purple-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold">Brand Colors</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      defaultValue="#0066FF" 
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      defaultValue="#0066FF" 
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      defaultValue="#9333EA" 
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      defaultValue="#9333EA" 
                      className="input flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Background</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      defaultValue="#FFFFFF" 
                      className="h-10 w-20 rounded cursor-pointer"
                    />
                    <input 
                      type="text" 
                      defaultValue="#FFFFFF" 
                      className="input flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Type className="text-blue-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold">Typography</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Heading Font</label>
                  <select className="input">
                    <option>Inter (Default)</option>
                    <option>Poppins</option>
                    <option>Montserrat</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Body Font</label>
                  <select className="input">
                    <option>Inter (Default)</option>
                    <option>Lato</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Type className="text-green-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold">Content</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Site Title</label>
                  <input 
                    type="text" 
                    defaultValue="Your SaaS Name" 
                    className="input"
                    placeholder="Enter your site title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tagline</label>
                  <input 
                    type="text" 
                    defaultValue="Build better products faster" 
                    className="input"
                    placeholder="Enter your tagline"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hero Description</label>
                  <textarea 
                    className="input min-h-[100px]"
                    defaultValue="Transform your workflow with our powerful SaaS platform"
                    placeholder="Enter hero description"
                  />
                </div>
              </div>
            </div>

            {/* Logo & Images */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Image className="text-orange-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold">Logo & Images</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Image className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-600 mb-2">Upload your logo</p>
                    <button className="btn btn-secondary text-sm">
                      Choose File
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Favicon</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Upload favicon (32x32)</p>
                    <button className="btn btn-secondary text-sm">
                      Choose File
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Layout */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Layout className="text-pink-600" size={20} />
                </div>
                <h2 className="text-lg font-semibold">Layout</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sections</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Hero Section</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Features</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Pricing</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Testimonials</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">FAQ</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">CTA Section</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Header Style</label>
                  <select className="input">
                    <option>Transparent</option>
                    <option>Solid</option>
                    <option>Sticky</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Live Preview</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-gray-100 rounded">Desktop</button>
                <button className="px-3 py-1 text-sm bg-white border rounded">Tablet</button>
                <button className="px-3 py-1 text-sm bg-white border rounded">Mobile</button>
              </div>
            </div>

            {/* Preview iframe or component */}
            <div className="aspect-[16/10] bg-gray-100 rounded-lg border-2 border-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Layout size={48} className="mx-auto mb-4" />
                <p className="text-lg font-semibold">Live Preview</p>
                <p className="text-sm">Changes will appear here in real-time</p>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>💡 Tip:</strong> All changes are automatically saved. You can come back 
                anytime and continue customizing. When you're ready, download your customized code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}