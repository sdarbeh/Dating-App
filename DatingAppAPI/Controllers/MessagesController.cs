using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingAppAPI.Data;
using DatingAppAPI.DTOS;
using DatingAppAPI.Helpers;
using DatingAppAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingAppAPI.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet("{id}", Name = "GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id)
        {
            // checks if ID matches token id
            if (userId != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo == null)
                return NotFound();

            return Ok(messageFromRepo);

        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int userId, [FromQuery] MessageParams msgParams)
        {
            // checks if ID matches token id
            if (userId != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                return Unauthorized();

            msgParams.UserId = userId;

            var messageFromRepo = await _repo.GetMessagesForUser(msgParams);

            var messages = _mapper.Map<IEnumerable<MessageForReturnDTO>>(messageFromRepo);

            // current page, page size, total count, total pages
            Response.AddPagination(messageFromRepo.CurrentPage, messageFromRepo.PageSize,
                 messageFromRepo.TotalCount, messageFromRepo.TotalPages);

            return Ok(messages);

        }

        [HttpGet("thread/{recipientId}")]
        public async Task<IActionResult> GetMessageThread(int userId, int recipientId)
        {
            // checks if ID matches token id
            if (userId != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                return Unauthorized();

            var messagesFromRepo = await _repo.GetMessageThread(userId, recipientId);

            var messageThread = _mapper.Map<IEnumerable<MessageForReturnDTO>>(messagesFromRepo);

            return Ok(messageThread);

        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDTO msgCreationDTO)
        {
            // checks if ID matches token id
            if (userId != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                return Unauthorized();

            msgCreationDTO.SenderId = userId;

            var recipient = await _repo.GetUser(msgCreationDTO.RecipientId);

            if (recipient == null)
                return BadRequest("User doesn't exists");

            var message = _mapper.Map<Message>(msgCreationDTO);

            _repo.Add(message);

            var messageToReturn = _mapper.Map<MessageForCreationDTO>(message);

            if (await _repo.SaveAll())
                return CreatedAtRoute("GetMessage", new { userId, id = message.Id }, messageToReturn);

            // failed at saving message
            throw new Exception("Sending message failed");
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId)
        {
            // checks if ID matches token id
            if (userId != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                return Unauthorized();

            /* 
                Checks if both sender and receiver deleted the message
                until then message is kept in Db
            */

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;
            
            if (messageFromRepo.RecipientId == userId)
                messageFromRepo.RecipientDeleted = true;

            if (messageFromRepo.SenderDeleted && messageFromRepo.RecipientDeleted) 
                _repo.Delete(messageFromRepo);

            if (await _repo.SaveAll())
                return NoContent();
            
            // failed at saving message
            throw new Exception("Problem deleting message");
        }

        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int id, int userId)
        {
            // checks if ID matches token id
            if (userId != int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);

            if (messageFromRepo.RecipientId != userId)
                return Unauthorized();

            messageFromRepo.IsRead = true;
            messageFromRepo.DateRead = DateTime.Now;

            await _repo.SaveAll();

            return NoContent();
        }
    }
}