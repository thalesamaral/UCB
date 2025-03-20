import threading
import time

def tarefa():
    print("Início...")
    time.sleep(5)
    print("Fim...")
    
# Bloco princila (main)

tA = threading.Thread(target=tarefa)
tB = threading.Thread(target=tarefa)

tA.start()
tA.join()
tB.start()
tB.join()

print("Thread principal finalizada!")
