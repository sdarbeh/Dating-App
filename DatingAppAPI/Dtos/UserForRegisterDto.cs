using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOS
{
    public class UserForRegisterDTO
    {
        [ Required ]
        public string Username { get; set; }

        [ Required ]
        [ StringLength(13, MinimumLength = 6, ErrorMessage = "Password must be between 6 to 13 characters") ]
        public string Password { get; set; }
    }
}