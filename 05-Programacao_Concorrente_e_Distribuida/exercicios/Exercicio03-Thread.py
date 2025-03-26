from PIL import Image
import threading
import time

def processar_faixa(imagem, inicio, fim, resultado, indice):
    largura, altura = imagem.size
    for y in range(inicio, fim):
        linha = {}  # Criar um dicionário para armazenar a linha
        for x in range(largura):
            r, g, b = imagem.getpixel((x, y))
            luminancia = int(0.299 * r + 0.587 * g + 0.114 * b)
            linha[x] = luminancia  # Armazenar o valor da luminância no dicionário da linha
        resultado[y] = linha  # Armazenar a linha processada no dicionário resultado

def converter_para_preto_e_branco_thread(caminho_imagem, caminho_saida):
    try:
        # Abrir imagem
        imagem = Image.open(caminho_imagem)
        imagem = imagem.convert("RGB")
        largura, altura = imagem.size
        imagem_preto_branco = Image.new("L", (largura, altura))

        # Configuração de threads
        num_threads = 10
        threads = []
        resultado = {}  # Dicionário que armazenará os pixels processados
        fatia = altura // num_threads  # Divide a imagem em partes para as threads

        for i in range(num_threads):
            inicio = i * fatia
            fim = altura if i == num_threads - 1 else (i + 1) * fatia
            resultado[i] = {}  # Agora estamos inicializando corretamente como um dicionário
            thread = threading.Thread(target=processar_faixa, args=(imagem, inicio, fim, resultado[i], i))
            threads.append(thread)
            thread.start()

        # Espera todas as threads finalizarem
        for thread in threads:
            thread.join()

        # Combinar os resultados na imagem final
        for i in range(num_threads):
            for y, linha in resultado[i].items():  # Agora resultado[i] contém um dicionário
                for x, valor in linha.items():
                    imagem_preto_branco.putpixel((x, y), valor)

        # Salvar a imagem final
        imagem_preto_branco.save(caminho_saida)
        print(f"Imagem convertida com sucesso! Salva em: {caminho_saida}")

    except Exception as e:
        print(f"Erro ao processar a imagem: {e}")

if __name__ == "__main__":
    # adicionar caminho se não for utilizar tkinter
    caminho_imagem = "/workspaces/UCB-PCeD/exercicios/img.png"
    caminho_saida = "/workspaces/UCB-PCeD/exercicios/img2.png"
    
    start = time.time()
    converter_para_preto_e_branco_thread(caminho_imagem, caminho_saida)
    end = time.time()
    print(f"\nTempo com threads: {end - start:.4f} segundos")
