import random
import time

# Função principal do QuickSort

def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[-1]
    left = [x for x in arr[:-1] if x <= pivot]  # Elementos menores ou iguais ao pivô
    right = [x for x in arr[:-1] if x > pivot]  # Elementos maiores que o pivô
    return quicksort(left) + [pivot] + quicksort(right)

# Função para gerar números aleatórios

def gerar_numeros_aleatorios(n=100000, min_val=1, max_val=200000):
    return [random.randint(min_val, max_val) for _ in range(n)]

# Função principal para testar o QuickSort

if __name__ == "__main__":
    numeros = gerar_numeros_aleatorios()
    
    print("Primeiros 10 números antes da ordenação:", numeros[:10])
    start = time.time()
    numeros_ordenados = quicksort(numeros)
    end = time.time()
    print("\nPrimeiros 10 números após a ordenação:", numeros_ordenados[:10])
    print(f"\nTempo sequencial: {end - start:.4f} segundos\n")
