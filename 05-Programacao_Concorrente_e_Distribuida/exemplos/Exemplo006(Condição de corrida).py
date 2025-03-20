import threading
import time

# Variável global (acessada por todas as threads)

Contador = 0

def incrementar():
    global Contador
    for _ in range(5000):
        V = Contador
        time.sleep(0.01)
        Contador = V + 1

threads = []

for i in range(50):
    t = threading.Thread(target = incrementar)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print(f"Valor final: {Contador}")