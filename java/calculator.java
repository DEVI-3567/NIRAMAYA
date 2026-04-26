import java.util.Scanner;
class Calculator {
    int num1;
    int num2;

    void input()
    {
        Scanner sc= new Scanner(System.in);
        System.out.println("enter the first number");
        num1=sc.nextInt();
        System.out.println("enter the second number");
        num2=sc.nextInt();
    }
    void add()
        {
            int r= num1+num2;
            System.out.println("The addition of two number are :" + r);
        }
        void sub()
        {
            int s=num1-num2;
            System.out.println("THe substraction of two numbers are :" + s);
        }
        void mul()
        {
            int m=num1*num2;
            System.out.println("The multiplication of two numbers are:" + m);
        }
        void div()
        {
            if(num2==0)
            {
                System.out.println("Division not possible");
            }
            else
            {
                int d=num1/num2;
                System.out.println("The division of two numbers are :" + d);

            }
        }


}