using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingAPP.API.Data;
using DatingAPP.API.Dtos;
using DatingAPP.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingAPP.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repository;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repository, IConfiguration config, IMapper mapper)
        {
            _mapper = mapper;
            _repository = repository;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userRegister)
        {
            userRegister.Username = userRegister.Username.ToLower();
            if (await _repository.UserExists(userRegister.Username))
                return BadRequest("El usuario ya existe.");
            User userToCreate = new User { Username = userRegister.Username };
            var user = await _repository.Register(userToCreate, userRegister.Password);
            return StatusCode(201);
        }

        [HttpPost("login")]

        public async Task<IActionResult> Login(UserForLoginDto userLogin)
        {
            var userRepo = await _repository.Login(userLogin.Username, userLogin.Password);

            if (userRepo == null)
                return Unauthorized();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppConfiguracion:Secret").Value));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials

            };
            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var user = _mapper.Map<UserForListDto>(userRepo);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user
            });
        }

    }
}