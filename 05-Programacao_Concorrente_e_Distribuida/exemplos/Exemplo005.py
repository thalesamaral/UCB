import threading
import time

# Variável global (acessada por todas as threads)

Contador = 0
lock = threading.Lock()

def incrementar():
    global Contador
    for _ in range(100):
        lock.acquire() # Adquire acesso ao recurso (variável)
        try:
            Contador = Contador + 1
            print(Contador)
            time.sleep(0.1)
        finally:
            lock.release() # liberar o recurso (variável)

threads = []

for i in range(10):
    thread = threading.Thread(target = incrementar)
    threads.append(thread)
    thread.start()
    
for thread in threads:
    thread.join()
    
print(f"Contador: {Contador}")