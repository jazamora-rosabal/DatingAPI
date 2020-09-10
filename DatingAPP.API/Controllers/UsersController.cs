using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingAPP.API.Data;
using DatingAPP.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using DatingAPP.API.Helpers;

namespace DatingAPP.API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        public UsersController(IDatingRepository repository, IMapper mapper)
        {
            _mapper = mapper;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery]UserParams userParams)
        {
            var currentUserID = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var currentUser = await _repository.GetUser(currentUserID);
            userParams.UserId = currentUserID;
            if ( string.IsNullOrEmpty(userParams.Gender) )
            {
                userParams.Gender = currentUser.Gender == "male" ? "female": "male";
            }
            var usersModel = await _repository.GetUsers(userParams);
            var usersToRetun = _mapper.Map<IEnumerable<UserForListDto>>(usersModel);

            Response.AddPagination(usersModel.CurrentPage, usersModel.PageSize, usersModel.TotalCount, usersModel.TotalPage);

            return Ok(usersToRetun);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var userModel = await _repository.GetUser(id);
            if (userModel == null)
                return NotFound();
            var userToReturn = _mapper.Map<UserForDetailedDto>(userModel);
            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userUpdateDto)
        {
            if (!id.IsLoggenInUser(User))
                return Unauthorized();
            var userModel = await _repository.GetUser(id);
            _mapper.Map(userUpdateDto, userModel);
            if (await _repository.SaveAll())
                return NoContent();

            throw new System.Exception($"Updating user {id} failed on save.");
        }
    }
}