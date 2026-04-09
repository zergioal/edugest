<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="/logo1.png" alt="Logo" class="auth-logo-img" />
        <div>
          <div class="auth-logo-title">Colegio Pio XII</div>
          <div class="auth-logo-sub">Plataforma Académica</div>
        </div>
      </div>

      <h2 class="auth-heading">Crear cuenta</h2>
      <p class="auth-sub">Completa el formulario para registrarte</p>

      <div v-if="error" class="auth-alert auth-alert--danger">
        <i class="bi bi-exclamation-circle-fill me-2"></i>{{ error }}
      </div>

      <form @submit.prevent="handleRegister">
        <div class="auth-field">
          <label class="auth-label">Nombre</label>
          <div class="auth-input-wrap">
            <i class="bi bi-person auth-input-icon"></i>
            <input
              v-model="form.nombre"
              type="text"
              class="auth-input"
              placeholder="Tu nombre completo"
              required
            />
          </div>
        </div>

        <div class="auth-field">
          <label class="auth-label">Correo electrónico</label>
          <div class="auth-input-wrap">
            <i class="bi bi-envelope auth-input-icon"></i>
            <input
              v-model="form.email"
              type="email"
              class="auth-input"
              placeholder="usuario@ejemplo.com"
              required
              autocomplete="email"
            />
          </div>
        </div>

        <div class="auth-field">
          <label class="auth-label">Contraseña</label>
          <div class="auth-input-wrap">
            <i class="bi bi-lock auth-input-icon"></i>
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              class="auth-input"
              placeholder="Mínimo 6 caracteres"
              required
              minlength="6"
              autocomplete="new-password"
            />
            <button type="button" class="auth-eye" @click="showPass = !showPass">
              <i :class="showPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="auth-field">
          <label class="auth-label">Confirmar contraseña</label>
          <div class="auth-input-wrap">
            <i class="bi bi-lock-fill auth-input-icon"></i>
            <input
              v-model="form.confirm"
              :type="showPass ? 'text' : 'password'"
              class="auth-input"
              placeholder="Repite tu contraseña"
              required
              autocomplete="new-password"
            />
          </div>
          <p v-if="form.confirm && form.password !== form.confirm" class="auth-hint-error">
            Las contraseñas no coinciden
          </p>
        </div>

        <button
          type="submit"
          class="btn-auth"
          :disabled="loading || form.password !== form.confirm"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
          <i v-else class="bi bi-person-plus me-2"></i>
          {{ loading ? 'Registrando...' : 'Crear cuenta' }}
        </button>
      </form>

      <div class="auth-footer">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="auth-link">Inicia sesión</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { authService } from '@/services/authService'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { setAuth } = useAuth()

const form = reactive({ nombre: '', email: '', password: '', confirm: '' })
const loading = ref(false)
const error = ref('')
const showPass = ref(false)

async function handleRegister() {
  if (form.password !== form.confirm) return
  loading.value = true
  error.value = ''
  try {
    const { accessToken, user } = await authService.register(form.email, form.password)
    setAuth(accessToken, user)
    router.push('/')
  } catch {
    error.value = 'No se pudo crear la cuenta. El email puede estar ya registrado.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c6e 0%, #2B5494 50%, #3d6cb5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.auth-card {
  background: #fff;
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 1.75rem;
  justify-content: center;
}
.auth-logo-img {
  height: 72px;
  width: auto;
  object-fit: contain;
}
.auth-logo-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #2B5494;
  line-height: 1.1;
}
.auth-logo-sub {
  font-size: 0.72rem;
  color: #6B7280;
  font-weight: 500;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.auth-heading {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0 0 0.35rem;
  text-align: center;
}
.auth-sub {
  font-size: 0.875rem;
  color: #6B7280;
  margin: 0 0 1.5rem;
  text-align: center;
}

.auth-alert {
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}
.auth-alert--danger {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
}

.auth-field { margin-bottom: 1rem; }
.auth-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
}
.auth-input-wrap { position: relative; }
.auth-input-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9CA3AF;
  font-size: 0.95rem;
}
.auth-input {
  width: 100%;
  padding: 0.65rem 2.5rem 0.65rem 2.5rem;
  border: 1.5px solid #E5E9F0;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  color: #1F2937;
  transition: border-color 0.2s;
  outline: none;
}
.auth-input:focus {
  border-color: #2B5494;
  box-shadow: 0 0 0 3px rgba(43,84,148,0.1);
}
.auth-eye {
  position: absolute;
  right: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #9CA3AF;
  padding: 0;
  display: flex;
}
.auth-eye:hover { color: #2B5494; }
.auth-hint-error {
  font-size: 0.75rem;
  color: #EF4444;
  margin: 0.3rem 0 0;
}

.btn-auth {
  width: 100%;
  padding: 0.75rem;
  background: #2B5494;
  color: #fff;
  border: none;
  border-radius: 0.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: background 0.2s, transform 0.15s;
  margin-top: 0.5rem;
}
.btn-auth:hover:not(:disabled) {
  background: #1e3c6e;
  transform: translateY(-1px);
}
.btn-auth:disabled { opacity: 0.7; cursor: not-allowed; }

.auth-footer {
  text-align: center;
  font-size: 0.85rem;
  color: #6B7280;
  margin-top: 1.25rem;
}
.auth-link {
  color: #2B5494;
  font-weight: 600;
  text-decoration: none;
}
.auth-link:hover { text-decoration: underline; }
</style>
