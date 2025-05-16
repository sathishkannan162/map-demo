"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, MapPin, Phone, Clock, ChevronDown, Users, Activity, Heart, Brain, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import HospitalMap from "@/components/hospital-map"

export default function ClinicHomePage() {
  const [showNavigation, setShowNavigation] = useState(false)

  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            <h1 className="text-xl font-semibold text-gray-900">Medical Clinic</h1>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <a href="#services" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Services
            </a>
            <a href="#doctors" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Doctors
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Contact
            </a>
            <button
              onClick={() => setShowNavigation(true)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Hospital Navigation
            </button>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="tel:+1234567890"
              className="hidden items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 md:flex"
            >
              <Phone className="h-4 w-4" />
              (123) 456-7890
            </a>
            <Button className="bg-blue-600 hover:bg-blue-700">Book Appointment</Button>
          </div>
        </div>
      </header>

      {showNavigation ? (
        <div className="flex-1">
          <div className="bg-blue-50 p-4">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Hospital Navigation System</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowNavigation(false)}
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  Back to Clinic
                </Button>
              </div>
            </div>
          </div>
          <HospitalMap />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 md:grid-cols-2">
                <div className="flex flex-col justify-center">
                  <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
                    Your Health Is Our <span className="text-blue-600">Priority</span>
                  </h1>
                  <p className="mb-8 text-lg text-gray-600">
                    Providing comprehensive healthcare services with cutting-edge technology and compassionate care.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button className="bg-blue-600 px-6 py-3 text-base hover:bg-blue-700">Book an Appointment</Button>
                    <Button
                      variant="outline"
                      className="border-blue-500 px-6 py-3 text-base text-blue-600 hover:bg-blue-50"
                      onClick={() => setShowNavigation(true)}
                    >
                      Hospital Navigation <MapPin className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-green-100 p-2">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm text-gray-600">Open 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-600">Expert Doctors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-purple-100 p-2">
                        <Activity className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-600">Advanced Technology</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <img
                    src="/placeholder.svg?height=400&width=500"
                    alt="Medical professionals"
                    className="rounded-lg shadow-lg"
                    width={500}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="bg-white px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-2 text-3xl font-bold text-gray-900">Our Services</h2>
                <p className="mx-auto max-w-2xl text-gray-600">
                  We offer a wide range of medical services to meet your healthcare needs.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <ServiceCard
                  icon={<Heart className="h-6 w-6 text-red-500" />}
                  title="Cardiology"
                  description="Comprehensive heart care with advanced diagnostic and treatment options."
                />
                <ServiceCard
                  icon={<Brain className="h-6 w-6 text-purple-500" />}
                  title="Neurology"
                  description="Expert care for conditions affecting the brain, spine, and nervous system."
                />
                <ServiceCard
                  icon={<Activity className="h-6 w-6 text-blue-500" />}
                  title="Emergency Care"
                  description="24/7 emergency services with rapid response and expert treatment."
                />
                <ServiceCard
                  icon={<Stethoscope className="h-6 w-6 text-green-500" />}
                  title="Primary Care"
                  description="Routine check-ups, preventive care, and management of chronic conditions."
                />
                <ServiceCard
                  icon={<Users className="h-6 w-6 text-orange-500" />}
                  title="Pediatrics"
                  description="Specialized healthcare for infants, children, and adolescents."
                />
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-6 text-center">
                  <Button
                    variant="ghost"
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => setShowNavigation(true)}
                  >
                    View Hospital Map <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">Find your way around our facility</p>
                </div>
              </div>
            </div>
          </section>

          {/* Doctors Section */}
          <section id="doctors" className="bg-gray-50 px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="mb-2 text-3xl font-bold text-gray-900">Our Doctors</h2>
                <p className="mx-auto max-w-2xl text-gray-600">
                  Meet our team of experienced healthcare professionals.
                </p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <DoctorCard
                  name="Dr. Sarah Johnson"
                  specialty="Cardiology"
                  image="/placeholder.svg?height=300&width=300"
                />
                <DoctorCard
                  name="Dr. Michael Chen"
                  specialty="Neurology"
                  image="/placeholder.svg?height=300&width=300"
                />
                <DoctorCard
                  name="Dr. Emily Rodriguez"
                  specialty="Pediatrics"
                  image="/placeholder.svg?height=300&width=300"
                />
                <DoctorCard
                  name="Dr. James Wilson"
                  specialty="Emergency Medicine"
                  image="/placeholder.svg?height=300&width=300"
                />
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="bg-white px-4 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 md:grid-cols-2">
                <div>
                  <h2 className="mb-6 text-3xl font-bold text-gray-900">Contact Us</h2>
                  <p className="mb-8 text-gray-600">
                    Have questions or need to schedule an appointment? Contact us using the information below.
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-blue-100 p-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Address</h3>
                        <p className="text-gray-600">123 Medical Center Drive, Healthville, CA 90210</p>
                        <button
                          className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                          onClick={() => setShowNavigation(true)}
                        >
                          View on Map
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-blue-100 p-3">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Phone</h3>
                        <p className="text-gray-600">(123) 456-7890</p>
                        <p className="text-gray-600">Emergency: (123) 456-9999</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-blue-100 p-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 8:00 AM - 8:00 PM</p>
                        <p className="text-gray-600">Saturday: 9:00 AM - 5:00 PM</p>
                        <p className="text-gray-600">Sunday: 10:00 AM - 4:00 PM</p>
                        <p className="text-gray-600">Emergency Care: 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-medium text-gray-900">Send us a message</h3>
                  <form className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Subject"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Your message"
                      ></textarea>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Send Message</Button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="bg-gray-50 px-4 py-16">
            <div className="mx-auto max-w-3xl">
              <div className="mb-12 text-center">
                <h2 className="mb-2 text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
                <p className="text-gray-600">Find answers to common questions about our services and facilities.</p>
              </div>
              <div className="space-y-4">
                <FaqItem
                  question="How do I schedule an appointment?"
                  answer="You can schedule an appointment by calling our office at (123) 456-7890, using our online booking system, or visiting our facility in person."
                />
                <FaqItem
                  question="What insurance plans do you accept?"
                  answer="We accept most major insurance plans including Medicare, Medicaid, Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare. Please contact our office for specific information about your plan."
                />
                <FaqItem
                  question="How can I find my way around the hospital?"
                  answer="We offer an interactive navigation system to help you find your way around our facility. Click on the 'Hospital Navigation' button at the top of the page to access this feature."
                />
                <FaqItem
                  question="What should I bring to my first appointment?"
                  answer="Please bring your insurance card, photo ID, list of current medications, medical records if available, and any referral forms if required by your insurance."
                />
                <FaqItem
                  question="Do you offer telehealth services?"
                  answer="Yes, we offer telehealth services for certain types of appointments. Please call our office to determine if your visit is eligible for telehealth."
                />
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-blue-600 px-4 py-16 text-white">
            <div className="mx-auto max-w-7xl text-center">
              <h2 className="mb-4 text-3xl font-bold">Ready to prioritize your health?</h2>
              <p className="mb-8 text-lg text-blue-100">
                Schedule an appointment today and take the first step towards better health.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button className="bg-white px-6 py-3 text-base text-blue-600 hover:bg-blue-50">
                  Book an Appointment
                </Button>
                <Button
                  variant="outline"
                  className="border-white px-6 py-3 text-base text-white hover:bg-blue-700"
                  onClick={() => setShowNavigation(true)}
                >
                  Explore Our Facility <MapPin className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 px-4 py-12 text-gray-300">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 md:grid-cols-4">
                <div>
                  <div className="mb-4 flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-500" />
                    <h3 className="text-xl font-semibold text-white">Medical Clinic</h3>
                  </div>
                  <p className="mb-4 text-gray-400">
                    Providing quality healthcare services with compassion and expertise.
                  </p>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="hover:text-white">
                        Home
                      </a>
                    </li>
                    <li>
                      <a href="#services" className="hover:text-white">
                        Services
                      </a>
                    </li>
                    <li>
                      <a href="#doctors" className="hover:text-white">
                        Doctors
                      </a>
                    </li>
                    <li>
                      <a href="#contact" className="hover:text-white">
                        Contact
                      </a>
                    </li>
                    <li>
                      <button onClick={() => setShowNavigation(true)} className="hover:text-white">
                        Hospital Navigation
                      </button>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">Services</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="hover:text-white">
                        Cardiology
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Neurology
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Pediatrics
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Emergency Care
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-white">
                        Primary Care
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-white">Contact</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <MapPin className="mt-1 h-4 w-4 shrink-0" />
                      <span>123 Medical Center Drive, Healthville, CA 90210</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0" />
                      <span>(123) 456-7890</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span>Open 24/7 for Emergency</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 border-t border-gray-800 pt-8 text-center">
                <p className="text-sm text-gray-400">
                  &copy; {new Date().getFullYear()} Medical Clinic. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </>
      )}
    </main>
  )
}

// Service Card Component
function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">{icon}</div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

// Doctor Card Component
function DoctorCard({ name, specialty, image }: { name: string; specialty: string; image: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <img src={image || "/placeholder.svg"} alt={name} className="h-64 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{name}</h3>
        <p className="text-blue-600">{specialty}</p>
        <button className="mt-2 text-sm font-medium text-gray-600 hover:text-blue-600">View Profile</button>
      </div>
    </div>
  )
}

// FAQ Item Component
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        className="flex w-full items-center justify-between p-4 text-left font-medium text-gray-900 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="border-t border-gray-200 p-4">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  )
}
