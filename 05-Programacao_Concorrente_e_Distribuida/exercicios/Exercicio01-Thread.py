import random
import threading
import time

def quicksort_thread(arr, result_holder, index):
    sorted_arr = quicksort(arr)
    result_holder[index] = sorted_arr

def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[-1]
    left = [x for x in arr[:-1] if x <= pivot]
    right = [x for x in arr[:-1] if x > pivot]

    # Se a lista for pequena, não vale a pena criar threads
    if len(arr) < 1000:
        return quicksort(left) + [pivot] + quicksort(right)

    # Criando um dicionário para armazenar os resultados das threads
    result_holder = {}

    # Criando as threads para left e right
    t1 = threading.Thread(target=quicksort_thread, args=(left, result_holder, 'left'))
    t2 = threading.Thread(target=quicksort_thread, args=(right, result_holder, 'right'))

    # Iniciando as threads
    t1.start()
    t2.start()

    # Esperando as threads terminarem
    t1.join()
    t2.join()

    return result_holder['left'] + [pivot] + result_holder['right']

def gerar_numeros_aleatorios(n=100000, min_val=1, max_val=20000):
    return [random.randint(min_val, max_val) for _ in range(n)]

if __name__ == "__main__":
    numeros = gerar_numeros_aleatorios()

    print("Primeiros 10 números antes da ordenação:", numeros[:10])

    # Sem threads (versão sequencial)
    start = time.time()
    numeros_ordenados_seq = quicksort(numeros.copy())
    end = time.time()
    print("\nPrimeiros 10 números após a ordenação (sequencial):", numeros_ordenados_seq[:10])
    print(f"\nTempo sequencial: {end - start:.4f} segundos\n")

    # Com threads (versão paralela)
    start = time.time()
    result_holder = {}
    quicksort_thread(numeros.copy(), result_holder, 'final')
    numeros_ordenados_paralelo = result_holder['final']
    end = time.time()
    print("\nPrimeiros 10 números após a ordenação (paralelo):", numeros_ordenados_paralelo[:10])
    print(f"\nTempo com threads: {end - start:.4f} segundos")
