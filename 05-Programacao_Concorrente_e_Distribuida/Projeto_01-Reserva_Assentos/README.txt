
========================
Sistema de Reserva de Assentos (Concorrência)
========================

Arquivos:
- servidor.py: Inicia o servidor de reserva de assentos.
- cliente.py: Interface interativa para o usuário reservar assentos.
- simulador_clientes.py: Simula vários clientes reservando ao mesmo tempo.
- README.txt: Este arquivo de instruções.

Como executar:

1. Abra um terminal e inicie o servidor:
   python servidor.py

2. Em outro terminal, execute o cliente:
   python cliente.py

   - Digite assentos separados por vírgula (ex: 1,2,3)
   - Digite 'mostrar' para exibir a matriz de assentos
   - Digite 'sair' para encerrar

3. Para simular múltiplos clientes automaticamente:
   python simulador_clientes.py

   - O servidor mostrará as reservas e conflitos ocorridos.

Requisitos:
- Python 3.x
