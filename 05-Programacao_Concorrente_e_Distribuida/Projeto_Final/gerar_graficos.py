import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os

# -----------------------------------------------------------------------------
# CONFIGURAÇÕES GLOBAIS
# -----------------------------------------------------------------------------
PASTA_GRAFICOS = 'GRAFICOS'
RESUMO_METAS_OPCOES = [
    'ResumoMetas_P.csv',      # Resultado da versão paralela
    'ResumoMetas_NP.csv',      # Resultado da versão sequencial padrão
    'ResumoMetas_Otimizada.csv' # Resultado da versão otimizada para memória
]
SEPARADOR_CSV = ';'
CODIFICACAO_CSV = 'utf-8'
VALOR_NA_STR = "NA"
ALVO_META = 100.0
LISTA_DE_CORES = [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
    '#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5'
]

# -----------------------------------------------------------------------------
# FUNÇÃO PARA GERAR GRÁFICO 1: CONFORMIDADE GERAL
# -----------------------------------------------------------------------------
def gerar_grafico_conformidade_geral(df_resumo):
    """
    Gera um gráfico de barras empilhadas mostrando o percentual de metas
    cumpridas vs. não cumpridas para cada ramo da justiça, com rótulos de contagem.
    """
    print("\nGerando gráfico de Conformidade Geral dos Ramos...")
    
    id_vars = ['sigla_tribunal', 'ramo_justica']
    meta_cols = [col for col in df_resumo.columns if col.startswith('Meta')]
    
    df_longo = pd.melt(df_resumo, id_vars=id_vars, value_vars=meta_cols, var_name='meta_nome', value_name='meta_valor')
    df_aplicavel = df_longo[df_longo['meta_valor'] != VALOR_NA_STR].copy()
    df_aplicavel['meta_valor_num'] = pd.to_numeric(df_aplicavel['meta_valor'], errors='coerce')
    df_aplicavel.dropna(subset=['meta_valor_num'], inplace=True)
    df_aplicavel['status_cumprimento'] = np.where(df_aplicavel['meta_valor_num'] >= ALVO_META, 'Cumprida', 'Não Cumprida')
    
    contagem_status_por_ramo = df_aplicavel.groupby(['ramo_justica', 'status_cumprimento']).size().unstack(fill_value=0)
    
    df_percentual = contagem_status_por_ramo.div(contagem_status_por_ramo.sum(axis=1), axis=0) * 100
    
    if 'Cumprida' not in df_percentual: df_percentual['Cumprida'] = 0
    if 'Não Cumprida' not in df_percentual: df_percentual['Não Cumprida'] = 0
    
    df_plot = df_percentual[['Cumprida', 'Não Cumprida']].sort_values(by='Cumprida', ascending=False)

    if not df_plot.empty:
        ax = df_plot.plot(kind='bar', stacked=True, figsize=(15, 9), 
                            color={'Cumprida': 'forestgreen', 'Não Cumprida': 'lightcoral'})
        
        plt.title('Percentual de Metas Cumpridas por Ramo da Justiça', fontsize=18, pad=20)
        plt.ylabel('Percentual de Metas (%)', fontsize=14)
        plt.xlabel('Ramo da Justiça', fontsize=14)
        plt.xticks(rotation=45, ha="right", fontsize=11)
        plt.yticks(np.arange(0, 101, 10), fontsize=10)
        plt.legend(title='Status da Meta', title_fontsize='13', fontsize='11', bbox_to_anchor=(1.02, 1), loc='upper left')
        plt.grid(axis='y', linestyle=':', alpha=0.7)

        # --- RÓTULO ---
        # Adiciona rótulos com a porcentagem e a contagem absoluta
        for c in ax.containers:
            # Container para 'Cumprida' ou 'Não Cumprida'
            status = c.get_label()
            contagens_absolutas = contagem_status_por_ramo.reindex(df_plot.index)[status]
            
            # Formatar rótulos
            labels = []
            for i in range(len(c)):
                altura_barra = c[i].get_height()
                contagem = contagens_absolutas[i]
                if altura_barra > 5: # Só adiciona rótulo se for um segmento visível
                    labels.append(f"{altura_barra:.1f}%\n({contagem} metas)")
                else:
                    labels.append('')
            
            ax.bar_label(c, labels=labels, label_type='center', fontsize=9, color='white', weight='bold')

        plt.tight_layout(rect=[0, 0, 0.9, 1]) # Ajustar layout para dar espaço à legenda
        
        nome_arquivo_grafico = 'grafico_conformidade_geral.png'
        caminho_final_grafico = os.path.join(PASTA_GRAFICOS, nome_arquivo_grafico)
        plt.savefig(caminho_final_grafico, dpi=150)
        print(f"\nGráfico salvo com sucesso como: {caminho_final_grafico}")
        plt.close()
    else:
        print("Não foi possível gerar dados para o gráfico de conformidade.")

