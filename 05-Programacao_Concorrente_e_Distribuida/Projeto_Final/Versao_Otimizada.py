import pandas as pd
import os
import time # Para medir o tempo de execução

# -----------------------------------------------------------------------------
# CONFIGURAÇÕES GLOBAIS
# -----------------------------------------------------------------------------
diretorio_do_script = os.path.dirname(os.path.abspath(__file__))
PASTA_DADOS_CSV = os.path.join(diretorio_do_script, 'PASTA_DADOS_CSV')
CODIFICACAO_CSV = 'utf-8'
VALOR_NA = "NA"

# --- Nomes dos arquivos de Saída para Versao_Otimizada.py ---
ARQUIVO_RESUMO_METAS_SAIDA = 'ResumoMetas_Otimizada.csv'

# --- Separadores ---
SEPARADOR_LEITURA_ORIGINAIS_CSV = ','
SEPARADOR_ESCRITA_CONSOLIDADO_CSV = ';'
SEPARADOR_LEITURA_CONSOLIDADO_CSV = SEPARADOR_ESCRITA_CONSOLIDADO_CSV # Consistência
SEPARADOR_ESCRITA_RESUMO_METAS = ';'

# Lista de todas as colunas base que precisam ser somadas para QUALQUER meta.
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

    # Bloco Justiça Estadual
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
    
    # Padronização das colunas de saída
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
# BLOCO PRINCIPAL DE EXECUÇÃO - VERSÃO EFICIENTE EM MEMÓRIA
# -----------------------------------------------------------------------------
if __name__ == "__main__":
    print("### INICIANDO Versao_NP.py (Modo Eficiente em Memória) ###")
    tempo_inicio_total = time.time()

    # --- ETAPA 1 e 2 COMBINADAS E OTIMIZADAS ---
    print(f"\n--- INICIANDO PROCESSAMENTO OTIMIZADO ---")
    tempo_inicio_processamento = time.time()

    if not os.path.exists(PASTA_DADOS_CSV):
        print(f"ERRO: A pasta '{PASTA_DADOS_CSV}' não foi encontrada.")
        exit()

    nomes_arquivos_csv = [f for f in os.listdir(PASTA_DADOS_CSV) if f.lower().endswith('.csv')]
    if not nomes_arquivos_csv:
        print(f"ERRO: Nenhum arquivo .csv encontrado na pasta '{PASTA_DADOS_CSV}'.")
        exit()
    
    print(f"Encontrados {len(nomes_arquivos_csv)} arquivos para processar.")

    lista_resultados_agregados = []

    for nome_arquivo in nomes_arquivos_csv:
        caminho_completo = os.path.join(PASTA_DADOS_CSV, nome_arquivo)
        print(f"Processando arquivo: {nome_arquivo}...")
        try:
            # Ler apenas as colunas necessárias para economizar memória
            colunas_necessarias = ['sigla_tribunal', 'ramo_justica'] + [c for c in colunas_para_soma if c in pd.read_csv(caminho_completo, sep=SEPARADOR_LEITURA_ORIGINAIS_CSV, encoding=CODIFICACAO_CSV, nrows=0).columns]
            
            df_temp = pd.read_csv(caminho_completo, sep=SEPARADOR_LEITURA_ORIGINAIS_CSV, 
                                    encoding=CODIFICACAO_CSV, usecols=lambda c: c in set(colunas_necessarias),
                                    low_memory=False)

            if df_temp.empty:
                print(f"AVISO: O arquivo '{nome_arquivo}' está vazio ou não contém colunas necessárias. Pulando.")
                continue

            # Converter para numérico as colunas de soma que existem neste arquivo
            for col in colunas_para_soma:
                if col in df_temp.columns:
                    df_temp[col] = pd.to_numeric(df_temp[col], errors='coerce')
            
            # Agregar os dados deste único arquivo
            agregacoes = {col: 'sum' for col in colunas_para_soma if col in df_temp.columns}
            agregacoes['ramo_justica'] = 'first'
            
            df_agregado_arquivo = df_temp.groupby('sigla_tribunal', as_index=False).agg(agregacoes)
            
            lista_resultados_agregados.append(df_agregado_arquivo)

        except Exception as e:
            print(f"Erro ao processar o arquivo '{nome_arquivo}': {e}")
            
    if not lista_resultados_agregados:
        print("ERRO: Nenhum dado pôde ser processado. Finalizando.")
        exit()

    print("\nCombinando resultados agregados de todos os arquivos...")
    # Concatena os DataFrames JÁ AGREGADOS (que são pequenos)
    df_agregado_completo = pd.concat(lista_resultados_agregados, ignore_index=True)
    
    # Se um mesmo tribunal aparecer em múltiplos arquivos (improvável, mas possível),
    # precisamos reagrupar e somar novamente.
    agregacoes_finais = {col: 'sum' for col in colunas_para_soma if col in df_agregado_completo.columns}
    agregacoes_finais['ramo_justica'] = 'first'
    df_agregado_por_tribunal = df_agregado_completo.groupby('sigla_tribunal', as_index=False).agg(agregacoes_finais)

    # Preencher NaNs com 0
    for col in colunas_para_soma:
        if col in df_agregado_por_tribunal.columns:
            df_agregado_por_tribunal[col] = df_agregado_por_tribunal[col].fillna(0)

    print(f"Dados agregados finais criados. Shape: {df_agregado_por_tribunal.shape}")
    
    # O restante do código (cálculo de metas e salvamento) é o mesmo
    # mas usando 'df_agregado_por_tribunal' como entrada.
    if not df_agregado_por_tribunal.empty:
        print("\nCalculando metas...")
        df_metas_calculadas = df_agregado_por_tribunal.apply(calcular_metas_tribunal, axis=1)
        df_resumo_metas = pd.concat([df_agregado_por_tribunal[['sigla_tribunal', 'ramo_justica']], df_metas_calculadas], axis=1)
        df_resumo_metas_final = df_resumo_metas.fillna(VALOR_NA)
        
        print(f"\nSalvando '{ARQUIVO_RESUMO_METAS_SAIDA}'...")
        df_resumo_metas_final.to_csv(ARQUIVO_RESUMO_METAS_SAIDA, sep=SEPARADOR_ESCRITA_RESUMO_METAS, index=False, encoding=CODIFICACAO_CSV)
        print("Arquivo de resumo de metas salvo com sucesso!")
    
    tempo_fim_processamento = time.time()
    print(f"--- FIM DO PROCESSAMENTO OTIMIZADO --- Tempo: {tempo_fim_processamento - tempo_inicio_processamento:.2f}s ---")
    
    tempo_fim_total = time.time()
    print(f"\n### Versao_NP.py - Execução Finalizada ### Tempo total: {tempo_fim_total - tempo_inicio_total:.2f}s ###")
