# 🚀 Proyecto: Sumly - La Calculadora con Memoria
## "No solo sumes números, etiqueta tus gastos en tiempo real."

Este documento sirve como la guía maestra y contexto para el desarrollo inicial en **Google Antigravity**.

---

## 🎯 1. Visión del Producto
**Sumly** es una aplicación de productividad híbrida (Android/Web) que combina la velocidad de una calculadora básica con la organización de una lista de compras o presupuesto. Resuelve el problema de olvidar a qué corresponde cada monto en una cadena de operaciones larga.

**Propuesta de Valor Única (USP):**
- **Transparencia Total:** Cada número tiene un nombre.
- **Persistencia:** Los cálculos no se borran al cerrar la app; se guardan en "Listas con Título".
- **Simplicidad Extrema:** Sin menús complejos. Abre, escribe, etiqueta y suma.

---

## 🛠 2. Stack Tecnológico (Google Cloud/Dev Ecosystem)
- **Framework:** Flutter 3.x (Multiplataforma: Android + Web).
- **IDE:** Google Antigravity (Desarrollo guiado por IA).
- **Diseño:** Material Design 3 (usando Google Stitch para componentes).
- **Estado:** Riverpod (Arquitectura reactiva).
- **Persistencia Local:** Isar Database (Ultra rápida, soporte para Web y móvil).
- **Monetización:** Google Play Billing + Stripe (para Web).

---

## 📋 3. Requerimientos Funcionales (Core Features)

### A. El Motor de Cálculo Etiquetado
1. **Entrada de Datos:** Campo numérico + Campo de texto "Etiqueta" (opcional pero sugerido).
2. **Operaciones Básicas:** `+`, `-`, `*`, `/`.
3. **Flujo de Itemización:** Al presionar un operador, el monto actual y su etiqueta se mueven a una "Lista de Auditoría" visible en la parte superior.
4. **Resumen Inteligente:** Botón `=` que genera una vista detallada:
   - Lista ordenada de mayor a menor (o por entrada).
   - Total destacado en la parte superior.
   - Opción de editar cualquier monto o etiqueta ya ingresado.

### B. Gestión de Listas (Sesiones)
1. **Titulación:** Cada cálculo iniciado puede recibir un nombre (ej. "Cena con amigos", "Materiales construcción").
2. **Historial (Dashboard):** Pantalla principal que muestra tarjetas de listas guardadas con su total y fecha.
3. **Búsqueda:** Filtro rápido por título de lista.

---

## 🎨 4. Estrategia de Diseño (UI/UX)
- **Estilo:** Material 3 con **Dynamic Color** (la app se adapta al color del sistema del usuario).
- **Accesibilidad:** Botones de calculadora grandes con feedback háptico.
- **Modo Web:** Diseño responsivo que aprovecha el ancho de pantalla para mostrar el historial a la derecha y la calculadora a la izquierda.
- **Componentes Stitch:** Utilizar `NavigationBar`, `FloatingActionButton` y `Cards` con elevación tonal.

---

## 💰 5. Estrategia de Negocio y Monetización
- **Modelo:** **Lifetime Premium (Pago Único de $5)**.
- **Estrategia Freemium:**
  - **Gratis:** Uso de calculadora ilimitado, hasta 3 listas guardadas, etiquetas básicas.
  - **Premium:** Listas ilimitadas, exportación a PDF/CSV (Recibos), backup en la nube (Google Drive), búsqueda avanzada y eliminación de publicidad (si se incluye).
- **Lanzamiento:** Oferta "Early Bird" de $2.99 para los primeros 1,000 usuarios, luego subir a $5.

---

## 🚀 6. Instrucciones para Antigravity (Primeros Pasos)

1. **Fase 1 (Arquitectura):** "Genera la estructura de carpetas de Flutter siguiendo Clean Architecture. Configura Isar Database para las entidades `CalculationList` y `CalculationItem`."
2. **Fase 2 (UI):** "Crea el widget de la calculadora inspirado en Material 3. Incluye un `TextField` para el monto y un `TextField` sutil para la etiqueta."
3. **Fase 3 (Lógica):** "Implementa un Provider con Riverpod que gestione una lista de objetos en memoria y los persista en Isar cada vez que se presione un operador."
4. **Fase 4 (Web):** "Asegura que el diseño sea responsivo para Web Apps, optimizando el teclado para uso con mouse y teclado físico."

---

## ✅ 7. Definición de Éxito
- **Velocidad:** La app debe cargar en menos de 1.5 segundos.
- **Simplicidad:** Un usuario debe poder crear su primera lista etiquetada en menos de 10 segundos.
- **Monetización:** Conversión del 5% de usuarios gratuitos a Premium en los primeros 3 meses.
"""

# Guardar el archivo
file_path = "Blueprint_Sumly_App.md"
with open(file_path, "w", encoding="utf-8") as f:
    f.write(md_content)

print(f"Archivo generado exitosamente en: {file_path}")