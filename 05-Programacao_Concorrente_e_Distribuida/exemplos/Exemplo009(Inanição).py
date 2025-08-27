import threading
import time

AP_Contador = 0 # Contador de alta prioridade
BP_Contador = 0 # Contador de baixa prioridade

L = threading.Lock()

def AltaPrioridade():
    global AP_Contador
    while True:
        with L:
            print("[Alta prioridade] usando o recurso")
            AP_Contador += 1
            time.sleep(0.5)

def BaixaPrioridade():
    global BP_Contador
    while True:
        with L:
            print("[Baixa prioridade] usando o recurso")
            BP_Contador += 1
            time.sleep(0.5)

#Criando as threads

t_AP = threading.Thread(target = AltaPrioridade, daemon=True)
t_BP = threading.Thread(target = BaixaPrioridade, daemon=True)

t_AP.start()
t_BP.start()

time.sleep(10)

print("\nRelatório:")
print(f"Thread de alta prioridade: {AP_Contador} vezes")
print(f"Thread de baixa prioridade: {BP_Contador} vezes")
