using System.Linq;
using AutoMapper;
using DatingApp.API.DTOS;
using DatingApp.API.Models;
using DatingAppAPI.DTOS;

namespace DatingApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            // user
            CreateMap<User, UserForListDTO>()
                // sets PhotoUrl to main user photo
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
                    src.Photos.FirstOrDefault(p => p.IsMain).Url))
                // sets age 
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src =>
                    src.DOB.CalulateAge()));

            CreateMap<User, UserForDetailedDTO>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
                    src.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src =>
                    src.DOB.CalulateAge()));

            CreateMap<UserForUpdateDTO, User>();        
            
            // photos
            CreateMap<Photo, PhotoForDetailedDTO>();
            CreateMap<Photo, PhotoForReturnDTO>();
            CreateMap<PhotoForCreationDTO, Photo>();

            //
            CreateMap<UserForRegisterDTO, User>();
        }
    }
}