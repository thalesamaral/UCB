import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import threading
import time

def buscar_palavra_no_site(url_inicial, palavra, profundidade_maxima=3):
    """
    Busca recursivamente uma palavra em todas as páginas do site usando threads simples.
    Parâmetros:
        url_inicial (str): URL inicial do site.
        palavra (str): Palavra a ser buscada.
        profundidade_maxima (int): Profundidade máxima de navegação.
    Retorna:
        dict: Dicionário onde as chaves são URLs e os valores indicam se a palavra foi encontrada.
    """

    urls_visitados = set()
    resultados = {}
    threads = []

    def buscar_recursivo(url_atual, profundidade_atual):
        if profundidade_atual > profundidade_maxima or url_atual in urls_visitados:
            return
        urls_visitados.add(url_atual)
        try:
            print(f"Buscando em: {url_atual} (Profundidade: {profundidade_atual})")
            response = requests.get(url_atual, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            conteudo = soup.get_text().lower()
            palavra_encontrada = palavra.lower() in conteudo
            resultados[url_atual] = palavra_encontrada
            links = soup.find_all('a', href=True)
            for link in links:
                url_completa = urljoin(url_inicial, link['href'])
                if url_completa.startswith(url_inicial) and url_completa not in urls_visitados:
                    thread = threading.Thread(target=buscar_recursivo, args=(url_completa, profundidade_atual + 1))
                    threads.append(thread)
                    thread.start()
        except requests.exceptions.RequestException as e:
            print(f"Erro ao acessar {url_atual}: {e}")

    buscar_recursivo(url_inicial, 1)
    # Espera todas as threads terminarem antes de continuar
    for thread in threads:
        thread.join()
    return resultados
# Exemplo de uso

if __name__ == "__main__":
    url_inicial = input("Digite a URL inicial do site (ex.: https://www.exemplo.com): ")
    palavra = input("Digite a palavra a ser buscada: ")
    
    start = time.time()
    resultados = buscar_palavra_no_site(url_inicial, palavra)
    end = time.time()
    
    print("\nResultados da busca:")
    for url, encontrada in resultados.items():
        status = "Encontrada" if encontrada else "Não encontrada"
        print(f"{url}: Palavra '{palavra}' {status}")
    
    print(f"\nTempo: {end - start:.4f} segundos")
