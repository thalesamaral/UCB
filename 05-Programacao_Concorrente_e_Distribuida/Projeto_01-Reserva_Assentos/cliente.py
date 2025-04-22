
import socket

def cliente():
    host = 'localhost'
    porta = 12345

    cliente = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    cliente.connect((host, porta))

    print("Conectado ao servidor de reservas.")
    print("Digite os assentos desejados separados por vírgula (ex: 1,5,20), 'mostrar' para exibir a matriz ou 'sair' para encerrar.")

    while True:
        entrada = input("Comando: ")
        if entrada.lower() in ['sair', 'mostrar']:
            cliente.send(entrada.lower().encode())
        else:
            cliente.send(entrada.encode())

        resposta = cliente.recv(4096).decode()
        print(f"[RESPOSTA]\n{resposta}")

        if entrada.lower() == 'sair':
            break

    cliente.close()

if __name__ == "__main__":
    cliente()
