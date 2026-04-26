public class Demo
{
    public static void main(String args[])
    {
        //MULTIDIMENSIONAL ARRAY
         int nums[][]=new int[3][4];
        // int num1[]={4,5,7,8};
        // int num2[]={10,5,7,3};
        // int num3[]={4,2,0,6};
        //for(int i=0;i<4;i++)
        
            //{
                //nums[0][i]=num1[i];
            //}
    
            //for(int i=0;i<4;i++)
               // {
                   // System.out.println(nums[0][i]);
               // }
        
         //int random =Math.random();
       for(int i=0;i<3;i++)
        {


            for(int j=0;j<4;j++)
                {
                    nums[i][j]=(int)(Math.random()*100);
                    System.out.println(nums[i][j]);
                }
        }
    }
}