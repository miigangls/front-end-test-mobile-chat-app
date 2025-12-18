# IMPLEMENTATION.md

Este documento resume las mejoras aplicadas al proyecto siguiendo principios de **Clean Code**:

- **DRY** (Don’t Repeat Yourself)
- **SRP** (Single Responsibility Principle)
- **Archivos pequeños** (objetivo ~100–120 líneas)
- **Separación UI vs lógica** (componentes + custom hooks)
- **React Query** para estandarizar “queries/mutations” y cache (aunque la fuente de datos sea SQLite local)
- **Buenas prácticas adicionales** (bugfixes, performance, navegación consistente)

---

## 1) React Query (TanStack Query) + Providers

### Objetivo
Eliminar manejo manual repetido de `loading/error` y centralizar invalidación/caching de datos.

### Cambios
- Se agregó `@tanstack/react-query`.
- Se creó `providers/QueryProvider.tsx` con `QueryClientProvider`.
- Se creó `providers/AppProviders.tsx` para agrupar providers:
  - `QueryProvider`
  - `DatabaseProvider` (init/seed DB)
  - `AuthProvider` (auth/usuario actual)
- En `app/_layout.tsx` se reemplazó el provider monolítico anterior por `AppProviders`.

### Por qué
- React Query ofrece un patrón consistente para:
  - cache (evita recargas innecesarias)
  - invalidación (después de mutations)
  - estados `isLoading/isError`

---

## 2) SRP: separación por dominio (Auth / Chats / DB)

### Antes
Existía un `AppContext` “monolítico” que mezclaba:
- DB init
- users/auth
- chats/mensajes

### Ahora
- `hooks/auth/AuthContext.tsx` contiene **solo** auth/usuarios:
  - query `['users']`
  - `currentUserId` (estado mínimo)
  - `login/logout`
- `hooks/chats/useChats.ts` contiene **solo** queries/mutations de chats:
  - query `['chats', currentUserId]`
  - mutation `createChat`
  - mutation `sendMessage`
- `database/DatabaseProvider.tsx` se mantiene como “gate” de inicialización, pero ahora usa el color del tema para el loader.

### Limpieza
Se removieron los hooks legacy:
- `hooks/AppContext.tsx`
- `hooks/db/useUserDb.ts`
- `hooks/db/useChatsDb.ts`
- `hooks/db/index.ts`

---

## 3) Performance: eliminar N+1 queries en chats

### Problema
La carga de chats hacía un loop por `chatId` y adentro consultaba:
- chat
- participantes
- mensajes

Eso escala mal (N+1).

### Solución
Se creó `repositories/chatRepository.ts` con:

- `getChatListForUser(userId)`: devuelve **solo metadata** de chats (id, participantes y `lastMessage`) sin cargar el historial completo.
- `getMessagesPage({ chatId, limit, beforeTimestamp })`: devuelve páginas de mensajes (newest-first) para habilitar paginación de mensajes por chat.

Esto reduce número de queries, elimina el N+1 y evita cargar **todos** los mensajes en memoria para cada chat.

---

## 4) DRY: utils y tipado de dominio

### Tipos de dominio
Se crearon tipos compartidos para evitar duplicación:
- `types/user.ts`
- `types/chat.ts`

### Utilidades compartidas
- `utils/chat.ts`
  - `getOtherParticipants(...)`
  - `buildChatTitle(...)`
- `utils/datetime.ts`
  - `formatTimeHHMM(...)`
  - `formatRelativeChatTime(...)`
- `utils/text.ts`
  - `capitalizeFirst(...)`

### Colores (magic values)
Se extendió `constants/Colors.ts` con tokens usados por la app:
- `primary`, `border`, `mutedText`, `danger`, `selection`, `disabled`
- colores de burbujas de chat (self/other)
- colores de status avatar

Se agregó `hooks/useAppColors.ts` para consumir tokens por tema (light/dark).

---

## 5) Archivos < 120 líneas (split de pantallas/componentes)

### ChatRoom
Se redujo `app/ChatRoom.tsx` extrayendo:
- `hooks/chat/useChatRoom.ts` (derivación de datos + `onSend`)
- `hooks/ui/useAutoScrollToEnd.ts` (comportamiento de scroll)
- `components/chat/ChatRoomHeaderTitle.tsx`
- `components/chat/MessageList.tsx` (virtualización mejorada + loader para paginación)
- `components/chat/MessageComposer.tsx`

