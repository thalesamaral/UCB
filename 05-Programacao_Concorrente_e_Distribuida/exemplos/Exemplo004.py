import threading
import time

def saudacao(nome, tempo):
    print(f"Olá, {nome}")
    time.sleep(tempo)
    print(f"Tchau, {nome}")

A = threading.Thread(target = saudacao, args = ("Ana", 5))
B = threading.Thread(target = saudacao, args = ("Beatriz", 2))

A.start()
B.start()
A.join()
B.join()

print("Thread principal encerrada!!!")

"""
RESULTADO
= Olá, Ana
= Olá, Beatriz
= Tchau, Beatriz
= Tchau, Ana
"""