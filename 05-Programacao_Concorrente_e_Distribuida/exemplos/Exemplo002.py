import threading
import time

def tarefa():
    print("Início...")
    time.sleep(5)
    print("Fim...")

# Bloco (main)
thread = threading.Thread(target = tarefa) # Cria thread que executará a função `tarefa`
thread.start() # Iniciar a thread
thread.join() # Aguardar a conclusão da thread
print("Thread principal finalizada")

# Comente o thread.join() para ver outro resultado