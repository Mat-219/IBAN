namespace BankAccountApi.Validation
{
    public static class IBANvalidator
    {
        public static bool IsValid(string iban)
        {
            var cleaned = iban.Replace(" ", "").ToUpper();

            if (!System.Text.RegularExpressions.Regex.IsMatch(cleaned, @"^[A-Z]{2}\d{2}[A-Z0-9]+$"))
            {
                return false;
            }

            var rearranged = cleaned.Substring(4) + cleaned.Substring(0, 4);

            var converted = new System.Text.StringBuilder();
            foreach (char c in rearranged)
            {
                if (char.IsLetter(c))
                {
                    converted.Append((int)c - 55);
                }
                else
                {
                    converted.Append(c);
                }
            }

            return Mod97(converted.ToString()) == 1;
        }

        private static int Mod97(string digits)
        {
            int remainder = 0;
            foreach (char c in digits)
            {
                int digit = c - '0';
                remainder = (remainder * 10 + digit) % 97;
            }
            return remainder;
        }
    }
}
