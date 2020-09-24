using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForListDto>()
                // sets PhotoUrl to main user photo
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => 
                    src.Photos.FirstOrDefault(p => p.IsMain).Url))
                // sets age 
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => 
                    src.DOB.CalulateAge()));
                
            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => 
                    src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => 
                    src.DOB.CalulateAge()));

            CreateMap<Photo, PhotoForDetailedDto>();
        }
    }
}