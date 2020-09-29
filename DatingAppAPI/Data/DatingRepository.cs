using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAppAPI.Models;
using DatingAppAPI.Helpers;
using Microsoft.EntityFrameworkCore;

namespace DatingAppAPI.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;
        }

        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhoto(int userId)
        {
            return await _context.Photos
                .Where(u => u.UserId == userId)
                .FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            return await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            // gets users -- sorts by last active
            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where(u => u.Id != userParams.UserId);

            if (userParams.Gender != "all")
            {
                // if params equals all -- all users will be sent
                // else specified male of female willbe sent
                users = users.Where(u => u.Gender == userParams.Gender);
            }

            // list of users likes
            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            // list of users likes
            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (userParams.MinAge != 18 || userParams.MinAge != 99)
            {
                var minDOB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDOB = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DOB >= minDOB && u.DOB <= maxDOB);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                // checks client custom sorting.. default is last active
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int userId, bool likers)
        {
            var user = await _context.Users.Include(x => x.Likers).Include(x => x.Likees).FirstOrDefaultAsync(u => u.Id == userId);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == userId).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == userId).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        // messages
        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            // gets sender, recipent, and their photos 
            var messages = _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u =>
                         u.RecipientId == messageParams.UserId && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u =>
                         u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u =>
                         u.RecipientId == messageParams.UserId && !u.IsRead && u.RecipientDeleted == false);
                    break;
            }

            messages = messages.OrderByDescending(d => d.MessageSent);

            return await PagedList<Message>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            // returns messages
            return await _context.Messages
                // gets sender, recipent, and their photos 
                .Include(u => u.Sender).ThenInclude(p => p.Photos)
                .Include(u => u.Recipient).ThenInclude(p => p.Photos)
                // where recipent id matches userid
                // and deleted is false
                // and sender id mactches recipientId
                // and opposite
                .Where(m => m.RecipientId == userId && m.RecipientDeleted == false && m.SenderId == recipientId
                    || m.RecipientId == recipientId && m.SenderDeleted == false && m.SenderId == userId)
                // orders by sent date
                .OrderByDescending(m => m.MessageSent)
                //
                .ToListAsync();
        }
    }
}