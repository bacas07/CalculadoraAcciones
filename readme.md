# 📈 Forex Insight API Documentation

## ✨ Una Solución Robusta para el Análisis Cuantitativo de Datos Forex

Bienvenido a la documentación oficial de **Forex Insight API**. Esta API ha sido diseñada para proporcionar capacidades avanzadas de análisis técnico sobre datos financieros del mercado Forex. Integrando algoritmos numéricos fundamentales con una gestión eficiente de datos, la API permite a desarrolladores y analistas extraer insights profundos de las fluctuaciones de pares de divisas, facilitando la toma de decisiones informadas y la construcción de modelos predictivos.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#-descripción-general)
2. [Instalación y Configuración](#-instalación-y-configuración)
3. [Explorando los Endpoints de la API](#-explorando-los-endpoints-de-la-api)
   * [Endpoints de Gestión de Datos por Símbolo](#endpoints-de-gestión-de-datos-por-símbolo)
     * [EUR/USD](#eurusd)
     * [GBP/USD](#gbpusd)
     * [USD/JPY](#usdjpy)
   * [Endpoints de Análisis Numérico Avanzado](#endpoints-de-análisis-numérico-avanzado)
     * [Regresión Lineal](#regresión-lineal)
     * [Interpolación Lineal](#interpolación-lineal)
     * [Interpolación de Lagrange](#interpolación-de-lagrange)
     * [Integración Numérica (Método de los Trapecios)](#integración-numérica-método-de-los-trapecios)
4. [Ejemplos Prácticos de Uso](#-ejemplos-prácticos-de-uso)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Tecnologías Utilizadas](#-tecnologías-utilizadas)

---

## 📝 Descripción General

Forex Insight API es una solución backend construida con Node.js y TypeScript, enfocada en la interacción y el análisis de series de tiempo de datos Forex. Esta API trasciende las operaciones CRUD estándar al incorporar algoritmos de cálculo numérico que transforman datos brutos en información procesable. Se conecta a una base de datos MongoDB para la persistencia de datos históricos de pares de divisas clave: EUR/USD, GBP/USD y USD/JPY.

### Capacidades Clave:

* **Gestión de Datos Forex:** Permite la inserción, recuperación y eliminación de datos históricos de precios de divisas.
* **Manejo de Gaps de Datos:** Implementa la interpolación lineal para asegurar la continuidad de las series de tiempo, lo cual es fundamental para la precisión de cualquier análisis numérico.
* **Análisis de Tendencias con Regresión Lineal:** Proporciona los parámetros clave (pendiente, intercepto y coeficiente de determinación R²) de la línea de tendencia de los precios de cierre dentro de una ventana de tiempo especificada.
* **Estimación de Valores Puntuales con Interpolación de Lagrange:** Permite estimar el precio en un punto específico (incluso decimal) dentro de una serie de datos, generando una curva polinomial que se ajusta a los puntos conocidos. Esto es útil para predecir precios en fechas intermedias no registradas.
* **Medición de Impulso con Integración por Trapecios:** Calcula el área bajo la curva de la línea de tendencia, ofreciendo una métrica de "energía acumulada" o impulso total del movimiento del precio en un intervalo dado. Esta característica es crucial para entender la fuerza subyacente de una tendencia y puede ser un valioso *feature* para modelos de Machine Learning.

---

## 🚀 Instalación y Configuración

Para desplegar y ejecutar esta API en tu entorno local, sigue los siguientes pasos.

### Prerrequisitos:

Asegúrate de tener instalados los siguientes componentes:

* **Node.js:** Versión `v18+` (recomendado para compatibilidad y rendimiento).
* **npm:** Versión `v9+` (gestor de paquetes de Node.js).
* **MongoDB:** Versión `6.0+` (base de datos para almacenar los datos Forex). Puedes utilizar una instancia local o un servicio en la nube como MongoDB Atlas (que ofrece un nivel gratuito).

### Pasos de Instalación:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/CalculadoraAccionesProduccion.git # Reemplaza con la URL real de tu repositorio
   cd CalculadoraAccionesProduccion
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo de ejemplo y ajusta tus credenciales y configuración:
   ```bash
   cp .env.example .env
   ```
   Edita el archivo `.env` recién creado para definir:
   * `PORT`: El puerto en el que la API escuchará (ej. `3000`).
   * `MONGODB_URI`: La cadena de conexión a tu base de datos MongoDB (ej. `mongodb://localhost:27017/forex-predict`).

4. **Iniciar el servidor en modo desarrollo:**
   ```bash
   npm run dev
   ```
   Este comando compilará el código TypeScript y levantará el servidor, que se reiniciará automáticamente con cada cambio detectado. Para un entorno de producción, utiliza `npm start`.

---

## 📚 Explorando los Endpoints de la API

La API organiza sus rutas de manera lógica, diferenciando entre las operaciones de gestión de datos por símbolo de divisa y las funciones de análisis numérico.

### Base URL: `http://localhost:PORT/` (o la URL de tu despliegue)

Por ejemplo, si tu `PORT` es `3000`, la base URL será `http://localhost:3000/`.

---

### Endpoints de Gestión de Datos por Símbolo

Estos endpoints permiten interactuar directamente con los datos históricos de cada par de divisas. La estructura de rutas y el comportamiento son idénticos para EUR/USD, GBP/USD y USD/JPY.

#### `IStockDataPoint` Schema (para `createone`, `createmany`):

```typescript
interface IStockDataPoint {
  date: string; // Formato 'YYYY-MM-DD'
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number; // Propiedad opcional
}
```

#### EUR/USD

**Base URL:** `/eurusd`

| Método | Ruta | Descripción | Parámetros / Body |
|--------|------|-------------|-------------------|
| GET | `/getall` | Obtiene todos los registros históricos de EUR/USD. | Ninguno. |
| GET | `/getbyid/:id` | Obtiene un registro específico por su _id de MongoDB. | `id` (path parameter): El _id único del documento. |
| POST | `/createone` | Crea un nuevo registro de datos para EUR/USD. | `body` (JSON): Objeto IStockDataPoint con los datos del día. |
| POST | `/createmany` | Crea múltiples registros de datos para EUR/USD en una sola solicitud. | `body` (JSON): Array de objetos IStockDataPoint. |
| DELETE | `/deleteone` | Elimina un registro específico por su _id. | `body` (JSON): `{ "id": "el_id_a_eliminar" }`. |
| GET | `/bulkinsert` | Inserta un conjunto de datos de muestra para facilitar pruebas. | Ninguno. ¡Advertencia: Solo para entornos de desarrollo! No usar en producción. |

#### GBP/USD

**Base URL:** `/gbpusd`

Este par de divisas utiliza la misma estructura de endpoints y funcionalidad que EUR/USD, operando sobre su conjunto de datos específico.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/getall` | Obtiene todos los registros de GBP/USD. |
| GET | `/getbyid/:id` | Obtiene un registro específico por id. |
| POST | `/createone` | Crea un nuevo registro. |
| POST | `/createmany` | Crea múltiples registros. |
| DELETE | `/deleteone` | Elimina un registro por id. |
| GET | `/bulkinsert` | Inserta datos de muestra. |

#### USD/JPY

**Base URL:** `/usdjpy`

Similar a los pares anteriores, USD/JPY dispone de los mismos endpoints para la gestión de sus datos históricos.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/getall` | Obtiene todos los registros de USD/JPY. |
| GET | `/getbyid/:id` | Obtiene un registro específico por id. |
| POST | `/createone` | Crea un nuevo registro. |
| POST | `/createmany` | Crea múltiples registros. |
| DELETE | `/deleteone` | Elimina un registro por id. |
| GET | `/bulkinsert` | Inserta datos de muestra. |

---

### Endpoints de Análisis Numérico Avanzado

Estos endpoints son el núcleo de la API, donde los algoritmos numéricos transforman y analizan los datos. Es importante destacar que, internamente, estos endpoints primero obtienen los datos históricos y aplican una interpolación lineal para asegurar la continuidad de las series de tiempo, lo cual es vital para la precisión de los cálculos subsiguientes.

**Base URL:** `/analysis`

#### Regresión Lineal

Calcula la línea de tendencia (regresión lineal simple) para el precio de cierre de una ventana de datos específica. Proporciona una visión sobre la dirección y fuerza de la tendencia.

**Ruta:** `/linear-regression/:symbol/:windowSize`  
**Método:** GET

**Parámetros de Ruta:**
- `:symbol` (string): El símbolo del par de divisas (ej. eurusd).
- `:windowSize` (number): El número de los días más recientes a considerar para el cálculo de la regresión. Debe ser un entero mayor o igual a 2.

**Respuesta Exitosa (200 OK):**
```json
{
  "symbol": "eurusd",
  "windowSize": 10,
  "slope": -0.00012345,     // Pendiente de la línea de tendencia (indica dirección y magnitud del cambio)
  "intercept": 1.12345,     // Intercepto (valor de 'y' cuando 'x' es 0, punto de inicio de la línea de tendencia)
  "rSquared": 0.85,         // Coeficiente de determinación (R²), valor entre 0 y 1. Indica qué tan bien el modelo lineal explica la variabilidad de los datos. Un valor cercano a 1 sugiere un buen ajuste.
  "rawDataCount": 7,        // Número de puntos de datos originales obtenidos de la base de datos.
  "interpolatedDataCount": 10 // Número de puntos de datos usados en el cálculo después de la interpolación.
}
```

**Errores Comunes:**
- **400 Bad Request:** Parámetros de ruta inválidos (symbol, windowSize).
- **404 Not Found:** No hay suficientes datos históricos para la windowSize especificada, incluso después de la interpolación.

#### Interpolación Lineal

Obtiene un conjunto de datos recientes y los interpole linealmente para rellenar cualquier día faltante entre puntos de datos existentes. Esto asegura una serie de tiempo continua, esencial para análisis subsiguientes.

**Ruta:** `/interpolate-linear/:symbol/:windowSize`  
**Método:** GET

**Parámetros de Ruta:**
- `:symbol` (string): El símbolo del par de divisas.
- `:windowSize` (number): El número de los días más recientes a obtener y luego interpolar.

**Respuesta Exitosa (200 OK):**
```json
{
  "symbol": "eurusd",
  "windowSize": 10,
  "rawDataCount": 7,         // Número de puntos de datos originales.
  "interpolatedDataCount": 10, // Número total de puntos después de rellenar los gaps.
  "interpolatedData": [
    { "date": "2025-05-18", "open": 1.078, "high": 1.078, "low": 1.078, "close": 1.078 },
    { "date": "2025-05-19", "open": 1.0785, "high": 1.0785, "low": 1.0785, "close": 1.0785 }
    // ... (resto de los puntos interpolados y originales)
  ]
}
```

**Errores Comunes:**
- **400 Bad Request:** Parámetros de ruta inválidos.

#### Interpolación de Lagrange

Realiza una interpolación polinomial de Lagrange sobre una ventana de datos históricos para estimar un valor de cierre (y) en un índice de tiempo (xTarget) específico. Esta interpolación genera una curva que pasa por todos los puntos de datos, siendo útil para estimaciones precisas en puntos intermedios no registrados o para suavizar tendencias.

**Ruta:** `/interpolate-lagrange/:symbol/:windowSize/:xTarget`  
**Método:** GET

**Parámetros de Ruta:**
- `:symbol` (string): El símbolo del par de divisas.
- `:windowSize` (number): El número de los días más recientes a utilizar para la interpolación.
- `:xTarget` (number): El índice de tiempo (puede ser un valor decimal) para el cual se desea estimar el precio. El índice 0 corresponde al primer día de la windowSize.

**Respuesta Exitosa (200 OK):**
```json
{
  "symbol": "eurusd",
  "windowSize": 10,
  "xTarget": 5.5,                      // El índice de tiempo objetivo para la interpolación.
  "predictedDate": "2025-05-23",       // Fecha aproximada correspondiente al xTarget.
  "interpolatedValue": 1.0821234,      // El precio de cierre estimado en el xTarget.
  "baseDateForXIndices": "2025-05-18", // La fecha del primer punto de datos (índice 0) de la ventana.
  "rawDataCount": 7,
  "interpolatedDataCount": 10
}
```

**Errores Comunes:**
- **400 Bad Request:** Parámetros inválidos (windowSize o xTarget).
- **404 Not Found:** No hay suficientes datos para realizar la interpolación.
- **500 Internal Server Error:** Errores internos de cálculo (ej. valores de x duplicados, aunque el pre-procesamiento de interpolación lineal mitiga esto).

#### Integración Numérica (Método de los Trapecios)

Calcula la integral definida de la línea de tendencia lineal (obtenida mediante regresión) dentro de un intervalo de tiempo especificado, utilizando el método de los trapecios. Este cálculo proporciona el "área bajo la curva", que puede interpretarse como la acumulación total de valor o el impulso neto del movimiento del precio durante ese período. Esta métrica es un feature de alto valor para modelos de Machine Learning, ya que cuantifica la magnitud de la tendencia en un intervalo.

**Ruta(s):**
- `/integrate-trapezoidal/:symbol/:windowSize/:lowerBound/:upperBound` (Utiliza numSegments por defecto: 100)
- `/integrate-trapezoidal/:symbol/:windowSize/:lowerBound/:upperBound/:numSegments`

**Método:** GET

**Parámetros de Ruta:**
- `:symbol` (string): El símbolo del par de divisas.
- `:windowSize` (number): El número de los días más recientes a usar para calcular la regresión lineal que será integrada.
- `:lowerBound` (number): Límite inferior del intervalo de integración (índice de tiempo, ej. 0 para el inicio de la ventana).
- `:upperBound` (number): Límite superior del intervalo de integración (índice de tiempo, ej. 9 para el final de una ventana de 10 días). Debe ser mayor que lowerBound.
- `[numSegments]` (number, opcional): Número de segmentos (trapecios) a usar para la aproximación de la integral. Un valor más alto (por defecto 100 si no se especifica) proporciona mayor precisión.

**Respuesta Exitosa (200 OK):**
```json
{
  "symbol": "eurusd",
  "windowSize": 10,
  "lowerBound": 0,                    // Límite inferior del intervalo de integración.
  "upperBound": 9,                    // Límite superior del intervalo de integración.
  "lowerDate": "2025-05-18",          // Fecha aproximada correspondiente al lowerBound.
  "upperDate": "2025-05-27",          // Fecha aproximada correspondiente al upperBound.
  "numSegments": 100,                 // Número de segmentos utilizados para la integración.
  "slopeUsed": -0.00012345,           // Pendiente de la línea de tendencia que fue integrada.
  "interceptUsed": 1.12345,           // Intercepto de la línea de tendencia que fue integrada.
  "integratedArea": 10.12345,         // El valor del área calculada bajo la línea de tendencia.
  "rawDataCount": 7,
  "interpolatedDataCount": 10
}
```

**Errores Comunes:**
- **400 Bad Request:** Parámetros inválidos (windowSize, lowerBound, upperBound, numSegments).
- **404 Not Found:** No hay suficientes datos para el cálculo.
- **500 Internal Server Error:** Errores durante el cálculo de la regresión o la integración.

---

## 🚀 Ejemplos Prácticos de Uso

Utiliza curl para interactuar rápidamente con tu API desde la terminal. Recuerda reemplazar `http://localhost:3000` con la URL de tu despliegue (ej. `https://tu-app-production.render.com`).

### 1. Crear un nuevo registro de datos para EUR/USD:

```bash
curl -X POST http://localhost:3000/eurusd/createone \
  -H "Content-Type: application/json" \
  -d '{ "date": "2025-01-01", "open": 1.1000, "high": 1.1020, "low": 1.0980, "close": 1.1015 }'
```

### 2. Obtener la regresión lineal para EUR/USD en una ventana de 10 días:

```bash
curl http://localhost:3000/analysis/linear-regression/eurusd/10
```

### 3. Obtener datos interpolados linealmente para GBP/USD en una ventana de 7 días:

```bash
curl http://localhost:3000/analysis/interpolate-linear/gbpusd/7
```

### 4. Realizar una interpolación de Lagrange para USD/JPY, usando una ventana de 15 días, y estimar el valor en el índice 7.2:

```bash
curl http://localhost:3000/analysis/interpolate-lagrange/usdjpy/15/7.2
```

### 5. Calcular la integral trapezoidal de la tendencia de EUR/USD en una ventana de 10 días, del índice 0 al 9, con 50 segmentos:

```bash
curl http://localhost:3000/analysis/integrate-trapezoidal/eurusd/10/0/9/50
```

(También puedes omitir el `/50` para usar el número de segmentos por defecto (100)).

---

## 📂 Estructura del Proyecto

La arquitectura del proyecto sigue una estructura modular y limpia, diseñada para facilitar la escalabilidad, el mantenimiento y la comprensión del flujo de la aplicación:

```
forex-predict/
├── src/
│   ├── controllers/       # Contiene la lógica de manejo de solicitudes HTTP y la preparación de respuestas.
│   ├── database/          # Módulos para la configuración de la conexión a MongoDB y la gestión de la base de datos.
│   ├── errors/            # Definición y manejo de errores personalizados para una gestión de excepciones consistente.
│   ├── middlewares/       # Funciones middleware de Express para pre-procesamiento de solicitudes (ej. logging, validación).
│   ├── models/            # Definiciones de esquemas de Mongoose y servicios para la interacción directa con la base de datos.
│   ├── routes/            # Configuración de las rutas de la API utilizando Express Router.
│   ├── schemas/           # Esquemas de validación de datos (ej. con Zod o Joi) y/o esquemas de Mongoose.
│   ├── services/          # **Contiene la lógica de negocio central y los algoritmos numéricos:** implementación de regresión, interpolación e integración.
│   ├── types/             # Definiciones de interfaces y tipos TypeScript para asegurar la consistencia de los datos.
│   ├── utils/             # Funciones de utilidad diversas y genéricas (ej. manipulaciones de fechas).
│   ├── validators/        # Lógica específica para la validación de la entrada de datos en los endpoints.
│   └── server.ts          # El punto de entrada principal de la aplicación Express.
├── .env.example           # Plantilla para la configuración de variables de entorno.
├── package.json           # Metadatos del proyecto y lista de dependencias.
├── package-lock.json      # Bloqueo de versiones exactas de las dependencias.
├── tsconfig.json          # Configuración del compilador TypeScript.
├── .gitignore             # Reglas para que Git ignore archivos y directorios no deseados.
├── .prettierrc            # Configuración de Prettier para mantener un estilo de código consistente.
└── README.md              # Este archivo de documentación del proyecto.
```

---

## 🛠️ Tecnologías Utilizadas

Esta API ha sido construida sobre una pila de tecnologías modernas y eficientes, seleccionadas por su robustez y rendimiento:

### Lenguaje & Runtime:
- **Node.js:** Plataforma de JavaScript de código abierto para el lado del servidor.
- **TypeScript:** Un superconjunto tipado de JavaScript que compila a JavaScript plano, mejorando la calidad, la legibilidad y la mantenibilidad del código a gran escala.

### Framework Web:
- **Express.js:** Un framework web minimalista y flexible para Node.js, ampliamente utilizado para construir APIs RESTful.

### Base de Datos:
- **MongoDB:** Una base de datos NoSQL orientada a documentos, ideal para el almacenamiento flexible de datos de series de tiempo.
- **Mongoose:** Una poderosa librería de modelado de objetos para MongoDB en Node.js, que simplifica las interacciones con la base de datos y la validación de esquemas.

### Librerías de Análisis Numérico:
- **mathjs:** Una extensa biblioteca de matemáticas para JavaScript y Node.js, que proporciona funciones y operaciones matemáticas avanzadas, utilizada para cálculos estadísticos y numéricos.

### Métodos Numéricos Implementados:
- **Regresión Lineal:** Para el análisis de tendencias y la predicción de relaciones lineales.
- **Interpolación Lineal:** Esencial para rellenar datos faltantes y mantener la continuidad en las series de tiempo.
- **Interpolación de Lagrange:** Para la aproximación polinomial de funciones y la estimación de valores en puntos específicos.
- **Integración Numérica (Método de los Trapecios):** Para el cálculo de áreas bajo curvas, proporcionando una métrica de acumulación o impulso.