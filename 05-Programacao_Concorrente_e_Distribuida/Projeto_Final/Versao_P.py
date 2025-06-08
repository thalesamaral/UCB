import pandas as pd
import os
import concurrent.futures # Para paralelização
import time # Para medir o tempo de execução

# -----------------------------------------------------------------------------
# CONFIGURAÇÕES GLOBAIS
# -----------------------------------------------------------------------------
PASTA_DADOS_CSV = r'E:\GIT_TH\UCB\UCB-PCeD-Projeto_Final\PASTA_DADOS_CSV'
CODIFICACAO_CSV = 'utf-8'
VALOR_NA = "NA" # String para valores não aplicáveis

# Nomes dos arquivos de saída para esta versão (Paralela)
ARQUIVO_CONSOLIDADO_SAIDA = 'Consolidado_P.csv'
ARQUIVO_RESUMO_METAS_SAIDA = 'ResumoMetas_P.csv'

# Separadores
SEPARADOR_LEITURA_ORIGINAIS_CSV = ','
SEPARADOR_ESCRITA_CONSOLIDADO_CSV = ';'
SEPARADOR_LEITURA_CONSOLIDADO_ETAPA2 = SEPARADOR_ESCRITA_CONSOLIDADO_CSV # Consistência
SEPARADOR_ESCRITA_RESUMO_METAS = ';'

# Lista de todas as colunas base que precisam ser somadas para QUALQUER meta
# para os cálculos em calcular_metas_tribunal.
colunas_para_soma = [
    'casos_novos_2025', 'julgados_2025', 'prim_sent2025', 
    'suspensos_2025', 'dessobrestados_2025',
    'distm2_a', 'julgm2_a', 'suspm2_a',
    'distm2_b', 'julgm2_b', 'suspm2_b',
    'distm2_c', 'julgm2_c', 'suspm2_c',
    'distm2_ant', 'julgm2_ant', 'suspm2_ant', 'desom2_ant',
    'distm4_a', 'julgm4_a', 'suspm4_a',
    'distm4_b', 'julgm4_b', 'suspm4_b',
    'distm6_a', 'julgm6_a', 'suspm6_a',
    'distm7_a', 'julgm7_a', 'suspm7_a',
    'distm7_b', 'julgm7_b', 'suspm7_b',
    'distm8_a', 'julgm8_a', 'suspm8_a',
    'distm8_b', 'julgm8_b', 'suspm8_b',
    'distm10_a', 'julgm10_a', 'suspm10_a',
    'distm10_b', 'julgm10_b', 'suspm10_b',
    'IC2024', 'IC2025', 
    'quant_sent24', 'quant_conc24', 'quant_sent25', 'quant_conc25',
    'quant_sent22_23', 'quant_conc22_23',
]

# -----------------------------------------------------------------------------
# FUNÇÃO PARALELA PARA PROCESSAR UM ÚNICO ARQUIVO CSV (USADA NA ETAPA 1 PARALELA)
# -----------------------------------------------------------------------------
def processar_arquivo_csv_etapa1(nome_arquivo_com_pasta):
    """
    Lê um único arquivo CSV.
    Retorna o DataFrame lido ou None em caso de erro.
    """
    nome_arquivo_base = os.path.basename(nome_arquivo_com_pasta)
    # Opcional: print(f"Thread iniciando processamento de: {nome_arquivo_base}")
    try:
        df_temp = pd.read_csv(nome_arquivo_com_pasta, sep=SEPARADOR_LEITURA_ORIGINAIS_CSV, encoding=CODIFICACAO_CSV, low_memory=False)
        return df_temp 
    except FileNotFoundError:
        print(f"ERRO (Thread Etapa 1): Arquivo não encontrado: {nome_arquivo_com_pasta}")
    except pd.errors.EmptyDataError:
        print(f"AVISO (Thread Etapa 1): O arquivo '{nome_arquivo_base}' está vazio e será ignorado.")
    except UnicodeDecodeError:
        print(f"ERRO DE CODIFICAÇÃO (Thread Etapa 1) ao ler '{nome_arquivo_base}'.")
    except Exception as e:
        print(f"Erro inesperado (Thread Etapa 1) ao processar '{nome_arquivo_base}': {e}")
    return None

