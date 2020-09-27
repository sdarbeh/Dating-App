using System;
using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.DTOS
{
    public class UserForRegisterDTO
    {
        [ Required ]
        [ StringLength(13, MinimumLength = 3, ErrorMessage = "Username must be between 3 to 13 characters") ]
        public string Username { get; set; }

        [ Required ]
        public string KnownAs { get; set; }

        [ Required ]
        public string Gender { get; set; }

        [ Required ]
        public DateTime DOB { get; set; }

        [ Required ]
        public string City { get; set; }

        [ Required ]
        public string Country { get; set; }

        [ Required ]
        [ StringLength(13, MinimumLength = 6, ErrorMessage = "Password must be between 6 to 13 characters") ]
        public string Password { get; set; }

        ///
        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public UserForRegisterDTO()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}