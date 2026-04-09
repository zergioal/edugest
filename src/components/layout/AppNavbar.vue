<template>
  <header class="app-navbar">
    <!-- Brand con logo -->
    <RouterLink to="/" class="navbar-brand">
      <img src="/logo1.png" alt="Logo" class="navbar-logo" />
      <div>
        <span class="navbar-brand-text">Colegio Pio XII</span>
        <span class="navbar-brand-sub">Plataforma Académica</span>
      </div>
    </RouterLink>

    <!-- Nav links (desktop) -->
    <nav class="edu-nav">
      <RouterLink to="/" class="edu-link" exact-active-class="edu-link--active">
        <i class="bi bi-grid-1x2"></i> Dashboard
      </RouterLink>
      <RouterLink to="/docentes" class="edu-link">
        <i class="bi bi-person-video3"></i> Docentes
      </RouterLink>
      <RouterLink to="/cursos" class="edu-link">
        <i class="bi bi-journal-bookmark"></i> Cursos
      </RouterLink>
      <RouterLink to="/estudiantes" class="edu-link">
        <i class="bi bi-people"></i> Estudiantes
      </RouterLink>
    </nav>

    <!-- Right -->
    <div class="navbar-right">
      <!-- Mobile toggle -->
      <button
        class="btn-hamburger"
        @click="mobileOpen = !mobileOpen"
        aria-label="Menú"
      >
        <i :class="mobileOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
      </button>

      <!-- User + Logout (desktop) -->
      <div class="navbar-user">
        <div class="navbar-avatar">{{ userInitial }}</div>
        <span class="navbar-email">{{ currentUser?.email }}</span>
      </div>
      <button class="btn-logout" @click="handleLogout" title="Cerrar sesión">
        <i class="bi bi-box-arrow-right me-1"></i>
        <span class="btn-logout-text">Salir</span>
      </button>
    </div>
  </header>

  <!-- Mobile dropdown -->
  <Transition name="mob">
    <div v-if="mobileOpen" class="mobile-nav">
      <RouterLink to="/" class="mob-link" @click="mobileOpen = false">
        <i class="bi bi-grid-1x2 me-2"></i>Dashboard
      </RouterLink>
      <RouterLink to="/docentes" class="mob-link" @click="mobileOpen = false">
        <i class="bi bi-person-video3 me-2"></i>Docentes
      </RouterLink>
      <RouterLink to="/cursos" class="mob-link" @click="mobileOpen = false">
        <i class="bi bi-journal-bookmark me-2"></i>Cursos
      </RouterLink>
      <RouterLink
        to="/estudiantes"
        class="mob-link"
        @click="mobileOpen = false"
      >
        <i class="bi bi-people me-2"></i>Estudiantes
      </RouterLink>
      <div class="mob-divider"></div>
      <div class="mob-user-row">
        <div class="mob-avatar">{{ userInitial }}</div>
        <span class="mob-email">{{ currentUser?.email }}</span>
      </div>
      <button class="mob-logout" @click="handleLogout">
        <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { currentUser, clearAuth } = useAuth();
const mobileOpen = ref(false);

const userInitial = computed(() => {
  const email = currentUser.value?.email ?? "";
  return email[0]?.toUpperCase() ?? "U";
});

function handleLogout() {
  clearAuth();
  router.push("/login");
}
</script>

<style scoped>
/* ── Navbar ──────────────────────────────────────────────── */
.app-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 82px;
  background: #2b5494;
  z-index: 1000;
  display: flex;
  flex-direction: row; /* fuerza fila */
  align-items: center;
  padding: 0 1.75rem;
  gap: 1rem;
  box-shadow: 0 3px 18px rgba(20, 50, 110, 0.45);
}

/* ── Brand / Logo ────────────────────────────────────────── */
.navbar-brand {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.7rem;
  text-decoration: none;
  flex-shrink: 0;
  margin-right: 1.25rem;
}
.navbar-logo {
  height: 64px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s;
}
.navbar-brand:hover .navbar-logo {
  transform: scale(1.06);
}
.navbar-brand-text {
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  display: block;
}
.navbar-brand-sub {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.52);
  font-weight: 400;
  display: block;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* ── Nav links ───────────────────────────────────────────── */
.edu-nav {
  display: flex;
  flex-direction: row; /* SIEMPRE en fila */
  align-items: center;
  gap: 0.3rem;
  flex: 1;
}
.edu-link {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 0.45rem;
  padding: 0.6rem 1.1rem;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.975rem; /* más grande */
  font-weight: 600;
  transition:
    background 0.18s,
    color 0.18s,
    transform 0.14s;
  white-space: nowrap;
  text-decoration: none;
  letter-spacing: 0.01em;
}
.edu-link i {
  font-size: 1rem;
}
.edu-link:hover {
  background: #f6eb19;
  color: #2b5494;
  transform: translateY(-1px);
}
.edu-link--active,
.edu-link.router-link-active {
  background: #f6eb19;
  color: #2b5494;
  font-weight: 700;
}

/* ── Right section ───────────────────────────────────────── */
.navbar-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.65rem;
  margin-left: auto;
  flex-shrink: 0;
}
.navbar-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.55rem;
}
.navbar-avatar {
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.navbar-email {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.68);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btn-logout {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.85);
  border-radius: 0.45rem;
  padding: 0.42rem 0.9rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition:
    background 0.15s,
    color 0.15s;
}
.btn-logout:hover {
  background: rgba(239, 68, 68, 0.35);
  color: #fff;
  border-color: transparent;
}

/* ── Hamburger (mobile only) ─────────────────────────────── */
.btn-hamburger {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: #fff;
  border-radius: 0.4rem;
  width: 38px;
  height: 38px;
  display: none; /* oculto en desktop */
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.15rem;
  flex-shrink: 0;
}
.btn-hamburger:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* ── Mobile nav ──────────────────────────────────────────── */
.mobile-nav {
  position: fixed;
  top: 82px;
  left: 0;
  right: 0;
  background: #1e3c6e;
  z-index: 999;
  padding: 0.75rem 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
}
.mob-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.8rem 1.5rem;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition:
    background 0.15s,
    color 0.15s;
}
.mob-link:hover,
.mob-link.router-link-active {
  background: #f6eb19;
  color: #2b5494;
}
.mob-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 0.5rem 0;
}
.mob-user-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1.5rem;
}
.mob-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
}
.mob-email {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.65);
}
.mob-logout {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #fca5a5;
  font-size: 0.9rem;
  font-weight: 500;
}
.mob-logout:hover {
  background: rgba(239, 68, 68, 0.15);
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 767px) {
  .edu-nav {
    display: none;
  }
  .navbar-user {
    display: none;
  }
  .btn-logout {
    display: none;
  }
  .btn-hamburger {
    display: flex;
  }
}

/* ── Transition ──────────────────────────────────────────── */
.mob-enter-active,
.mob-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.mob-enter-from,
.mob-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
