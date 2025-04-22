
import socket
import threading
import random
import time

NUM_CLIENTES = 10
MAX_ASSENTOS_POR_CLIENTE = 5

def simular_cliente(id_cliente):
    try:
        cliente = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        cliente.connect(('localhost', 12345))

        assentos = random.sample(range(1, 101), random.randint(1, MAX_ASSENTOS_POR_CLIENTE))
        assentos_str = ','.join(map(str, assentos))

        print(f"[CLIENTE {id_cliente}] Tentando reservar assentos: {assentos_str}")
        cliente.send(assentos_str.encode())

        resposta = cliente.recv(1024).decode()
        print(f"[CLIENTE {id_cliente}] Resposta: {resposta}")

        cliente.close()
    except Exception as e:
        print(f"[CLIENTE {id_cliente}] Erro: {e}")

def iniciar_simulacao():
    threads = []

    for i in range(NUM_CLIENTES):
        t = threading.Thread(target=simular_cliente, args=(i+1,))
        t.start()
        threads.append(t)
        time.sleep(0.2)

    for t in threads:
        t.join()

    print("\nSimulação finalizada.")

if __name__ == "__main__":
    iniciar_simulacao()
