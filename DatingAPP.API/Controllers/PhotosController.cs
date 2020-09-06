using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingAPP.API.Data;
using DatingAPP.API.Dtos;
using DatingAPP.API.Helpers;
using DatingAPP.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingAPP.API.Controllers
{
    [Authorize]
    [Route("api/users/{userid}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _repository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySetting> _cloudinaryOptions;
        private Cloudinary _cloudinaryObj;

        public PhotosController(IDatingRepository repository, IMapper mapper, IOptions<CloudinarySetting> cloudinaryOptions)
        {
            _cloudinaryOptions = cloudinaryOptions;
            _mapper = mapper;
            _repository = repository;

            Account account = new Account(
                _cloudinaryOptions.Value.CloudName,
                _cloudinaryOptions.Value.ApiKey,
                _cloudinaryOptions.Value.ApiSecret
            );
            _cloudinaryObj = new Cloudinary(account);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoModel = await _repository.GetPhoto(id);

            if (photoModel != null)
            {
                var photo = _mapper.Map<PhotoForReturnDto>(photoModel);
                return Ok(photo);
            }
            return NotFound();
        }


        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm] PhotoForCreationDto photoForCreation)
        {
            if (!userId.IsLoggenInUser(User))
                return Unauthorized();

            var userModel = await _repository.GetUser(userId);

            var file = photoForCreation.File;

            var uploadResult = new ImageUploadResult();

            if (file != null && file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {

                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(400).Height(400).Gravity("face").Crop("fill")
                    };

                    uploadResult = await _cloudinaryObj.UploadAsync(uploadParams);
                    //uploadResult = _cloudinaryObj.Upload(uploadParams);
                }
                photoForCreation.Url = uploadResult.Url.ToString();
                photoForCreation.PublicId = uploadResult.PublicId;

                var photo = _mapper.Map<Photo>(photoForCreation);

                if (!userModel.Photos.Any(photoObj => photoObj.IsMain))
                    photo.IsMain = true;

                userModel.Photos.Add(photo);

                if (await _repository.SaveAll())
                {
                    var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                    return CreatedAtRoute("GetPhoto", new { userId = userId, id = photo.Id }, photoToReturn);
                }

                return BadRequest("Could not add the photo");
            }
            return BadRequest("Could not add the empty photo");
        }

        [HttpPost("{photoId}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int photoId)
        {
            if (!userId.IsLoggenInUser(User))
                return Unauthorized();

            var userModel = await _repository.GetUser(userId);
            if (userModel == null)
                return NotFound("User no Found");

            if (!userModel.Photos.Any(photoObj => photoObj.Id == photoId))
                return Unauthorized();

            var photoFromRepo = await _repository.GetPhoto(photoId);

            if (photoFromRepo == null)
                return NotFound("Photo not Found");

            if (photoFromRepo.IsMain)
                return BadRequest("This is already the Main Photo");

            var currentMainPhoto = await _repository.GetMainPhotoForUser(userId);
            currentMainPhoto.IsMain = false;

            photoFromRepo.IsMain = true;
            if (await _repository.SaveAll())
                return NoContent();
            return BadRequest("Could not set photo to main");
        }

        [HttpDelete("{photoId}")]
        public async Task<IActionResult> DeletePhoto(int userId, int photoId)
        {
            if (!userId.IsLoggenInUser(User))
                return Unauthorized();

            var userModel = await _repository.GetUser(userId);
            if (userModel == null)
                return NotFound("User no Found");

            if (!userModel.Photos.Any(photoObj => photoObj.Id == photoId))
                return Unauthorized();

            var photoFromRepo = await _repository.GetPhoto(photoId);
            if (photoFromRepo == null)
                return NotFound("Photo not Found");

            if (photoFromRepo.IsMain)
                return BadRequest("You can't delete your the Main Photo");

            if (photoFromRepo.PublicId != null)
            {
                var result = await _cloudinaryObj.DestroyAsync(new DeletionParams(photoFromRepo.PublicId));

                if (result.Result == "ok")
                    _repository.Delete(photoFromRepo);
                else
                    return BadRequest("Faild to delete the photo from Cloudinary Server");
            }
            else
            {
                _repository.Delete(photoFromRepo);
            }
            if (await _repository.SaveAll())
                return Ok();
            return BadRequest("Faild to delete the photo");
        }
    }


}