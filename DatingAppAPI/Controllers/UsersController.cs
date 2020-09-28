using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTOS;
using DatingApp.API.Helpers;
using DatingAppAPI.DTOS;
using DatingAppAPI.Helpers;
using DatingAppAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery] UserParams userParams)
        {
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var userFromRepo = await _repo.GetUser(currentUserId);

            userParams.UserId = currentUserId;

            // placeholder intially checks if params gender is empty
            // if so, filter will send opposite gender
            // however client side accepts custom genders so this method will fail

            // checks if gender feild was specified
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = "all";
            }

            var usersFromRepo = await _repo.GetUsers(userParams);

            var usersToReturn = _mapper.Map<IEnumerable<UserForListDTO>>(usersFromRepo);

            Response.AddPagination(usersFromRepo.CurrentPage,
                usersFromRepo.PageSize, usersFromRepo.TotalCount, usersFromRepo.TotalPages);

            return Ok(usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var userFromRepo = await _repo.GetUser(id);
            var userToReturn = _mapper.Map<UserForDetailedDTO>(userFromRepo);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDTO updateDTo)
        {
            // checks if ID matches token id
            if (id != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);

            // updates values from Dto and writes them to user
            _mapper.Map(updateDTo, userFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception($"Updating user {id} failed on save");
        }
    
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId) 
        {
            // checks if ID matches token id
            if (id != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                return Unauthorized();
            
            var like = await _repo.GetLike(id, recipientId);

            if (like != null)
                return BadRequest("You already like this user");
            
            if (await _repo.GetUser(recipientId) == null)
                return NotFound();
            
            like = new Like 
            {
                LikerId = id,
                LikeeId = recipientId
            };
            
            _repo.Add<Like>(like);

            if (await _repo.SaveAll())
                return Ok();

            return BadRequest("Problem liking user");
        }
    }
}