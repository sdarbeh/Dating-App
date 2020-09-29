using System;
using System.Collections.Generic;
using DatingAppAPI.Models;

namespace DatingAppAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Gender { get; set; }
        public DateTime DOB { get; set; }
        public string KnownAs { get; set; }
        public string Bio { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }

        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public ICollection<Photo> Photos { get; set; }

        public ICollection<Like> Likers { get; set; }
        public ICollection<Like> Likees { get; set; }

        public ICollection<Message> MessageSent { get; set; }
        public ICollection<Message> MessageReceived { get; set; }
    }
}