import threading
import time
from colorama import Fore, Style # Para adicionar cores

# Variável global compartilhada

shared_counter = 0

 # Lock para sincronização

lock = threading.Lock()

 # Função executada por cada thread (com sincronização)

def increment_counter():
    global shared_counter
    for _ in range(1000000): # Aumentado para 1 milhão de iterações
        with lock: # Seção crítica protegida por lock
            shared_counter += 1

# Versão da função sem sincronização (para comparação)

def increment_counter_no_lock():
    global shared_counter
    for _ in range(1000000): # Aumentado para 1 milhão de iterações
        shared_counter += 1 # Sem lock (não seguro)

 # Mede o tempo de execução com e sem sincronização

def measure_performance(num_threads, use_lock=True):
    global shared_counter
    shared_counter = 0 # Reinicia o contador 
    threads = []
    start_time = time.time()
    for _ in range(num_threads):
        if use_lock:
            thread = threading.Thread(target=increment_counter)
        else:
            thread = threading.Thread(target=increment_counter_no_lock)
        threads.append(thread)
        thread.start()
    for thread in threads:
        thread.join()
    end_time = time.time()
    elapsed_time = end_time - start_time
    return elapsed_time

# Função para criar um gráfico de barras simples no terminal

def create_bar_chart(value, max_value, label, color=Fore.WHITE):
    bar_length = int((value / max_value) * 50) # Escala para 50 caracteres
    bar = "#" * bar_length
    print(f"{color}{label}: {bar} ({value:.4f} segundos){Style.RESET_ALL}")
# Executa o teste

if __name__ == "__main__":
    num_threads = 20 # Número de threads (pode ser ajustado)

     # Teste com sincronização
    
    print("Executando com sincronização...")
    time_with_lock = measure_performance(num_threads, use_lock=True)
    print(f"Tempo com sincronização: {time_with_lock:.4f} segundos\n")
     
    # Teste sem sincronização

    print("Executando sem sincronização...")
    time_without_lock = measure_performance(num_threads, use_lock=False)
    print(f"Tempo sem sincronização: {time_without_lock:.4f} segundos\n")

    overhead = time_with_lock - time_without_lock
    overhead_percentage = (overhead / time_without_lock) * 100

# Resultados finais

    print(Fore.CYAN + "RESULTADOS FINAIS:" + Style.RESET_ALL)
    create_bar_chart(time_with_lock, max(time_with_lock, time_without_lock), "Com Sincronização", color=Fore.RED)
    create_bar_chart(time_without_lock, max(time_with_lock, time_without_lock), "Sem Sincronização", color=Fore.GREEN)
    print(f"\nOverhead de sincronização: {overhead:.4f} segundos")
    print(f"Aumento percentual no tempo: {overhead_percentage:.2f}%\n")
    # Mensagem descritiva

    if overhead_percentage > 50:
        print(Fore.YELLOW + "⚠️ AVISO: O overhead de sincronização é significativo!" + Style.RESET_ALL)
        print("Considere otimizar o uso de locks ou reduzir a contenção.")
    else:
        print("O overhead de sincronização está dentro de limites aceitáveis.")
