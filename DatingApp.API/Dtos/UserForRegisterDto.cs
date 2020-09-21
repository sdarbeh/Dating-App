using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [ Required ]
        public string Username { get; set; }

        [ Required ]
        [ StringLength(13, MinimumLength = 6, ErrorMessage = "Password must be between 6 to 13 characters") ]
        public string Password { get; set; }
    }
}