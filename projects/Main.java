import java.util.Scanner;

// Stack Class
class Stack {
    int arr[];
    int top;
    int capacity;

    Stack(int size) {
        arr = new int[size];
        capacity = size;
        top = -1;
    }

    void push(int x) {
        if (top == capacity - 1) {
            System.out.println("Stack Overflow");
            return;
        }
        arr[++top] = x;
        System.out.println(x + " pushed to stack");
    }

    void pop() {
        if (top == -1) {
            System.out.println("Stack Underflow");
            return;
        }
        System.out.println("Popped: " + arr[top--]);
    }

    void display() {
        if (top == -1) {
            System.out.println("Stack is empty");
            return;
        }
        for (int i = top; i >= 0; i--) {
            System.out.println(arr[i]);
        }
    }
}

// Queue Class
class Queue {
    int arr[];
    int front, rear, capacity;

    Queue(int size) {
        arr = new int[size];
        capacity = size;
        front = 0;
        rear = -1;
    }

    void enqueue(int x) {
        if (rear == capacity - 1) {
            System.out.println("Queue Overflow");
            return;
        }
        arr[++rear] = x;
        System.out.println(x + " added to queue");
    }

    void dequeue() {
        if (front > rear) {
            System.out.println("Queue Underflow");
            return;
        }
        System.out.println("Deleted: " + arr[front++]);
    }

    void display() {
        if (front > rear) {
            System.out.println("Queue is empty");
            return;
        }
        for (int i = front; i <= rear; i++) {
            System.out.println(arr[i]);
        }
    }
}

// Main Class
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        Stack s = new Stack(5);
        Queue q = new Queue(5);

        int choice, value;

        do {
            System.out.println("\n1.Push Stack");
            System.out.println("2.Pop Stack");
            System.out.println("3.Display Stack");
            System.out.println("4.Enqueue Queue");
            System.out.println("5.Dequeue Queue");
            System.out.println("6.Display Queue");
            System.out.println("7.Exit");
            System.out.print("Enter choice: ");

            choice = sc.nextInt();

            switch (choice) {
                case 1:
                    System.out.print("Enter value: ");
                    value = sc.nextInt();
                    s.push(value);
                    break;

                case 2:
                    s.pop();
                    break;

                case 3:
                    s.display();
                    break;

                case 4:
                    System.out.print("Enter value: ");
                    value = sc.nextInt();
                    q.enqueue(value);
                    break;

                case 5:
                    q.dequeue();
                    break;

                case 6:
                    q.display();
                    break;

                case 7:
                    System.out.println("Exit");
                    break;

                default:
                    System.out.println("Invalid choice");
            }

        } while (choice != 7);

        sc.close();
    }
}