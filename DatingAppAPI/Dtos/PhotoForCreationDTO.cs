using System;
using Microsoft.AspNetCore.Http;

namespace DatingAppAPI.DTOS
{
    public class PhotoForCreationDTO
    {
        public string Url { get; set; }
        public IFormFile File { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public string PublicId { get; set; }
        public PhotoForCreationDTO() {
            Created = DateTime.Now;
        }
    }
}