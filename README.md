# SeguroCRM

Aplicación web ligera tipo CRM orientada a equipos de venta de seguros. Permite que un administrador cree equipos de trabajo, comparta un código de acceso con sus agentes y supervise sus actividades (sesiones, leads, citas y mensajería interna).

## Requisitos

- Python 3.10+
- pip

## Instalación

```bash
python -m venv venv
source venv/bin/activate  # En Windows usa venv\Scripts\activate
pip install -r requirements.txt
```

## Ejecución

```bash
flask --app app.py --debug run
```

El servidor quedará disponible en `http://127.0.0.1:5000/`.

## Características principales

- Registro e inicio de sesión para administradores y agentes.
- Creación de equipos con un código único para invitar agentes.
- Panel de administrador con monitoreo de sesiones recientes, leads, citas y mensajes del equipo.
- Panel de agente para registrar leads, agendar citas y consultar actividades propias.
- Mensajería interna sencilla entre administradores y agentes del mismo equipo.

> ⚠️ La aplicación está pensada como un prototipo educativo. Para uso en producción cambia la clave secreta, utiliza HTTPS, agrega validaciones adicionales y un proveedor de base de datos robusto.
