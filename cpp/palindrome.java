
public class palindrome

{
    
    public static void main(String args[])
    {
    int n=121;
    
    while(n>0)
        {
            int r=0;
            int d=n%10;
             r=r*10+d;
            n=n/10;
        }
        int r = 0;
        if(n==r)
            {
                System.out.println("it is a pallindrome number");
            }
            else
                System.out.println("it is not a pallindrome number");
    }
}