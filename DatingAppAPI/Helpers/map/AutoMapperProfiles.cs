using System.Linq;
using AutoMapper;
using DatingAppAPI.Models;
using DatingAppAPI.DTOS;

namespace DatingAppAPI.Helpers
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

            //
            CreateMap<MessageForCreationDTO, Message>().ReverseMap();
            CreateMap<Message, MessageForReturnDTO>()
                // custom maps for photo urls - sender
                .ForMember(m => m.SenderPhotoUrl, opt => opt
                    .MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
                // recipient
                .ForMember(m => m.RecipientPhotoUrl, opt => opt
                    .MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}