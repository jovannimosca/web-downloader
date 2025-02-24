import multiprocessing
from time import sleep

def do_something(name: str, count: int):
   for n in range(count):
      sleep(1)
      print(f"{name}: {n}")

def worker(q):
   while True:
      args, kwargs = q.get()
      if args is None and kwargs is None:
         break
      do_something(*args, **kwargs)

if __name__ == '__main__':
   q = multiprocessing.Queue()

   # Create worker processes
   processes = []
   for i in range(5):
      p = multiprocessing.Process(target=worker, args=(q,))
      p.start()
      processes.append(p)

   # Enqueue actual work
   q.put((["Alice", 5], {}))
   q.put((["John", 2], {}))

   # Signal workers to exit
   for i in range(5):
      q.put((None, None))

   # Wait for all processes to finish
   for p in processes:
      p.join()