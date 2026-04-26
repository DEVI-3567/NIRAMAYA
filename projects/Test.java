class MyTask implements Runnable {
    public void run() {
        System.out.println("Child Thread is running");
    }
}

public class Main {
    public static void main(String[] args) 
    {
        MyTask task = new MyTask();      // create object of task
        Thread t = new Thread(task);    // create thread using task
        t.start();                      // start thread

        System.out.println("Main Thread is running");
    }
}