import os
import platform

def obtener_ruta_directorio():
    return os.path.dirname(os.path.abspath(__file__))

def programar_tarea_cron():
    ruta_script = os.path.join(obtener_ruta_directorio(), "manage.py")
    comando = '* * * * * /usr/bin/python3 {ruta_script} start_scheduler\n'  # Cambiado a start_scheduler
    with os.popen('crontab -l') as cron_actual:
        tareas = cron_actual.read()

    if comando not in tareas:
        with os.popen(f'crontab -l | {{ cat; echo "{comando}"; }} | crontab -') as f:
            f.read()
        print("Tarea programada en cron para ejecutarse cada minuto.")

def tarea_existe_windows(tarea_nombre):
    return os.system(f"schtasks /query /tn {tarea_nombre} >nul 2>&1") == 0

def programar_tarea_windows():
    ruta_script = os.path.join(obtener_ruta_directorio(), "manage.py")  # Solo manage.py
    ruta_python = r"C:\Users\ACER\Documents\API_CADI\env\Scripts\python.exe"
    comando = f"schtasks /create /tn MyPythonTask /tr \"cmd /k {ruta_python} {ruta_script} start_scheduler\" /sc minute /mo 1"  # Cambiado a start_scheduler
    os.system(comando)
    print("Tarea programada en el Programador de Tareas de Windows para ejecutarse cada minuto.")

# Detectar sistema operativo
so = platform.system()
if so in ["Linux", "Darwin"]:
    programar_tarea_cron()
elif so == "Windows":
    tarea_nombre = "MyPythonTask"
    if not tarea_existe_windows(tarea_nombre):
        programar_tarea_windows()
    else:
        print(f"La tarea '{tarea_nombre}' ya existe, no se reprogramará.")
 