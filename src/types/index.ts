// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  email: string
  nombre?: string
  rol?: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

// ─── Docentes ────────────────────────────────────────────────────────────────

export type EstadoDocente = 'activo' | 'inactivo'

export const AREAS_DOCENTE = [
  'Matemáticas',
  'C. Sociales',
  'Biología',
  'Física',
  'Química',
  'Lenguaje',
  'Ed. Física',
  'Música',
  'Valores',
  'Artes Plásticas',
  'Psicología-Filosofía',
  'Técnica Tecnológica',
] as const

export type AreaDocente = typeof AREAS_DOCENTE[number]

export interface Docente {
  id: number
  nombre: string
  apellido: string
  email: string
  area: string
  telefono: string
  estado: EstadoDocente
  cursoIds: number[]
  createdAt: string
}

export type DocenteForm = Omit<Docente, 'id' | 'createdAt'>

// ─── Cursos ──────────────────────────────────────────────────────────────────

export const AÑOS_CURSO = ['1ro', '2do', '3ro', '4to', '5to', '6to'] as const
export const PARALELOS_CURSO = ['A', 'B', 'C', 'D', 'E'] as const

export type AñoCurso = typeof AÑOS_CURSO[number]
export type ParaleloCurso = typeof PARALELOS_CURSO[number]
export type TurnoCurso = 'Mañana' | 'Tarde' | 'Noche'
export type EstadoCurso = 'activo' | 'inactivo'

export interface Curso {
  id: number
  año: AñoCurso
  paralelo: ParaleloCurso
  turno: TurnoCurso
  cupo: number
  estado: EstadoCurso
  createdAt: string
}

export type CursoForm = Omit<Curso, 'id' | 'createdAt'>

/** Helper: devuelve "1ro A Sec", "2do B Sec", etc. */
export function cursoLabel(c: Pick<Curso, 'año' | 'paralelo'>) {
  return `${c.año} "${c.paralelo}" Sec`
}

// ─── Estudiantes ─────────────────────────────────────────────────────────────

export type EstadoEstudiante = 'activo' | 'inactivo'

export interface Estudiante {
  id: number
  nombre: string
  apellido: string
  email: string
  matricula: string
  cursoId: number
  estado: EstadoEstudiante
  createdAt: string
}

export type EstudianteForm = Omit<Estudiante, 'id' | 'createdAt'>
