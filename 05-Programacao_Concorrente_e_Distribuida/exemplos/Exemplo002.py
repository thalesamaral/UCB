import threading
import time

def tarefa():
    print("Início...")
    time.sleep(5)
    print("Fim...")
    
# Bloco princila (main)

thread = threading.Thread(target = tarefa)
thread.start() # Iniciar a thread
thread.join() # Aguardar a conclusão da thread 
print("Thread principal finalizada")