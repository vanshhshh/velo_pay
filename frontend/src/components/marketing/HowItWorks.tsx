export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Add Money',
      description: 'Load your account using your debit card, credit card, or bank transfer'
    },
    {
      number: 2,
      title: 'Choose Recipient',
      description: "Enter recipient's email or bank details. We'll handle the rest automatically"
    },
    {
      number: 3,
      title: 'Money Delivered',
      description: 'Your recipient receives the money instantly. Track it in real-time'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Send money in three simple steps
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}