# -----------------------------------------------------------------------------
# FUNÇÃO PARA GERAR GRÁFICO 2: DESEMPENHO DETALHADO
# -----------------------------------------------------------------------------
def gerar_grafico_desempenho_detalhado(df_resumo, selecao, tipo_selecao='ramo'):
    print(f"\nGerando gráfico de desempenho detalhado para '{selecao}'...")
    
    mapa_sufixo = {
        "Justiça Estadual": "_JE", "Justiça do Trabalho": "_JT", "Justiça Federal": "_JF",
        "Justiça Militar da União": "_JMU", "Justiça Militar Estadual": "_JME",
        "Justiça Eleitoral": "_TSE"
    }
    
    if tipo_selecao == 'ramo':
        df_selecao = df_resumo[df_resumo['ramo_justica'] == selecao]
        sufixo_meta = mapa_sufixo.get(selecao)
    elif tipo_selecao == 'tribunal':
        df_selecao = df_resumo[df_resumo['sigla_tribunal'] == selecao]
        sufixo_meta = f"_{selecao}"
    
    if not sufixo_meta:
        print(f"AVISO: Ramo '{selecao}' não possui um sufixo de meta pré-definido.")
        return

    colunas_meta_selecao = [col for col in df_selecao.columns if col.endswith(sufixo_meta)]
    if not colunas_meta_selecao:
        print(f"Nenhuma coluna de meta encontrada para '{selecao}'.")
        return

    desempenho_medio = {}
    contagem_sucesso = {}
    
    for col in colunas_meta_selecao:
        valores_numericos = pd.to_numeric(df_selecao[col], errors='coerce')
        media = valores_numericos.mean()
        if pd.notna(media):
            desempenho_medio[col] = media
        
        sucessos = (valores_numericos >= ALVO_META).sum()
        total_aplicavel = valores_numericos.notna().sum()
        contagem_sucesso[col] = (sucessos, total_aplicavel)

    if not desempenho_medio:
        print(f"Não há dados de desempenho válidos para gerar o gráfico de '{selecao}'.")
        return

    df_plot = pd.Series(desempenho_medio).sort_values(ascending=False)

    plt.figure(figsize=(18, 10))
    bars = df_plot.plot(kind='bar', color=LISTA_DE_CORES, zorder=2)
    
    plt.title(f'Desempenho Médio e Contagem de Tribunais que Cumpriram a Meta - {selecao}', fontsize=18, pad=20)
    plt.ylabel('Desempenho Médio (%)', fontsize=14)
    plt.xlabel('Metas', fontsize=14)
    plt.xticks(rotation=45, ha="right", fontsize=11)
    plt.yticks(fontsize=10)
    plt.axhline(y=ALVO_META, color='red', linestyle='--', linewidth=1.5, label=f'Alvo de Desempenho ({ALVO_META:.0f}%)', zorder=1)

    for i, bar in enumerate(bars.patches):
        yval = bar.get_height()
        meta_name = df_plot.index[i]
        sucessos, total_aplicavel = contagem_sucesso.get(meta_name, (0, 0))
        
        if pd.notna(yval):
            label_texto = f"{yval:.1f}%\n({int(sucessos)} de {total_aplicavel})"
            plt.text(x=bar.get_x() + bar.get_width() / 2.0, y=yval + 0.5, s=label_texto,
                        ha='center', va='bottom', fontsize=9, fontweight='bold', color='black',
                        bbox=dict(facecolor='white', alpha=0.7, edgecolor='none', boxstyle='round,pad=0.2')
                    )

    plt.legend(fontsize=12)
    plt.grid(axis='y', linestyle=':', alpha=0.7)
    plt.tight_layout()
    
    nome_arquivo_grafico = f"grafico_{selecao.replace(' ', '_')}.png"
    caminho_final_grafico = os.path.join(PASTA_GRAFICOS, nome_arquivo_grafico)
    plt.savefig(caminho_final_grafico, dpi=150)
    print(f"\nGráfico salvo com sucesso como: {caminho_final_grafico}")
    plt.close()

