using Microsoft.EntityFrameworkCore;
using BankAccountApi.Models;



namespace BankAccountApi.Data

{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<BankAccount> BankAccounts { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BankAccount>().HasIndex(b => b.AccountNumber)
            .IsUnique();
        }
    
           
    }
}

