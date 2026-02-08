import { Lock, Shield, CheckCircle } from 'lucide-react'

export function Security() {
  return (
    <section id="security" className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Your Security is Our Priority
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We use the same security measures as the world's largest banks to keep your money safe.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <Lock className="text-primary-600 mr-4 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">256-bit Encryption</h3>
                  <p className="text-gray-600">Military-grade encryption protects all your data</p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="text-primary-600 mr-4 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Regulatory Compliance</h3>
                  <p className="text-gray-600">Fully licensed and regulated in multiple jurisdictions</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-primary-600 mr-4 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">2FA Authentication</h3>
                  <p className="text-gray-600">Two-factor authentication keeps unauthorized users out</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-12 text-white">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold">$10B+</div>
                  <div className="text-primary-100">Transferred Securely</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div className="text-3xl font-bold">5M+</div>
                  <div className="text-primary-100">Trusted Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}