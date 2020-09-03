using System.Linq;
using AutoMapper;
using DatingAPP.API.Dtos;
using DatingAPP.API.Models;

namespace DatingAPP.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl,
                            src => src.MapFrom(userObj => userObj.Photos.FirstOrDefault(p => p.IsMain).Url)
                          )
                .ForMember(dest => dest.Age,
                            src => src.MapFrom(userObj => userObj.DateOfBirth.CalculateAge())
                          );
            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl,
                            src => src.MapFrom(userObj => userObj.Photos.FirstOrDefault(p => p.IsMain).Url)
                          )
                .ForMember(dest => dest.Age,
                            src => src.MapFrom(userObj => userObj.DateOfBirth.CalculateAge())
                          );
            CreateMap<Photo, PhotosForDetailedDto>();
        }
    }
}