# -----------------------------------------------------------------------------
# BLOCO PRINCIPAL DE EXECUÇÃO / MENU
# -----------------------------------------------------------------------------
def menu_principal():
    """
    Verifica a existência de um arquivo de resumo, carrega os dados e 
    exibe o menu interativo para geração de gráficos.
    """
    # --- DETECÇÃO DE ARQUIVO ---
    resumo_metas_escolhido = None
    for arquivo in RESUMO_METAS_OPCOES:
        if os.path.exists(arquivo):
            resumo_metas_escolhido = arquivo
            print(f"Arquivo de resumo de metas encontrado: '{resumo_metas_escolhido}'")
            break # Para de procurar assim que encontra o primeiro da lista de preferência

    if resumo_metas_escolhido is None:
        print("ERRO: Nenhum arquivo de resumo de metas (ResumoMetas_P.CSV, _NP.csv, etc.) foi encontrado.")
        print("Por favor, execute um dos scripts de processamento (Versao_NP.py, Versao_P.py, etc.) primeiro.")
        return # Sai da função menu_principal

    try:
        os.makedirs(PASTA_GRAFICOS, exist_ok=True)
        # Carrega o arquivo que foi encontrado
        df_resumo = pd.read_csv(resumo_metas_escolhido, sep=SEPARADOR_CSV, encoding=CODIFICACAO_CSV)
        print(f"Arquivo '{resumo_metas_escolhido}' carregado com sucesso para análise.")
    except Exception as e:
        print(f"Erro ao preparar o ambiente ou carregar o arquivo '{resumo_metas_escolhido}': {e}")
        return

    while True:
        print("\n--- Menu Principal de Gráficos ---")
        print("1: Gerar Gráfico Geral de Conformidade dos Ramos")
        print("2: Gerar Gráfico para Ramo e/ou Tribunal Desejado")
        print("0: Sair")
        
        escolha_menu = input("\nDigite sua escolha: ")

        if escolha_menu == '1':
            gerar_grafico_conformidade_geral(df_resumo)
        elif escolha_menu == '2':
            ramos_disponiveis = sorted(df_resumo['ramo_justica'].unique())
            while True:
                print("\n--- Selecione o Ramo para Análise Detalhada ---")
                for i, ramo in enumerate(ramos_disponiveis):
                    print(f"{i + 1}: Analisar Ramo '{ramo}'")
                print("0: Voltar ao Menu Principal")
                
                try:
                    escolha_ramo_str = input("\nDigite o número do ramo: ")
                    escolha_ramo = int(escolha_ramo_str)

                    if escolha_ramo == 0: break
                    if 1 <= escolha_ramo <= len(ramos_disponiveis):
                        ramo_selecionado = ramos_disponiveis[escolha_ramo - 1]
                        
                        if ramo_selecionado == "Tribunais Superiores":
                            # Sub-menu para STJ e TST
                            tribunais_superiores = sorted(df_resumo[df_resumo['ramo_justica'] == ramo_selecionado]['sigla_tribunal'].unique())
                            print("\n--- Sub-menu: Tribunais Superiores ---")
                            for j, tribunal in enumerate(tribunais_superiores):
                                print(f"{j + 1}: Analisar Tribunal '{tribunal}'")
                            print("0: Voltar")
                            
                            sub_escolha_str = input("\nDigite o número do tribunal: ")
                            sub_escolha = int(sub_escolha_str)
                            if sub_escolha == 0: continue
                            if 1 <= sub_escolha <= len(tribunais_superiores):
                                tribunal_selecionado = tribunais_superiores[sub_escolha - 1]
                                gerar_grafico_desempenho_detalhado(df_resumo, tribunal_selecionado, tipo_selecao='tribunal')
                            else: print("Opção de tribunal inválida.")
                        else:
                            gerar_grafico_desempenho_detalhado(df_resumo, ramo_selecionado, tipo_selecao='ramo')
                    else:
                        print("Opção de ramo inválida.")
                except ValueError:
                    print("Entrada inválida. Por favor, digite um número.")
        elif escolha_menu == '0':
            print("Finalizando o programa.\n")
            break
        else:
            print("Opção inválida. Tente novamente.\n")

if __name__ == "__main__":
    menu_principal()