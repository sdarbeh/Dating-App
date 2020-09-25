using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Models;
using DatingAppAPI.DTOS;
using DatingAppAPI.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingAppAPI.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository repository, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _repo = repository;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiSecret,
                _cloudinaryConfig.Value.ApiKey
            );

            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);

            var photo = _mapper.Map<PhotoForReturnDTO>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreationDTO photoCreationDTO)
        {
            // checks if ID matches token id
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            // gets user from db
            var userFromRepo = await _repo.GetUser(userId);

            // gets information about the uploading file
            var file = photoCreationDTO.File;

            // instance of the cloudinary file
            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                // reads file
                using (var stream = file.OpenReadStream())
                {
                    // file parameters
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                            .Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    // uploads file to cloudinary
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            // sets propperties for DTO
            photoCreationDTO.Url = uploadResult.Url.ToString();
            photoCreationDTO.PublicId = uploadResult.PublicId;

            // maps photo dto and stores matching props
            var photo = _mapper.Map<Photo>(photoCreationDTO);

            if (!userFromRepo.Photos.Any(pic => pic.IsMain))
                photo.IsMain = true;

            // adds photo to db model
            userFromRepo.Photos.Add(photo);

            // saves model to db
            if (await _repo.SaveAll())
            {
                // maps photo to send back to client
                var photoToReturn = _mapper.Map<PhotoForReturnDTO>(photo);
                /* 
                    returns create route
                    location client can request the photo
                    ex. domain/api/photo/users/{userId}/{photoId}
                    "Get Photo" is the api route for client
                */
                return CreatedAtRoute("GetPhoto", new { userId, id = photo.Id }, photoToReturn);
            }

            return BadRequest("Error uploading");
        }

    }
}