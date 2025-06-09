# Instruções de Execução do Projeto
Este guia detalha os passos necessários para configurar o ambiente e executar os scripts do projeto de análise de desempenho dos tribunais.

## **1. Pré-requisitos**

Antes de executar os scripts, é necessário ter o Python e as bibliotecas necessárias instaladas no seu sistema.

- **Python:** O projeto foi desenvolvido e testado com Python 3.11 ou superior.
- **Bibliotecas Python:** Instale as seguintes bibliotecas usando o `pip` (gerenciador de pacotes do Python). Abra seu terminal ou prompt de comando e execute os seguintes comandos:
    
    ```bash
    pip install pandas numpy matplotlib
    ```
    

### **1.1. Descompacte os Dados de Entrada**

Os dados utilizados pelo projeto são fornecidos em um arquivo compactado.

- **Ação Necessária:** Localize o arquivo `PASTA_DADOS_CSV.zip` na pasta do projeto e **descompacte-o**.
- **Resultado Esperado:** Após a descompactação, você terá uma pasta chamada `PASTA_DADOS_CSV` contendo todos os 90 arquivos `.csv` necessários para a análise.

## **2. Estrutura de Pastas**

Para que os scripts funcionem corretamente, os arquivos do projeto devem ser organizados na seguinte estrutura de pastas:

```bash
PROJETO_FINAL/
|
|-- PASTA_DADOS_CSV.zip       <-- O arquivo original compactado
|-- PASTA_DADOS_CSV/          <-- Pasta criada após descompactar o .zip
|   |-- teste_STJ.csv
|   |-- teste_TJAC.csv
|   |-- teste_TRT1.csv
|   |-- ... (todos os 90 arquivos .csv)
|
|-- Versao_NP.py              <-- Versão Sequencial (requer > 8GB RAM)
|-- Versao_P.py               <-- Versão Paralela (requer > 8GB RAM)
|-- Versao_Otimizada.py       <-- Versão Eficiente em Memória (para < 4GB RAM)
|-- gerar_graficos.py (é necessário o arquivo ResumoMetas...csv)
|
|-- (Pasta GRAFICOS/ será criada automaticamente)
|-- (Arquivo Consolidado...csv será criado automaticamente)
|-- (Arquivo ResumoMetas...csv será criado automaticamente)
```

- **`PROJETO_FINAL/`**: A pasta principal do seu projeto.
- **`PASTA_DADOS_CSV/`**: Uma subpasta contendo **todos os 90 arquivos CSV** originais dos tribunais. Os scripts estão configurados para ler os dados desta pasta.

## **3. Execução dos Scripts**

Execute os scripts a partir do terminal, estando no diretório principal do projeto (`PROJETO_FINAL/`).

### **3.1. `Versao_NP.py` (Versão Sequencial Padrão)**

- **Descrição**: Este script executa todo o processo de forma sequencial. Ele irá ler todos os 90 arquivos, gerar o `Consolidado_NP.csv` e, em seguida, o `ResumoMetas_NP.CSV`. Este script consolida todos os dados em memória e pode exigir uma quantidade significativa de RAM (recomendado > 8GB).
- **Comando:**
    
    ```bash
    python Versao_NP.py
    ```
    
- **Saída:** Ao final da execução, os arquivos `Consolidado_NP.csv` e `ResumoMetas_NP.CSV` serão criados na pasta principal do projeto. Os tempos de execução de cada etapa serão impressos no terminal para análise de speedup.

### **3.2. `Versao_P.py` (Versão Paralela)**

- **Descrição**: Este script executa a Etapa 1 (consolidação) e a Etapa 2 (cálculo de metas) de forma paralelizada para otimizar o desempenho. Também requer uma quantidade significativa de RAM (recomendado > 8GB).
- **Comando:**
    
    ```bash
    python Versao_P.py
    ```
    
- **Saída:** Ao final da execução, os arquivos `Consolidado_P.csv` e `ResumoMetas_P.CSV` serão criados na pasta principal. Os tempos de execução de cada etapa serão impressos no terminal para análise de speedup.

### **3.3. `Versao_Otimizada.py` (Versão Eficiente em Memória)**

- **Descrição:** Esta é uma versão especial do script sequencial, projetada para ser executada em computadores com recursos de memória limitados (ex: 4GB de RAM). Para evitar erros de "out of memory", este script **não gera o arquivo `Consolidado_...csv` intermediário**. Ele processa os dados de forma mais inteligente, agregando cada arquivo individualmente para garantir que o resultado final (`ResumoMetas...csv`) seja gerado com sucesso.
- **Comando:**
    
    ```bash
    python Versao_Otimizada.py
    ```
    
- **Saída Principal:** `ResumoMetas_Otimizada.csv`.

### **3.4. `gerar_graficos.py` (Gerador de Gráficos)**

- **Descrição:** Após gerar um dos arquivos de resumo de metas (`ResumoMetas_NP.CSV`, `ResumoMetas_P.CSV` ou `ResumoMetas_Otimizado.csv`), execute este script para gerar visualizações. Ele é interativo e permite analisar o desempenho dos tribunais.
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

## **4. Gráficos**

### **4.1. Alvo de desempenho e o porquê do alvo ser 100**

O alvo de desempenho dos gráficos é sempre **100** porque as fórmulas de cálculo das metas, fornecidas no documento do projeto, são projetadas para **normalizar o resultado**. Isso cria um ponto de referência universal: uma pontuação de 100 sempre significa que o objetivo da meta foi atingido, facilitando as comparações.

Isso funciona mesmo para as **metas com alvos diferentes de 100%**, como a "Meta 2A da Justiça Estadual", que pede para julgar "pelo menos 80% dos processos".

- **O Objetivo:** É atingir 80% (ou uma proporção de 0.80).
- **A Fórmula:** Utiliza um fator de multiplicação específico: `(1000 ÷ 8)`, que é igual a 125.
- **O Cálculo:** Se um tribunal atinge exatamente os 80%, a conta se torna: 0.80×125=100.

Dessa forma, o ato de atingir o objetivo de 80% é convertido para uma **pontuação de 100**. Isso se repete para todas as outras metas, garantindo que o valor "100" seja sempre o padrão de sucesso.

### **4.2. Gráfico de Conformidade Geral**

**Análise:** Este gráfico de barras empilhadas mostra, para cada Ramo da Justiça, a proporção de metas que foram cumpridas (em verde) versus as não cumpridas (em vermelho). Os rótulos dentro das barras, mostra a porcentagem e a contagem absoluta de metas (ex: `36.6% (26 metas)`).

### **4.3. Gráfico de Desempenho por Ramo (Ex: Justiça Estadual)**

**Análise:** Este gráfico de barras mostra o desempenho médio para cada uma das metas específicas do ramo escolhido (`Meta1_JE`, `Meta2A_JE`, etc.). A altura da barra representa a média de desempenho, e o rótulo acima de cada barra fornece o contexto completo: o valor da média e a contagem de quantos tribunais daquele ramo cumpriram a meta (ex: `126.8% (26 de 27)`).
