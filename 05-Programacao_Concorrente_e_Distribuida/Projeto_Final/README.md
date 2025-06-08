# **Instruções de Execução do Projeto**

Este guia detalha os passos necessários para configurar o ambiente e executar os scripts do projeto de análise de desempenho dos tribunais.

**1. Pré-requisitos**

Antes de executar os scripts, é necessário ter o Python e as bibliotecas necessárias instaladas no seu sistema.

- **Python:** O projeto foi desenvolvido e testado com Python 3.11 ou superior.
- **Bibliotecas Python:** Instale as seguintes bibliotecas usando o `pip` (gerenciador de pacotes do Python). Abra seu terminal ou prompt de comando e execute os seguintes comandos:
    
    ```bash
    pip install pandas
    pip install numpy
    pip install matplotlib
    ```
    

**1.1. Descompacte os Dados de Entrada**

Os dados utilizados pelo projeto são fornecidos em um arquivo compactado.

- **Ação Necessária:** Localize o arquivo `PASTA_DADOS_CSV.zip` na pasta do projeto e **descompacte-o**.
- **Resultado Esperado:** Após a descompactação, você terá uma pasta chamada `PASTA_DADOS_CSV` contendo todos os 90 arquivos `.csv` necessários para a análise.

**2. Estrutura de Pastas**

Para que os scripts funcionem corretamente, os arquivos do projeto devem ser organizados na seguinte estrutura de pastas:

```bash
PROJETO_FINAL/
|
|-- PASTA_DADOS_CSV/          <-- Pasta criada após descompactar o .zip
|   |-- teste_STJ.csv
|   |-- teste_TJAC.csv
|   |-- teste_TRT1.csv
|   |-- ... (todos os 90 arquivos .csv)
|
|-- Versao_NP.py
|-- Versao_P.py
|-- gerar_graficos.py (é necessário o arquivo .csv Resumo Metas)
|
|-- PASTA_DADOS_CSV.zip       <-- O arquivo original compactado
|-- (Pasta GRAFICOS/ será criada automaticamente)
|-- (Arquivo Consolidado_NP.csv será criado aqui)
|-- (Arquivo ResumoMetas_NP.csv será criado aqui)
|-- (Arquivo Consolidado_P.csv será criado aqui)
|-- (Arquivo ResumoMetas_P.csv será criado aqui)
```

- **`PROJETO_FINAL/`**: A pasta principal do seu projeto.
- **`PASTA_DADOS_CSV/`**: Uma subpasta contendo **todos os 90 arquivos CSV** originais dos tribunais. Os scripts estão configurados para ler os dados desta pasta.

**3. Execução dos Scripts**

Execute os scripts a partir do terminal, estando no diretório principal do projeto (`PROJETO_FINAL/`).

**3.1. Execução da Versão Sequencial (`Versao_NP.py`)**

Este script executa todo o processo de forma sequencial. Ele irá ler todos os 90 arquivos, gerar o `Consolidado_NP.csv` e, em seguida, o `ResumoMetas_NP.CSV`.

- **Comando:**
    
    ```bash
    python Versao_NP.py
    ```
    
- **Saída:** Ao final da execução, os arquivos `Consolidado_NP.csv` e `ResumoMetas_NP.CSV` serão criados na pasta principal do projeto. Os tempos de execução de cada etapa serão impressos no terminal para análise de speedup.

**3.2. Execução da Versão Paralela (`Versao_P.py`)**

Este script executa a Etapa 1 (consolidação) e a Etapa 2 (cálculo de metas) de forma paralelizada para otimizar o desempenho.

- **Comando:**
    
    ```bash
    python Versao_P.py
    ```
    
- **Saída:** Ao final da execução, os arquivos `Consolidado_P.csv` e `ResumoMetas_P.CSV` serão criados na pasta principal. Os tempos de execução de cada etapa serão impressos no terminal para análise de speedup.

**3.3. Execução do Gerador de Gráficos (`gerar_graficos.py`)**

Após executar o Passo 3.1 ou 3.2, você terá o arquivo de resumo (`ResumoMetas_NP.csv` ou `ResumoMetas_P.csv`) necessário para este script.

- **Comando:**
    
    ```bash
    python gerar_graficos.py
    ```
    
- **Uso:**
    1. Após a execução, um menu principal aparecerá no terminal.
    2. Digite `1` para gerar o gráfico de conformidade geral por ramo.
    3. Digite `2` para abrir o sub-menu de análise detalhada por ramo/tribunal. Siga as instruções para selecionar o ramo e/ou tribunal desejado.
    4. Digite `0` para sair do programa.
- **Saída:** Os gráficos gerados serão salvos como arquivos de imagem (`.png`) dentro de uma pasta chamada `GRAFICOS`, que será criada automaticamente na pasta principal do projeto.

---

### Gráfico de Conformidade Geral

**Análise:** Este gráfico de barras empilhadas mostra, para cada Ramo da Justiça, a proporção de metas que foram cumpridas (em verde) versus as não cumpridas (em vermelho). Os rótulos dentro das barras, mostrando a porcentagem e a contagem absoluta de metas (ex: `36.6% (26 metas)`), estão exatamente como planejamos.

### Gráfico de Desempenho por Ramo (Ex: Justiça Estadual)

**Análise:** Este gráfico de barras mostra o desempenho médio para cada uma das metas específicas do ramo escolhido (`Meta1_JE`, `Meta2A_JE`, etc.). A altura da barra representa a média de desempenho, e o rótulo acima de cada barra fornece o contexto completo: o valor da média e a contagem de quantos tribunais daquele ramo cumpriram a meta (ex: `126.8% (26 de 27)`).