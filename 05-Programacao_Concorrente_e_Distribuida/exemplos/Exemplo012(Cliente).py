# Cliente

import socket
def iniciar_cliete():
    
    HOST = '127.0.0.1' #IPv4 (4 blocos de 8 bits)
    PORT = 65432
    
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as S:
        S.connect((HOST, PORT))
        print("Conectado ao servidor: solicitando data e hora...")
        
        S.sendall(b"data e hora")
        data = S.recv(1024)
        
        print(f"Resposta do servidor: {data.decode()}")

if __name__ == "__main__":
    iniciar_cliete()