using System.ComponentModel.DataAnnotations;


namespace BankAccountApi.Models


{
    public class BankAccount
    {
        public int Id { get; set; }

        [Required] public string FirstName { get; set; } = string.Empty;
        [Required] public string LastName { get; set;} = string.Empty;
        [Required] public string BankName { get; set; } = string.Empty;
        [Required] public string AccountNumber {  get; set; } = string.Empty;


    }
}
