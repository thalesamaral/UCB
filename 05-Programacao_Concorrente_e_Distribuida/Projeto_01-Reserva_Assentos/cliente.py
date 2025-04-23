
import socket

def menu():
    print("\n--- Menu de Reservas ---")
    print("1. Visualizar assentos")
    print("2. Reservar assentos")
    print("3. Sair")
    return input("Escolha uma opção: ")

def cliente():
    host = "localhost"
    porta = 12345

    cliente = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    cliente.connect((host, porta))

    while True:
        opcao = menu()

        if opcao == "1":
            cliente.send("ver".encode())
            resposta = cliente.recv(4096).decode()
            print(f"\n{resposta}")
        elif opcao == "2":
            entrada = input("Digite os números dos assentos (ex: 5,12,99): ")
            pedido = "reservar," + entrada
            cliente.send(pedido.encode())
            resposta = cliente.recv(4096).decode()
            print(f"\n{resposta}")
        elif opcao == "3":
            cliente.send("sair".encode())
            print("Encerrando conexão.")
            break
        else:
            print("Opção inválida.")

    cliente.close()

if __name__ == "__main__":
    cliente()
