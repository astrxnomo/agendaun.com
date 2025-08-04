import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl px-6 text-center">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl dark:text-white">
            HorarioU
          </h1>
          <p className="mb-8 text-xl text-gray-600 md:text-2xl dark:text-gray-300">
            Organiza tu tiempo universitario de manera inteligente
          </p>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
            Gestiona tus horarios de clases, tareas y actividades académicas en
            una sola plataforma. Simplifica tu vida estudiantil con nuestro
            calendario inteligente.
          </p>
        </div>

        {/* Features Section */}
        <div className="mb-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              📅
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Calendario Inteligente
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Visualiza tus clases y actividades en diferentes vistas: diaria,
              semanal y mensual.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              📚
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Gestión de Tareas
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Organiza tus tareas y proyectos con fechas de entrega y
              recordatorios.
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              🎯
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
              Seguimiento de Progreso
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitorea tu progreso académico y mantente al día con tus
              objetivos.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-blue-600 px-8 py-4 text-lg text-white hover:bg-blue-700"
            >
              Ir al Dashboard
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
            Conocer más
          </Button>
        </div>
      </div>
    </div>
  )
}
