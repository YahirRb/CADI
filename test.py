# test.py
from rq import Queue
from redis import Redis
from tasks import tarea_prueba  # Asegúrate de que este es el nombre correcto del archivo

# Conéctate a Redis
redis_conn = Redis()

# Crea una nueva cola
queue = Queue(connection=redis_conn)

# Encola la tarea
queue.enqueue(tarea_prueba)  # Encola la función directamente

if __name__ == "__main__":
    print("Tarea encolada.")
