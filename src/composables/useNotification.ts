import { ref } from 'vue'

export type NotificationType = 'success' | 'danger' | 'warning' | 'info'

interface Notification {
  id: number
  type: NotificationType
  message: string
}

// Singleton reactivo compartido entre componentes
const notifications = ref<Notification[]>([])
let nextId = 1

export function useNotification() {
  function notify(message: string, type: NotificationType = 'info', duration = 3500) {
    const id = nextId++
    notifications.value.push({ id, type, message })
    setTimeout(() => {
      notifications.value = notifications.value.filter((n) => n.id !== id)
    }, duration)
  }

  function remove(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return { notifications, notify, remove }
}
