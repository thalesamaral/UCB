import threading
import time

lock1 = threading.Lock()
lock2 = threading.Lock()

def T1():
    print("T1: tentando adquirir lock1")
    lock1.acquire()
    print("T1: lock1 adquirido, agora tentando adquirir o lock2")
    time.sleep(1)
    lock2.acquire()
    print("T1: lock2 adquirido")
    lock2.release()
    lock1.release()
    print("T1: Finalizada")

def T2():
    print("T2: tentando adquirir lock2")
    lock2.acquire()
    print("T2: lock2 adquirido, agora tentando adquirir o lock1")
    time.sleep(1)
    lock1.acquire()
    print("T12: lock1 adquirido")
    lock1.release()
    lock2.release()
    print("T1: Finalizada")

t1 = threading.Thread(target = T1)
t2 = threading.Thread(target = T2)

t1.start()
t2.start()

t1.join()
t2.join()