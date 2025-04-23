import socket
import threading

# Estado dos assentos: False = livre, True = reservado
assentos = [False] * 100
lock = threading.Lock()

def tratar_cliente(conn, addr):
    print(f"[+] Conexão estabelecida com {addr}")

    while True:
        try:
            dados = conn.recv(1024).decode()
            if not dados:
                break

            pedido = dados.split(",")
            if pedido[0] == "reservar":
                indices = list(map(int, pedido[1:]))
                sucesso = []
                falha = []

                with lock:
                    for i in indices:
                        idx = i - 1
                        if 0 <= idx < 100:
                            if not assentos[idx]:
                                assentos[idx] = True
                                sucesso.append(i)
                            else:
                                falha.append(i)
                        else:
                            falha.append(i)

                if falha:
                    resposta = f"Falha na reserva dos assentos: {falha}"
                else:
                    resposta = f"Assentos reservados com sucesso: {sucesso}"

                print(f"[{addr}] {resposta}")
                conn.send(resposta.encode())
            elif pedido[0] == "ver":
                with lock:
                    matriz = ""
                    for i in range(10):
                        linha = ""
                        for j in range(10):
                            idx = i * 10 + j
                            simbolo = "X " if assentos[idx] else str(idx + 1).zfill(2)
                            linha += simbolo + " "
                        matriz += linha.strip() + "\n"
                conn.send(matriz.strip().encode())
        except:
            break

    conn.close()
    print(f"[-] Conexão encerrada com {addr}")

def iniciar_servidor():
    host = "localhost"
    porta = 12345

    servidor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    servidor.bind((host, porta))
    servidor.listen()

    print(f"[SERVIDOR] Servidor iniciado em {host}:{porta}")
    print("[SERVIDOR] Aguardando conexões...")

    while True:
        conn, addr = servidor.accept()
        thread = threading.Thread(target=tratar_cliente, args=(conn, addr))
        thread.start()

if __name__ == "__main__":
    iniciar_servidor()
