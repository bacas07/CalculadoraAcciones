# 📈 Forex Predict API

API para interpolación y predicción de tendencias en datos financieros usando métodos numéricos.

**License:** MIT  
**Stack:** Node.js · TypeScript · MongoDB · Express

---

## 📋 Tabla de Contenidos

- [🛠️ Instalación](#🛠️-instalación)  
- [⚙️ Configuración](#⚙️-configuración)  
- [📚 Documentación de la API](#📚-documentación-de-la-api)  
  - [Forex Request](#forex-request)  
  - [Forex Response](#forex-response)  
- [🚀 Ejemplos de Uso](#🚀-ejemplos-de-uso)  
- [📂 Estructura del Proyecto](#📂-estructura-del-proyecto)  
- [🛠️ Tecnologías](#🛠️-tecnologías)  
- [📄 Licencia](#📄-licencia)  
- [🤝 Contribuciones](#🤝-contribuciones)

---

## 🛠️ Instalación

### Prerrequisitos

- Node.js v18+  
- npm v9+  
- MongoDB 6.0+

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/forex-predict.git
cd forex-predict

# 2. Instalar dependencias
npm install

# 3. Copiar y editar variables de entorno
cp .env.example .env
# Ajusta PORT y MONGODB_URI en .env

# 4. Iniciar el servidor en modo desarrollo
npm run dev
```

---

## ⚙️ Configuración

Crea un archivo `.env` basado en `.env.example` con estas variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/forex-predict
```

---

## 📚 Documentación de la API

### Forex Request

| Método | Ruta                          | Descripción                               |
| ------ | ----------------------------- | ----------------------------------------- |
| POST   | `/forex-request/create`       | Crea una nueva solicitud de predicción.   |
| GET    | `/forex-request/findall`      | Obtiene todas las solicitudes.            |
| GET    | `/forex-request/findbyid/:id` | Busca una solicitud por su ID.            |
| DELETE | `/forex-request/delete/:id`   | Elimina una solicitud por su ID.          |

**Ejemplo de Request (POST)**

```json
{
  "data": [
    { "timestamp": "2024-01-01T00:00:00Z", "value": 1.2000 },
    { "timestamp": "2024-01-02T00:00:00Z", "value": null }
  ],
  "timeRange": "3d"
}
```

---

### Forex Response

| Método | Ruta                                  | Descripción                                           |
| ------ | ------------------------------------- | ----------------------------------------------------- |
| POST   | `/forex-response/create`              | Genera una respuesta de predicción basada en solicitud. |
| GET    | `/forex-response/findall`             | Obtiene todas las respuestas almacenadas.             |
| GET    | `/forex-response/findbyid/:id`        | Busca una respuesta por su ID.                        |
| GET    | `/forex-response/findbyrequestid/:id` | Busca respuestas por ID de solicitud asociada.        |
| DELETE | `/forex-response/delete/:id`          | Elimina una respuesta por su ID.                      |

**Ejemplo de Response (POST)**

```json
{
  "historical": [
    { "timestamp": "2024-01-01T00:00:00Z", "value": 1.2000 },
    { "timestamp": "2024-01-02T00:00:00Z", "value": 1.2050 }
  ],
  "predicted": [
    { "timestamp": "2024-01-05T00:00:00Z", "value": 1.2100 }
  ],
  "requestID": "65a1b2c3d4e5f6a7b8c9d0e1"
}
```

---

## 🚀 Ejemplos de Uso

1. **Crear una solicitud de predicción**  
   ```bash
   curl -X POST http://localhost:3000/forex-request/create \
     -H "Content-Type: application/json" \
     -d '{
       "data": [
         { "timestamp": "2024-01-01T00:00:00Z", "value": 1.2000 },
         { "timestamp": "2024-01-02T00:00:00Z", "value": null }
       ],
       "timeRange": "3d"
     }'
   ```

2. **Generar una respuesta de predicción**  
   ```bash
   curl -X POST http://localhost:3000/forex-response/create \
     -H "Content-Type: application/json" \
     -d '{
       "requestID": "65a1b2c3d4e5f6a7b8c9d0e1"
     }'
   ```

---

## 📂 Estructura del Proyecto

```
forex-predict/
├── src/
│   ├── controllers/       # Controladores de endpoints
│   ├── database/          # Configuración de MongoDB
│   ├── models/            # Modelos y servicios de datos
│   ├── routes/            # Definición de rutas
│   ├── schemas/           # Esquemas de Mongoose
│   ├── services/          # Lógica de interpolación y predicción
│   ├── types/             # Interfaces de TypeScript
│   ├── utils/             # Utilidades (manejo de fechas)
│   └── server.ts          # Punto de entrada
├── .env.example           # Plantilla de variables de entorno
├── package.json
└── README.md
```

---

## 🛠️ Tecnologías

- **Lenguaje & Runtime:** Node.js · TypeScript  
- **Framework:** Express  
- **Base de Datos:** MongoDB · Mongoose  
- **Métodos Numéricos:** Interpolación lineal · Regresión lineal  
- **Herramientas:**  
  - Postman (pruebas)  
  - Math.js (cálculos)

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

## 🤝 Contribuciones

¡Contribuciones son bienvenidas!  
Si deseas mejorar este proyecto, por favor:

1. Abre un **Issue** para discutir tu idea.  
2. Realiza un **Fork** del repositorio.  
3. Crea una **Branch** para tu feature o fix (`git checkout -b feature/mi-mejora`).  
4. Haz **Commit** de tus cambios (`git commit -m "feat: descripción de la mejora"`).  
5. Sube tu Branch y abre un **Pull Request**.

---

Desarrollado con ❤️ por **[Mateo Baca]**  
Cumpliendo los requisitos del curso de Modelamiento Numérico – Universidad de la Costa.
