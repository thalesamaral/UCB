import threading
import time

# Variável global (acessada por todas as threads)

Contador = 0
lock = threading.Lock() 
# cria um objeto de lock que será usado para sincronizar o acesso à variável

def incrementar():
    global Contador
    for _ in range(100):
        lock.acquire() # Adquire acesso ao recurso (lock) antes de modificar a variável global
        try:
            Contador = Contador + 1
            print(Contador)
            time.sleep(0.1)
        finally:
            lock.release() # liberar o recurso (lock) após a modificação

threads = []

for i in range(10): # 10 threads
    thread = threading.Thread(target = incrementar)
    threads.append(thread)
    thread.start()
    
for thread in threads:
    thread.join()  # Aguarda todas as threads terminarem
    
print(f"Contador: {Contador}")

# Uma maneira mais limpa e legível de usar o lock é com o gerenciador de contexto with,
# que adquire e libera o lock automaticamente
def incrementar2():
    global contador
    for _ in range(1000):
        with lock:
            contador += 1