# -----------------------------------------------------------------------------
# FUNÇÃO PARA CALCULAR METAS
# -----------------------------------------------------------------------------
def calcular_metas_tribunal(row_tribunal):
    """
    Calcula todas as metas aplicáveis para uma linha de tribunal (dados já agregados).
    A linha `row_tribunal` é uma Series do Pandas.
    Retorna uma Series do Pandas com os resultados das metas.
    """
    
    resultados_metas = {}
    ramo = row_tribunal['ramo_justica']
    tribunal = row_tribunal['sigla_tribunal']

    if ramo == "Justiça Estadual":
        try:
            num_m1 = row_tribunal.get('julgados_2025', 0)
            den_m1 = row_tribunal.get('casos_novos_2025', 0) + row_tribunal.get('dessobrestados_2025', 0) - row_tribunal.get('suspensos_2025', 0)
            resultados_metas['Meta1_JE'] = (num_m1 / den_m1) * 100 if den_m1 != 0 else VALOR_NA
        except Exception: resultados_metas['Meta1_JE'] = VALOR_NA
        try:
            num_m2a = row_tribunal.get('julgm2_a', 0)
            den_m2a = row_tribunal.get('distm2_a', 0) - row_tribunal.get('suspm2_a', 0)
            resultados_metas['Meta2A_JE'] = (num_m2a / den_m2a) * (1000 / 8.0) if den_m2a != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2A_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_b', 0)
            den = row_tribunal.get('distm2_b', 0) - row_tribunal.get('suspm2_b', 0)
            resultados_metas['Meta2B_JE'] = (num / den) * (1000 / 9.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2B_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_c', 0)
            den = row_tribunal.get('distm2_c', 0) - row_tribunal.get('suspm2_c', 0)
            resultados_metas['Meta2C_JE'] = (num / den) * (1000 / 9.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2C_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_ant', 0)
            den = row_tribunal.get('distm2_ant', 0) - row_tribunal.get('suspm2_ant', 0)
            resultados_metas['Meta2ANT_JE'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2ANT_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_a', 0)
            den = row_tribunal.get('distm4_a', 0) - row_tribunal.get('suspm4_a', 0)
            resultados_metas['Meta4A_JE'] = (num / den) * (1000 / 6.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4A_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_b', 0)
            den = row_tribunal.get('distm4_b', 0) - row_tribunal.get('suspm4_b', 0)
            resultados_metas['Meta4B_JE'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4B_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm6_a', 0) 
            den = row_tribunal.get('distm6_a', 0) - row_tribunal.get('suspm6_a', 0)
            resultados_metas['Meta6_JE'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta6_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm7_a', 0)
            den = row_tribunal.get('distm7_a', 0) - row_tribunal.get('suspm7_a', 0)
            resultados_metas['Meta7A_JE'] = (num / den) * (1000 / 5.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta7A_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm7_b', 0)
            den = row_tribunal.get('distm7_b', 0) - row_tribunal.get('suspm7_b', 0)
            resultados_metas['Meta7B_JE'] = (num / den) * (1000 / 5.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta7B_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm8_a', 0)
            den = row_tribunal.get('distm8_a', 0) - row_tribunal.get('suspm8_a', 0)
            resultados_metas['Meta8A_JE'] = (num / den) * (1000 / 7.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta8A_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm8_b', 0)
            den = row_tribunal.get('distm8_b', 0) - row_tribunal.get('suspm8_b', 0)
            resultados_metas['Meta8B_JE'] = (num / den) * (1000 / 9.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta8B_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm10_a', 0)
            den = row_tribunal.get('distm10_a', 0) - row_tribunal.get('suspm10_a', 0)
            resultados_metas['Meta10A_JE'] = (num / den) * (1000 / 9.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta10A_JE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm10_b', 0)
            den = row_tribunal.get('distm10_b', 0) - row_tribunal.get('suspm10_b', 0)
            resultados_metas['Meta10B_JE'] = (num / den) * (1000 / 10.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta10B_JE'] = VALOR_NA

    elif ramo == "Justiça do Trabalho":
        try:
            num_m1 = row_tribunal.get('julgados_2025', 0)
            den_m1 = row_tribunal.get('casos_novos_2025', 0) + row_tribunal.get('dessobrestados_2025', 0) - row_tribunal.get('suspensos_2025', 0)
            resultados_metas['Meta1_JT'] = (num_m1 / den_m1) * 100 if den_m1 != 0 else VALOR_NA
        except Exception: resultados_metas['Meta1_JT'] = VALOR_NA
        try:
            num_m2a = row_tribunal.get('julgm2_a', 0)
            den_m2a = row_tribunal.get('distm2_a', 0) - row_tribunal.get('suspm2_a', 0)
            resultados_metas['Meta2A_JT'] = (num_m2a / den_m2a) * (1000 / 9.4) if den_m2a != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2A_JT'] = VALOR_NA
        try:
            num_m2ant = row_tribunal.get('julgm2_ant', 0)
            den_m2ant = row_tribunal.get('distm2_ant', 0) - row_tribunal.get('suspm2_ant', 0)
            resultados_metas['Meta2ANT_JT'] = (num_m2ant / den_m2ant) * 100 if den_m2ant != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2ANT_JT'] = VALOR_NA
        try:
            num_m4a = row_tribunal.get('julgm4_a', 0)
            den_m4a = row_tribunal.get('distm4_a', 0) - row_tribunal.get('suspm4_a', 0)
            resultados_metas['Meta4A_JT'] = (num_m4a / den_m4a) * (1000 / 7.0) if den_m4a != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4A_JT'] = VALOR_NA
        try:
            num_m4b = row_tribunal.get('julgm4_b', 0)
            den_m4b = row_tribunal.get('distm4_b', 0) - row_tribunal.get('suspm4_b', 0)
            resultados_metas['Meta4B_JT'] = (num_m4b / den_m4b) * 100 if den_m4b != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4B_JT'] = VALOR_NA

    elif ramo == "Justiça Federal":
        try:
            num = row_tribunal.get('julgados_2025', 0)
            den = row_tribunal.get('casos_novos_2025', 0) + row_tribunal.get('dessobrestados_2025', 0) - row_tribunal.get('suspensos_2025', 0)
            resultados_metas['Meta1_JF'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta1_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_a', 0)
            den = row_tribunal.get('distm2_a', 0) - row_tribunal.get('suspm2_a', 0)
            resultados_metas['Meta2A_JF'] = (num / den) * (1000 / 8.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2A_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_b', 0)
            den = row_tribunal.get('distm2_b', 0) - row_tribunal.get('suspm2_b', 0)
            resultados_metas['Meta2B_JF'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2B_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_ant', 0)
            den = row_tribunal.get('distm2_ant', 0) - row_tribunal.get('suspm2_ant', 0)
            resultados_metas['Meta2ANT_JF'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2ANT_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_a', 0)
            den = row_tribunal.get('distm4_a', 0) - row_tribunal.get('suspm4_a', 0)
            resultados_metas['Meta4A_JF'] = (num / den) * (1000 / 7.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4A_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_b', 0)
            den = row_tribunal.get('distm4_b', 0) - row_tribunal.get('suspm4_b', 0)
            resultados_metas['Meta4B_JF'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4B_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm6_a', 0) 
            den = row_tribunal.get('distm6_a', 0) - row_tribunal.get('suspm6_a', 0)
            resultados_metas['Meta6_JF'] = (num / den) * (1000 / 3.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta6_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm7_a', 0)
            den = row_tribunal.get('distm7_a', 0) - row_tribunal.get('suspm7_a', 0)
            resultados_metas['Meta7A_JF'] = (num / den) * (1000 / 3.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta7A_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm7_b', 0)
            den = row_tribunal.get('distm7_b', 0) - row_tribunal.get('suspm7_b', 0)
            resultados_metas['Meta7B_JF'] = (num / den) * (1000 / 3.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta7B_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm8_a', 0)
            den = row_tribunal.get('distm8_a', 0) - row_tribunal.get('suspm8_a', 0)
            resultados_metas['Meta8A_JF'] = (num / den) * (1000 / 7.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta8A_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm8_b', 0)
            den = row_tribunal.get('distm8_b', 0) - row_tribunal.get('suspm8_b', 0)
            resultados_metas['Meta8B_JF'] = (num / den) * (1000 / 9.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta8B_JF'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm10_a', 0)
            den = row_tribunal.get('distm10_a', 0) - row_tribunal.get('suspm10_a', 0)
            resultados_metas['Meta10A_JF'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta10A_JF'] = VALOR_NA

    elif ramo == "Justiça Militar da União":
        try:
            num = row_tribunal.get('julgados_2025', 0)
            den = row_tribunal.get('casos_novos_2025', 0) + row_tribunal.get('dessobrestados_2025', 0) - row_tribunal.get('suspensos_2025', 0)
            resultados_metas['Meta1_JMU'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta1_JMU'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_a', 0)
            den = row_tribunal.get('distm2_a', 0) - row_tribunal.get('suspm2_a', 0)
            resultados_metas['Meta2A_JMU'] = (num / den) * (1000 / 9.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2A_JMU'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_b', 0)
            den = row_tribunal.get('distm2_b', 0) - row_tribunal.get('suspm2_b', 0)
            resultados_metas['Meta2B_JMU'] = (num / den) * (1000 / 9.9) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2B_JMU'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_ant', 0)
            den = row_tribunal.get('distm2_ant', 0) - row_tribunal.get('suspm2_ant', 0)
            resultados_metas['Meta2ANT_JMU'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2ANT_JMU'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_a', 0)
            den = row_tribunal.get('distm4_a', 0) - row_tribunal.get('suspm4_a', 0)
            resultados_metas['Meta4A_JMU'] = (num / den) * (1000 / 9.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4A_JMU'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_b', 0)
            den = row_tribunal.get('distm4_b', 0) - row_tribunal.get('suspm4_b', 0)
            resultados_metas['Meta4B_JMU'] = (num / den) * (1000 / 9.9) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4B_JMU'] = VALOR_NA

    elif ramo == "Justiça Militar Estadual":
        try:
            num = row_tribunal.get('julgados_2025', 0)
            den = row_tribunal.get('casos_novos_2025', 0) + row_tribunal.get('dessobrestados_2025', 0) - row_tribunal.get('suspensos_2025', 0)
            resultados_metas['Meta1_JME'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta1_JME'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_a', 0)
            den = row_tribunal.get('distm2_a', 0) - row_tribunal.get('suspm2_a', 0)
            resultados_metas['Meta2A_JME'] = (num / den) * (1000 / 9.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2A_JME'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_b', 0)
            den = row_tribunal.get('distm2_b', 0) - row_tribunal.get('suspm2_b', 0)
            resultados_metas['Meta2B_JME'] = (num / den) * (1000 / 9.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2B_JME'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_ant', 0)
            den = row_tribunal.get('distm2_ant', 0) - row_tribunal.get('suspm2_ant', 0)
            resultados_metas['Meta2ANT_JME'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2ANT_JME'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_a', 0)
            den = row_tribunal.get('distm4_a', 0) - row_tribunal.get('suspm4_a', 0)
            resultados_metas['Meta4A_JME'] = (num / den) * (1000 / 9.5) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4A_JME'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_b', 0)
            den = row_tribunal.get('distm4_b', 0) - row_tribunal.get('suspm4_b', 0)
            resultados_metas['Meta4B_JME'] = (num / den) * (1000 / 9.9) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4B_JME'] = VALOR_NA

    elif ramo == "Justiça Eleitoral":
        try:
            num = row_tribunal.get('julgados_2025', 0)
            den = row_tribunal.get('casos_novos_2025', 0) + row_tribunal.get('dessobrestados_2025', 0) - row_tribunal.get('suspensos_2025', 0)
            resultados_metas['Meta1_TSE'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta1_TSE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_a', 0)
            den = row_tribunal.get('distm2_a', 0) - row_tribunal.get('suspm2_a', 0)
            resultados_metas['Meta2A_TSE'] = (num / den) * (1000 / 7.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2A_TSE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_b', 0)
            den = row_tribunal.get('distm2_b', 0) - row_tribunal.get('suspm2_b', 0)
            resultados_metas['Meta2B_TSE'] = (num / den) * (1000 / 9.9) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2B_TSE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm2_ant', 0)
            den = row_tribunal.get('distm2_ant', 0) - row_tribunal.get('suspm2_ant', 0)
            resultados_metas['Meta2ANT_TSE'] = (num / den) * 100 if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta2ANT_TSE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_a', 0)
            den = row_tribunal.get('distm4_a', 0) - row_tribunal.get('suspm4_a', 0)
            resultados_metas['Meta4A_TSE'] = (num / den) * (1000 / 9.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4A_TSE'] = VALOR_NA
        try:
            num = row_tribunal.get('julgm4_b', 0)
            den = row_tribunal.get('distm4_b', 0) - row_tribunal.get('suspm4_b', 0)
            resultados_metas['Meta4B_TSE'] = (num / den) * (1000 / 5.0) if den != 0 else VALOR_NA
        except Exception: resultados_metas['Meta4B_TSE'] = VALOR_NA

    elif ramo == "Tribunais Superiores":
        if tribunal == "STJ":
            try:
                num = row_tribunal.get('julgados_2025', 0)
                den = row_tribunal.get('casos_novos_2025', 0) + row_tribunal.get('dessobrestados_2025', 0) - row_tribunal.get('suspensos_2025', 0)
                resultados_metas['Meta1_STJ'] = (num / den) * 100 if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta1_STJ'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm2_ant', 0)
                den = row_tribunal.get('distm2_ant', 0) - row_tribunal.get('suspm2_ant', 0)
                resultados_metas['Meta2ANT_STJ'] = (num / den) * 100 if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta2ANT_STJ'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm4_a', 0)
                den = row_tribunal.get('distm4_a', 0) - row_tribunal.get('suspm4_a', 0)
                resultados_metas['Meta4A_STJ'] = (num / den) * (1000 / 9.0) if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta4A_STJ'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm4_b', 0)
                den = row_tribunal.get('distm4_b', 0) - row_tribunal.get('suspm4_b', 0)
                resultados_metas['Meta4B_STJ'] = (num / den) * 100 if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta4B_STJ'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm6_a', 0)
                den = row_tribunal.get('distm6_a', 0) - row_tribunal.get('suspm6_a', 0)
                resultados_metas['Meta6_STJ'] = (num / den) * (1000 / 7.5) if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta6_STJ'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm7_a', 0)
                den = row_tribunal.get('distm7_a', 0) - row_tribunal.get('suspm7_a', 0)
                resultados_metas['Meta7A_STJ'] = (num / den) * (1000 / 7.5) if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta7A_STJ'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm7_b', 0)
                den = row_tribunal.get('distm7_b', 0) - row_tribunal.get('suspm7_b', 0)
                resultados_metas['Meta7B_STJ'] = (num / den) * (1000 / 7.5) if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta7B_STJ'] = VALOR_NA
            try:
                num_8a = row_tribunal.get('julgm8_a', 0); dist_8a = row_tribunal.get('distm8_a', 0); susp_8a = row_tribunal.get('suspm8_a', 0)
                num_8b = row_tribunal.get('julgm8_b', 0); dist_8b = row_tribunal.get('distm8_b', 0); susp_8b = row_tribunal.get('suspm8_b', 0)
                num_total_m8 = num_8a + num_8b; den_total_m8 = (dist_8a + dist_8b) - (susp_8a + susp_8b)
                resultados_metas['Meta8_STJ'] = (num_total_m8 / den_total_m8) * (1000 / 10.0) if den_total_m8 != 0 else VALOR_NA
            except Exception: resultados_metas['Meta8_STJ'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm10_a', 0)
                den = row_tribunal.get('distm10_a', 0) - row_tribunal.get('suspm10_a', 0)
                resultados_metas['Meta10_STJ'] = (num / den) * (1000 / 10.0) if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta10_STJ'] = VALOR_NA
        
        elif tribunal == "TST":
            try:
                num = row_tribunal.get('julgados_2025', 0)
                den = row_tribunal.get('casos_novos_2025', 0) + row_tribunal.get('dessobrestados_2025', 0) - row_tribunal.get('suspensos_2025', 0)
                resultados_metas['Meta1_TST'] = (num / den) * 100 if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta1_TST'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm2_a', 0)
                den = row_tribunal.get('distm2_a', 0) - row_tribunal.get('suspm2_a', 0)
                resultados_metas['Meta2A_TST'] = (num / den) * (1000 / 9.5) if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta2A_TST'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm2_b', 0)
                den = row_tribunal.get('distm2_b', 0) - row_tribunal.get('suspm2_b', 0)
                resultados_metas['Meta2B_TST'] = (num / den) * (1000 / 9.9) if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta2B_TST'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm2_ant', 0)
                den = row_tribunal.get('distm2_ant', 0) - row_tribunal.get('suspm2_ant', 0)
                resultados_metas['Meta2ANT_TST'] = (num / den) * 100 if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta2ANT_TST'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm4_a', 0)
                den = row_tribunal.get('distm4_a', 0) - row_tribunal.get('suspm4_a', 0)
                resultados_metas['Meta4A_TST'] = (num / den) * (1000 / 7.0) if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta4A_TST'] = VALOR_NA
            try:
                num = row_tribunal.get('julgm4_b', 0)
                den = row_tribunal.get('distm4_b', 0) - row_tribunal.get('suspm4_b', 0)
                resultados_metas['Meta4B_TST'] = (num / den) * 100 if den != 0 else VALOR_NA
            except Exception: resultados_metas['Meta4B_TST'] = VALOR_NA
    
    colunas_todas_metas = [
        # Justiça Estadual
        'Meta1_JE', 'Meta2A_JE', 'Meta2B_JE', 'Meta2C_JE', 'Meta2ANT_JE', 
        'Meta4A_JE', 'Meta4B_JE', 'Meta6_JE', 'Meta7A_JE', 'Meta7B_JE',
        'Meta8A_JE', 'Meta8B_JE', 'Meta10A_JE', 'Meta10B_JE',
        
        # Justiça do Trabalho
        'Meta1_JT', 'Meta2A_JT', 'Meta2ANT_JT', 'Meta4A_JT', 'Meta4B_JT',
        
        # Justiça Federal
        'Meta1_JF', 'Meta2A_JF', 'Meta2B_JF', 'Meta2ANT_JF', 'Meta4A_JF', 
        'Meta4B_JF', 'Meta6_JF', 'Meta7A_JF', 'Meta7B_JF', 'Meta8A_JF', 
        'Meta8B_JF', 'Meta10A_JF',

        # Justiça Militar da União
        'Meta1_JMU', 'Meta2A_JMU', 'Meta2B_JMU', 'Meta2ANT_JMU', 
        'Meta4A_JMU', 'Meta4B_JMU',
        
        # Justiça Militar Estadual
        'Meta1_JME', 'Meta2A_JME', 'Meta2B_JME', 'Meta2ANT_JME', 
        'Meta4A_JME', 'Meta4B_JME',

        # TSE (dentro da Justiça Eleitoral)
        'Meta1_TSE', 'Meta2A_TSE', 'Meta2B_TSE', 'Meta2ANT_TSE', 
        'Meta4A_TSE', 'Meta4B_TSE',

        # STJ (dentro de Tribunais Superiores)
        'Meta1_STJ', 'Meta2ANT_STJ', 'Meta4A_STJ', 'Meta4B_STJ', 'Meta6_STJ', 
        'Meta7A_STJ', 'Meta7B_STJ', 'Meta8_STJ', 'Meta10_STJ',
        
        # TST (dentro de Tribunais Superiores)
        'Meta1_TST', 'Meta2A_TST', 'Meta2B_TST', 'Meta2ANT_TST', 
        'Meta4A_TST', 'Meta4B_TST',
    ]
    for col_meta_padrao in colunas_todas_metas:
        if col_meta_padrao not in resultados_metas:
            resultados_metas[col_meta_padrao] = VALOR_NA
    return pd.Series(resultados_metas)

# -----------------------------------------------------------------------------
# BLOCO PRINCIPAL DE EXECUÇÃO
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    print("### INICIANDO Versao_P.py (Versão Paralelizada) ###")
    tempo_inicio_total_p = time.time()

    # ETAPA 1: Consolidação Paralela ------------------------------------------
    print(f"\n--- INÍCIO DA ETAPA 1 (Paralela): Gerando {ARQUIVO_CONSOLIDADO_SAIDA} ---")
    tempo_inicio_etapa1_p = time.time()

    if not os.path.exists(PASTA_DADOS_CSV):
        print(f"ERRO ETAPA 1 (P): A pasta '{PASTA_DADOS_CSV}' não foi encontrada.")
        exit()

    nomes_arquivos_csv_etapa1 = [os.path.join(PASTA_DADOS_CSV, f) for f in os.listdir(PASTA_DADOS_CSV) if f.lower().endswith('.csv')]

    if not nomes_arquivos_csv_etapa1:
        print(f"ERRO ETAPA 1 (P): Nenhum arquivo .csv encontrado na pasta '{PASTA_DADOS_CSV}'.")
        exit()
    
    print(f"Encontrados {len(nomes_arquivos_csv_etapa1)} arquivos CSV para processar na Etapa 1 (P).")

    lista_dataframes_etapa1 = []
    num_cores = os.cpu_count()
    MAX_WORKERS_ETAPA1 = num_cores if num_cores else 4
    
    print(f"Iniciando leitura paralela de arquivos com até {MAX_WORKERS_ETAPA1} workers...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS_ETAPA1) as executor:
        futuros_leitura = {executor.submit(processar_arquivo_csv_etapa1, caminho_arq): caminho_arq for caminho_arq in nomes_arquivos_csv_etapa1}
        
        for count, futuro in enumerate(concurrent.futures.as_completed(futuros_leitura)):
            caminho_arq_processado = futuros_leitura[futuro]
            nome_arq_base = os.path.basename(caminho_arq_processado)
            print(f"Processamento do arquivo {nome_arq_base} concluído ({count+1}/{len(nomes_arquivos_csv_etapa1)}).")
            try:
                df_resultado = futuro.result()
                if df_resultado is not None:
                    lista_dataframes_etapa1.append(df_resultado)
            except Exception as e:
                print(f"Erro ao obter resultado para o arquivo '{nome_arq_base}': {e}")

    df_consolidado_etapa1 = None
    if lista_dataframes_etapa1:
        print(f"\nProcessados {len(lista_dataframes_etapa1)} arquivos com sucesso.")
        print("Concatenando DataFrames (Etapa 1 - P)...")
        df_consolidado_etapa1 = pd.concat(lista_dataframes_etapa1, ignore_index=True)
        print(f"DataFrame consolidado (Etapa 1 - P) criado! Shape: {df_consolidado_etapa1.shape}")

        if 'ramo_justica' in df_consolidado_etapa1.columns:
            print("\n--- VERIFICAÇÃO (Etapa 1 - P): 'ramo_justica' ANTES de salvar ---")
            print(f"Valores únicos: {df_consolidado_etapa1['ramo_justica'].unique()}")
            print(f"Contagem:\n{df_consolidado_etapa1['ramo_justica'].value_counts(dropna=False)}")
        else:
            print("ALERTA CRÍTICO ETAPA 1 (P): Coluna 'ramo_justica' ausente!")
        
        try:
            print(f"\nSalvando DataFrame consolidado em: {ARQUIVO_CONSOLIDADO_SAIDA}")
            df_consolidado_etapa1.to_csv(ARQUIVO_CONSOLIDADO_SAIDA, sep=SEPARADOR_ESCRITA_CONSOLIDADO_CSV, index=False, encoding=CODIFICACAO_CSV)
            print(f"Arquivo '{ARQUIVO_CONSOLIDADO_SAIDA}' salvo com sucesso!")
        except Exception as e:
            print(f"Erro ao salvar '{ARQUIVO_CONSOLIDADO_SAIDA}': {e}")
            df_consolidado_etapa1 = None 
    else:
        print("\nNenhum DataFrame carregado na Etapa 1 (P).")
        exit()

    tempo_fim_etapa1_p = time.time()
    print(f"--- FIM DA ETAPA 1 (Paralela) --- Tempo: {tempo_fim_etapa1_p - tempo_inicio_etapa1_p:.2f}s ---")

    if df_consolidado_etapa1 is None or df_consolidado_etapa1.empty:
        print("ERRO: Falha na Etapa 1. Interrompendo.")
        exit()

    # ETAPA 2: Cálculo de Metas (Sequencial por enquanto) ---------------------
    print(f"\n--- INÍCIO DA ETAPA 2 (Sequencial): Gerando {ARQUIVO_RESUMO_METAS_SAIDA} ---")
    tempo_inicio_etapa2_p = time.time()

    df_consolidado_etapa2 = df_consolidado_etapa1.copy()
    print(f"Utilizando DataFrame da Etapa 1. Shape: {df_consolidado_etapa2.shape}")

    print("\nConvertendo colunas para numérico (Etapa 2)...")
    for col in colunas_para_soma: # Usar a lista global colunas_para_soma
        if col in df_consolidado_etapa2.columns:
            df_consolidado_etapa2[col] = pd.to_numeric(df_consolidado_etapa2[col], errors='coerce')
        else:
            print(f"AVISO (Etapa 2): Coluna '{col}' não encontrada e será ignorada na conversão.")

    agregacoes = {}
    for col in colunas_para_soma: # Usar a lista global colunas_para_soma
        if col in df_consolidado_etapa2.columns:
            agregacoes[col] = 'sum'
    
    if 'ramo_justica' not in df_consolidado_etapa2.columns or 'sigla_tribunal' not in df_consolidado_etapa2.columns:
        print("ERRO CRÍTICO (Etapa 2): Colunas 'ramo_justica' ou 'sigla_tribunal' ausentes.")
        exit()
    agregacoes['ramo_justica'] = 'first'
        
    print("\nAgregando dados por tribunal (Etapa 2)...")
    df_agregado_por_tribunal = df_consolidado_etapa2.groupby('sigla_tribunal', as_index=False).agg(agregacoes)
    
    for col in colunas_para_soma: # Usar a lista global colunas_para_soma
        if col in df_agregado_por_tribunal.columns:
            df_agregado_por_tribunal[col] = df_agregado_por_tribunal[col].fillna(0)
    print(f"Dados agregados (Etapa 2). Shape: {df_agregado_por_tribunal.shape}")
    print(df_agregado_por_tribunal.head())

    # --- Aplicar a Função calcular_metas_tribunal de forma PARALELA ---
    if not df_agregado_por_tribunal.empty:
        print("\nCalculando metas para cada tribunal (Etapa 2 - PARALELA)...") # Mensagem atualizada
        tempo_inicio_calculo_metas_p = time.time()

        linhas_para_processar = [row for _, row in df_agregado_por_tribunal.iterrows()]
        
        num_cores_etapa2 = os.cpu_count()
        MAX_WORKERS_ETAPA2 = min(8, num_cores_etapa2 if num_cores_etapa2 else 4)
        # Para 90 tarefas, MAX_WORKERS_ETAPA2 pode ser menor, ex: 4 ou 8, para evitar overhead excessivo.

        lista_resultados_series = []
        print(f"Iniciando cálculo paralelo de metas da Etapa 2 com até {MAX_WORKERS_ETAPA2} workers...")
        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS_ETAPA2) as executor:
            try:
                lista_resultados_series = list(executor.map(calcular_metas_tribunal, linhas_para_processar))
            except Exception as e_map:
                print(f"Erro durante a execução paralela de calcular_metas_tribunal (Etapa 2): {e_map}")
                lista_resultados_series = [] # Garante que a lista está vazia em caso de erro total
        
        if not lista_resultados_series and not df_agregado_por_tribunal.empty : # Se o map falhou completamente mas havia dados
            print("ERRO: Nenhum resultado obtido do cálculo paralelo de metas. Verifique erros acima.")
        
        df_metas_calculadas = pd.DataFrame(lista_resultados_series)
        
        tempo_fim_calculo_metas_p = time.time()
        print(f"Cálculo de metas (paralelo da Etapa 2) levou: {tempo_fim_calculo_metas_p - tempo_inicio_calculo_metas_p:.2f} segundos.")

        # Juntar as colunas de identificação com as metas calculadas
        # Usar reset_index para garantir alinhamento correto ao concatenar
        df_resumo_metas_etapa2 = pd.concat(
            [df_agregado_por_tribunal[['sigla_tribunal', 'ramo_justica']].reset_index(drop=True), 
            df_metas_calculadas.reset_index(drop=True)], 
            axis=1
        )
        
        print("\nResultado do cálculo de metas (Etapa 2 - P, amostra):")
        print(df_resumo_metas_etapa2.head())

        # --- Formatar e Salvar ResumoMetas.CSV ---
        df_resumo_metas_final = df_resumo_metas_etapa2.fillna(VALOR_NA)
        
        print(f"\nSalvando '{ARQUIVO_RESUMO_METAS_SAIDA}'...") # Já definido como ResumoMetas_P.CSV
        try:
            df_resumo_metas_final.to_csv(ARQUIVO_RESUMO_METAS_SAIDA, sep=SEPARADOR_ESCRITA_RESUMO_METAS, index=False, encoding=CODIFICACAO_CSV)
            print(f"Arquivo '{ARQUIVO_RESUMO_METAS_SAIDA}' salvo com sucesso!")
        except Exception as e:
            print(f"Erro ao salvar '{ARQUIVO_RESUMO_METAS_SAIDA}': {e}")
    else:
        print("\nDataFrame agregado por tribunal (Etapa 2 - P) está vazio.")

    tempo_fim_etapa2_p = time.time()
    print(f"--- FIM DA ETAPA 2 (Sequencial) --- Tempo: {tempo_fim_etapa2_p - tempo_inicio_etapa2_p:.2f}s ---")

    tempo_fim_total_p = time.time()
    print(f"\n### Versao_P.py - Execução Finalizada ### Tempo total: {tempo_fim_total_p - tempo_inicio_total_p:.2f}s ###")
