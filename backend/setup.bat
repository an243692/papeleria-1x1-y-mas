@echo off
echo ========================================
echo   CONFIGURACION DEL BACKEND
echo   Papeleria 1x1 y Mas
echo ========================================
echo.

REM Verificar si existe .env
if exist .env (
    echo [OK] Archivo .env encontrado
) else (
    echo [!] Creando archivo .env desde .env.example...
    copy .env.example .env
    echo.
    echo [IMPORTANTE] Edita el archivo .env con tus credenciales:
    echo   - STRIPE_SECRET_KEY
    echo   - STRIPE_WEBHOOK_SECRET
    echo   - CLIENT_URL (opcional, default: http://localhost:5173)
    echo.
)

REM Verificar si existe serviceAccountKey.json
if exist serviceAccountKey.json (
    echo [OK] serviceAccountKey.json encontrado
) else (
    echo [!] No se encontro serviceAccountKey.json
    echo.
    echo Descarga el archivo desde Firebase Console:
    echo 1. Ve a https://console.firebase.google.com/
    echo 2. Selecciona tu proyecto: papeleria-1x1-y-mas
    echo 3. Ve a Configuracion del proyecto ^> Cuentas de servicio
    echo 4. Haz clic en "Generar nueva clave privada"
    echo 5. Guarda el archivo como serviceAccountKey.json en esta carpeta
    echo.
)

REM Verificar si node_modules existe
if exist node_modules (
    echo [OK] Dependencias instaladas
) else (
    echo [!] Instalando dependencias...
    call npm install
)

echo.
echo ========================================
echo   LISTO PARA INICIAR
echo ========================================
echo.
echo Para iniciar el servidor en modo desarrollo:
echo   npm run dev
echo.
echo Para iniciar en modo produccion:
echo   npm start
echo.
pause
