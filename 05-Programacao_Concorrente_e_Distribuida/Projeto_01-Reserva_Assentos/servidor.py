
import socket
import threading

assentos = [False] * 100
lock = threading.Lock()

def formatar_assentos():
    matriz = ""
    for i in range(10):
        linha = ""
        for j in range(10):
            idx = i * 10 + j
            simbolo = "X" if assentos[idx] else str(idx + 1).zfill(2)
            linha += simbolo + " "
        matriz += linha.strip() + "\n"
    return matriz.strip()

def processar_cliente(conn, addr):
    print(f"[NOVO CLIENTE] Conectado: {addr}")
    while True:
        try:
            dados = conn.recv(1024).decode()
            if not dados:
                break

            if dados.lower() == 'mostrar':
                with lock:
                    matriz = formatar_assentos()
                conn.send(matriz.encode())
                continue
            elif dados.lower() == 'sair':
                conn.send("Encerrando conexão.".encode())
                break

            indices = list(map(int, dados.strip().split(',')))
            sucesso = True
            mensagem = ""

            with lock:
                for i in indices:
                    if assentos[i - 1]:
                        sucesso = False
                        mensagem = f"Assento {i} já reservado. Reserva falhou."
                        break

                if sucesso:
                    for i in indices:
                        assentos[i - 1] = True
                    mensagem = f"Reserva realizada com sucesso: {indices}"

            print(f"[{addr}] {mensagem}")
            conn.send(mensagem.encode())

        except Exception as e:
            print(f"[ERRO] Cliente {addr}: {e}")
            break

    conn.close()
    print(f"[DESCONECTADO] Cliente {addr}")

def iniciar_servidor():
    host = 'localhost'
    porta = 12345
    servidor = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    servidor.bind((host, porta))
    servidor.listen()

    print(f"[SERVIDOR] Rodando em {host}:{porta}")

    while True:
        conn, addr = servidor.accept()
        thread = threading.Thread(target=processar_cliente, args=(conn, addr))
        thread.start()

if __name__ == "__main__":
    iniciar_servidor()
