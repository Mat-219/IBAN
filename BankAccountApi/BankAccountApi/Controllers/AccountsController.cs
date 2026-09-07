using BankAccountApi.Data;
using BankAccountApi.DataFromUser;
using BankAccountApi.DataFromUser;
using BankAccountApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            await _context.SaveChangesAsync();

            return Ok(account);
        }
    }
}