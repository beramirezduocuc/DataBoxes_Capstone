#!/bin/bash

###################################################################################
#ESTE SCRIPT ES PARA EJECUTAR EL SERVIDOR EN LINUX, SI ESTAS EN WINDOWS, IGNORALO.#
###################################################################################

# Función para manejar la salida del script
cleanup() {
    echo "Cerrando servidores..."

    # Verificar y matar Tailwind si aún está corriendo
    if ps -p $TAILWIND_PID > /dev/null; then
        kill $TAILWIND_PID
    fi

    # Verificar y matar Django si aún está corriendo
    if ps -p $DJANGO_PID > /dev/null; then
        kill $DJANGO_PID
    fi

    exit 0
}

# Capturar señales para ejecutar la función de limpieza
trap cleanup SIGINT SIGTERM

# Navegar a los directorios correspondientes y activar el entorno virtual
cd ..
cd venv
source bin/activate
cd ..
cd main


python3 manage.py runserver 
DJANGO_PID=$!  # Guardar el PID de Django

python3 manage.py tailwind start 
TAILWIND_PID=$!  # Guardar el PID de Tailwind

# Esperar un par de segundos para asegurar que los procesos inicien
sleep 2

# Mostrar mensaje de confirmación
cowsay "¡Listo!"

# Esperar a que se presione Enter o que se cierre la terminal
read -p "[ENTER] para detener la página"

# Limpiar al salir
cleanup
