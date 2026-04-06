# Configuración Backend: Redis & n8n para Respuestas Inmediatas

## 1. Configurar Redis en tu VPS
Next.js utiliza Redis para recordar el historial de conversación del usuario ("memoria"). La forma más rápida y segura de correr Redis en tu VPS (Ubuntu/Debian) es usando Docker.

Conéctate a tu VPS por SSH y ejecuta este comando en la terminal:
```bash
docker run -d --name redis-server -p 6379:6379 --restart always redis:alpine
```
*(Si no tienes Docker, instálalo primero con `sudo apt update && sudo apt install docker.io`)*

Luego, en tu archivo `.env.local` en tu proyecto y en las variables de entorno de **Vercel**, debes poner la IP de tu servidor:
```env
# Por ahora para localhost déjalo así si corres Redis local, o pon la IP de tu VPS:
REDIS_URL=redis://123.456.789.0:6379  <-- Cambia por la IP de tu VPS
```

---

## 2. Configurar n8n para Respuestas Inmediatas
En tu flujo de n8n (AI Agent), necesitamos cambiar la forma en la que responde. Al trabajar con WebSockets (Pusher), n8n debe ser el encargado de notificar a tu página web que la respuesta ya está lista.

### Paso A: Notificar inmediatamente que el mensaje llegó
1. Abre tu nodo **Webhook** (el que recibe la solicitud de Next.js).
2. En las configuraciones, busca **Respond** y selecciona **"Immediately"** (en vez de "When last node finishes").
3. Al hacer esto, n8n enviará un `200 OK` al instante, evitando que Vercel se quede cargando permanentemente.

### Paso B: Enviar el resultado del LLM de vuelta mediante HTTP Request
Al final total de tu flujo (después de que el modelo de Gemini haya contestado), añade un nodo **HTTP Request**:

- **Method**: `POST`
- **URL**: `http://tu_ip_o_ngrok_url/api/webhook/n8n` *(Como lo vas a probar local, asegúrate de correr ngrok o localtunnel en el puerto 3000 de tu PC, y usa esa URL. Si lo subes a Vercel, usa la URL de Vercel).*
- **Send Body**: Activado (ON)
- **Cuerpo del Mensaje (JSON Mapeado)**:
  Debes mandar el `sessionId` que Next.js te envió al principio, y el texto. Utiliza las variables dinámicas de n8n arrastrándolas:
  ```json
  {
    "sessionId": "{{ $('Webhook').item.json.body.sessionId }}",
    "message": "{{ $json.output }}" 
  }
  ```
*(Revisa que `$json.output` coincida con la propiedad donde llega tu texto desde el AI Agent)*.

¡Y listo! Al final de esto n8n "disparará" su mensaje hacia la API que estamos a punto de crear.
