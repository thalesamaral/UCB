# Servidor (data e hora)

import socket
from datetime import datetime

def iniciar_servidor():
    
    HOST = '127.0.0.1' #IPv4 (4 blocos de 8 bits)
    PORT = 65432
    
    # Criando o socket TCP/IP
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as S:
        S.bind((HOST, PORT)) # Vincular o socket ao endereço e porta
        S.listen()
        print(f"Servidor ouvindo em {HOST}:{PORT}")
        
        while True:
            conn, addr = S.accept()
            with conn:
                print(f"Conectado por {addr}")
                while True:
                    data = conn.recv(1024)
                    if not data:
                        break
                
                    if data.decode().strip().lower() == "fatorial":
                        resposta = "numero"
                        conn.sendall(resposta.encode())
                        
                        data = conn.recv(1024)
                        N = data.decode()
                        
                        print(f"O número recebido é {N}")
                        N=int(N)
                        Fatorial = 1
                        for i in range(N):
                            Fatorial = Fatorial * (i + 1)
                        
                        resposta = f"O fatorial de {N} é {Fatorial}"
                        conn.sendall(resposta.encode())
                        print(f"Fatorial enviado.")
                    else:
                        conn.sendall("Mensagem inválida")

if __name__ == "__main__":
    iniciar_servidor()
                    
                    