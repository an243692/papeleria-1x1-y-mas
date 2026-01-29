@echo off
echo ========================================
echo   GUARDAR LOGO DE EMPAQUES PARLER
echo ========================================
echo.

set "BRANDS_DIR=c:\Users\Victor Andre\papeleria 1x1 y mas\frontend\public\brands"
set "LOGO_FILE=empaques-parler.png"

echo Verificando carpeta de destino...
if not exist "%BRANDS_DIR%" (
    echo ERROR: La carpeta brands no existe
    echo Ruta: %BRANDS_DIR%
    pause
    exit /b 1
)

echo.
echo INSTRUCCIONES:
echo.
echo 1. Guarda la imagen del logo de Empaques Parler como: %LOGO_FILE%
echo 2. Arrastra el archivo a esta ventana y presiona ENTER
echo 3. El script lo copiara a la ubicacion correcta
echo.

set /p "SOURCE_FILE=Arrastra aqui el archivo %LOGO_FILE% y presiona ENTER: "

REM Quitar comillas si las hay
set "SOURCE_FILE=%SOURCE_FILE:"=%"

if not exist "%SOURCE_FILE%" (
    echo.
    echo ERROR: El archivo no existe o la ruta es incorrecta
    echo Ruta proporcionada: %SOURCE_FILE%
    pause
    exit /b 1
)

echo.
echo Copiando archivo...
copy "%SOURCE_FILE%" "%BRANDS_DIR%\%LOGO_FILE%"

if exist "%BRANDS_DIR%\%LOGO_FILE%" (
    echo.
    echo ========================================
    echo   EXITO!
    echo ========================================
    echo.
    echo El logo se guardo correctamente en:
    echo %BRANDS_DIR%\%LOGO_FILE%
    echo.
    echo Ahora recarga la pagina de tu tienda (Ctrl + F5)
    echo y el logo deberia aparecer en el carrusel.
    echo.
) else (
    echo.
    echo ERROR: No se pudo copiar el archivo
    pause
    exit /b 1
)

pause
