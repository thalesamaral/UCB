import threading
import time

Contador = 0
TempoTotal = 0
L = threading.Lock()

def incrementar():
    global Contador
    global TempoTotal
    t0 = time.time()
    for _ in range(1000000):
        #with L:
        Contador+= 1
    tf = time.time()
    delta_t = tf - t0
    TempoTotal = TempoTotal + delta_t
    print(f"Tempo gasto: {delta_t}")
    
#Criando as threads

threads = [threading.Thread(target = incrementar) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()

print(f"Contador: {Contador} vezes")
print(f"Tempo total: {TempoTotal :.2f} segundos")
