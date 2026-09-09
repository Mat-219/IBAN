using BankAccountApi.Data;
using BankAccountApi.DataFromUser;
using BankAccountApi.DataFromUser;
using BankAccountApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BankAccountApi.Validation;

namespace BankAccountApi.Controllersnode
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AccountsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAccount([FromBody] CreateBankAccountRequest request)
        {
            if (!IBANvalidator.IsValid(request.AccountNumber))
            {
                return BadRequest(new { message = "Nieprawidłowy numer konta (IBAN)" });
            }

            bool exists = await _context.BankAccounts
                .AnyAsync(a => a.AccountNumber == request.AccountNumber);

            if (exists)
            {
                return BadRequest(new { message = "Konto o tym numerze już istnieje." });
            }

            var account = new BankAccount
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                BankName = request.BankName,
                AccountNumber = request.AccountNumber
            };

            _context.BankAccounts.Add(account);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                return BadRequest(new { message = "Konto o tym numerze już istnieje." });
            }

            return Ok(account);
        }
    }
}