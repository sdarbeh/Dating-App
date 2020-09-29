using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingAppAPI.Data;
using DatingAppAPI.DTOS;
using DatingAppAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingAppAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDTO registerDto)
        {
            registerDto.Username = registerDto.Username.ToLower();

            if (await _repo.UserExists(registerDto.Username))
                return BadRequest("Username already exists");

            var userToCreate = _mapper.Map<User>(registerDto);

            var createdUser = await _repo.Register(userToCreate, registerDto.Password);

            var userToReturn = _mapper.Map<UserForDetailedDTO>(createdUser);

            // name is in UsersController
            return CreatedAtRoute("GetUser", new { controller = "Users", id = createdUser.Id }, userToReturn);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDTO loginDto)
        {
            var userFromRepo = await _repo.Login(loginDto.Username.ToLower(), loginDto.Password);

            if (userFromRepo == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescripter = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescripter);

            var userForReturn = _mapper.Map<UserForListDTO>(userFromRepo);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                currentUser = userForReturn
            });
        }
    }
}