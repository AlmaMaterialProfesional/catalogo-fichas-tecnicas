# Catálogo de fichas técnicas

Sitio web estático para consultar las fichas técnicas (PDF) de los productos del catálogo. Pensado para escanear desde un código QR impreso en la contraportada del catálogo físico.

## Cómo funciona

- `index.html`, `style.css`, `app.js`: la página pública. Lee `content/products.json` y muestra los productos en tarjetas con buscador y filtro por categoría.
- `content/products.json`: la "base de datos" de productos (un único archivo).
- `admin/`: panel de administración (Decap CMS) para añadir, editar o borrar productos con formularios, sin tocar código.
- `uploads/`: aquí se guardan las imágenes y PDFs que se suban desde el panel.

No hace falta Node.js, npm, ni ningún paso de compilación. Es HTML/CSS/JS puro.

## Puesta en marcha (una sola vez)

### 1. Subir el código a GitHub

1. Crea una cuenta gratuita en [github.com](https://github.com) si no tienes una.
2. Crea un repositorio nuevo **vacío** (sin README, sin licencia) — por ejemplo `catalogo-fichas-tecnicas`.
3. Copia la URL del repositorio (algo como `https://github.com/tu-usuario/catalogo-fichas-tecnicas.git`).
4. Desde esta carpeta, ejecuta:
   ```
   git remote add origin https://github.com/tu-usuario/catalogo-fichas-tecnicas.git
   git branch -M main
   git push -u origin main
   ```

### 2. Publicar en Netlify (gratis)

1. Crea una cuenta gratuita en [netlify.com](https://netlify.com) (puedes entrar directamente con tu cuenta de GitHub).
2. "Add new site" → "Import an existing project" → elige GitHub → selecciona el repositorio.
3. Configuración de build:
   - **Build command**: (dejar vacío)
   - **Publish directory**: `.`
4. Haz clic en "Deploy site". En 1-2 minutos tendrás una URL tipo `https://nombre-aleatorio.netlify.app`.
5. (Opcional) En "Site settings" puedes cambiar el nombre del sitio o conectar tu propio dominio.

### 3. Activar el panel de administración (Netlify Identity + Git Gateway)

1. En el panel de Netlify de tu sitio: **Site configuration → Identity → Enable Identity**.
2. En "Registration preferences" selecciona **Invite only** (para que nadie externo pueda crear una cuenta).
3. Ve a **Identity → Services → Git Gateway** y actívalo (permite que el panel guarde los cambios en GitHub sin que el usuario necesite una cuenta de GitHub).
4. Ve a la pestaña **Identity** de tu sitio y usa **Invite users** para invitarte a ti mismo (o a quien vaya a editar el catálogo) con tu email. Te llegará un correo para poner una contraseña.

### 4. Probar el panel

1. Entra a `https://tu-sitio.netlify.app/admin/`.
2. Inicia sesión con el email/contraseña del paso anterior.
3. Añade un producto de prueba (nombre, categoría, imagen, PDF de la ficha técnica).
4. Guarda/publica el cambio. En 1-2 minutos el sitio se actualiza automáticamente y el producto aparece en la página principal.
5. Borra los dos productos de ejemplo ("Producto de ejemplo 1/2") desde el panel cuando ya no los necesites.

### 5. Generar el código QR

Una vez tengas la URL final (la de Netlify o tu dominio propio), genera un QR que apunte a esa URL con cualquier generador de QR gratuito (por ejemplo qr-code-generator.com o el propio Google) y colócalo en la contraportada del catálogo.

## Uso diario (añadir/editar productos)

No hace falta volver a tocar nada de este README ni el código: basta con entrar a `/admin/`, iniciar sesión, y usar los formularios para añadir, editar o eliminar productos. Cada cambio se publica solo en 1-2 minutos.