Adicionalmente:
- Se agregó `hooks/chats/useChatMessages.ts` para cargar mensajes **paginados por `chatId`** con `useInfiniteQuery`.
- Se cambió el list renderer de mensajes a **`FlashList`** (`@shopify/flash-list`) para mejorar virtualización y performance.

### Chats tab
Se redujo `app/(tabs)/index.tsx` extrayendo:
- `hooks/chat/useNewChatModal.ts`
- `components/chat/NewChatModal.tsx`

### Profile tab
Se redujo `app/(tabs)/profile.tsx` extrayendo:
- `components/profile/ProfileHeader.tsx`
- `components/profile/AccountInformation.tsx`
- `components/profile/LogoutButton.tsx`

---

## 6) Bugfix: login async (Promise vs boolean)

### Problema
`login` retornaba `Promise<boolean>` pero se usaba como boolean síncrono.

### Solución
En `app/login.tsx` se cambió a `await login(userId)` antes de navegar.

---

## 7) Navegación consistente (expo-router)

Se evitó mezclar `react-navigation` directo para navegar a ChatRoom.
Ahora `components/ChatListItem.tsx` navega con `expo-router` (`router.push(...)`).

---

## 8) Features completadas (README: Feature Additions)

### 8.1 Media sharing (fotos) con preview optimizado
- Se agregó selección de imagen con `expo-image-picker`.
- Se agregó compresión + generación de thumbnail con `expo-image-manipulator`.
- Se guardan archivos en `FileSystem.documentDirectory/media/` vía `services/mediaStorage.ts`.
- Nuevo tipo de mensaje `type: 'image'` con `mediaUri` y `thumbnailUri`.
- UI:
  - `MessageComposer` agrega botón “photo”
  - `MessageBubble` renderiza thumbnail y permite abrir el visor (`app/ImageViewer.tsx`)

### 8.2 Read receipts + status indicators
- Se agregó columna `status` en `messages` (`sent` | `read`).
- Al abrir un chat, se marcan como `read` los mensajes recibidos (offline-first) desde `hooks/chats/useChatMessages.ts`.
- UI: en mensajes del usuario actual se muestra `✓` (sent) o `✓✓` (read).

### 8.3 Editar y borrar mensajes
- Se agregaron columnas `edited_at` y `deleted_at`.
- UI:
  - Long-press en mensajes propios para abrir acciones (Edit/Delete) (`hooks/chat/useMessageEditor.ts`)
  - Modal para editar (`components/chat/EditMessageModal.tsx`)
- En borrado de mensajes con media se eliminan archivos locales (ver 8.4).

### 8.4 Memory management de media
- Al borrar un mensaje de imagen:
  - se eliminan los archivos `mediaUri/thumbnailUri` (`deleteMediaFiles`)
  - se limpia la referencia en DB (URIs en null)
- En caso de fallo al enviar, se elimina la media persistida para evitar archivos huérfanos.

### 8.5 Búsqueda de mensajes
- Query `searchMessages(chatId, query)` en `chatRepository` (LIKE sobre texto).
- UI: modal de búsqueda con resultados y “jump to message” (`components/chat/MessageSearchModal.tsx`).

---

## 9) Bugfix: teclado/overlap en distintos tamaños

- `MessageComposer` aplica `bottomInset` para respetar safe-area inferior.
- `ChatRoom` usa `KeyboardAvoidingView` + `keyboardVerticalOffset` basado en safe-area.

---

## Tradeoffs / decisiones

- **React Query con SQLite local**: no hay API remota, pero igual aporta:
  - cache + invalidación estándar
  - menos estado manual en hooks
  - una base sólida si mañana se agrega sync con API
- **Auth “in-memory”**: se mantiene simple (no persistente). Si se requiere, se puede persistir `currentUserId` en storage seguro.

---

## Próximos pasos recomendados

- ✅ Implementado: paginación real de mensajes por `chatId` con “load older” (`useInfiniteQuery` + `getMessagesPage`).
- ✅ Implementado: virtualización más avanzada usando `FlashList`.
- ✅ Implementado: tests unitarios para `utils/chat.ts`, `utils/datetime.ts`, `utils/text.ts`.
- Considerar “selectors”/memoización más estricta si aparecen rerenders.


