using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingAPP.API.Helpers;
using DatingAPP.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingAPP.API.Data
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

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(photoObj => photoObj.UserId == userId).FirstOrDefaultAsync(photo => photo.IsMain);
        }

        public async Task<Photo> GetPhoto(int userId)
        {
            var photo =await _context.Photos.FirstOrDefaultAsync(photoObj => photoObj.Id == userId);

            return photo;
        }

        public async Task<User> GetUser(int userId)
        {
            var user = await _context.Users.Include(userObj => userObj.Photos).FirstOrDefaultAsync(userObj => userObj.Id == userId);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(userObj => userObj.Photos).AsQueryable();
            users = users.Where(userObj => userObj.Id != userParams.UserId);
            users =  users.Where(userObj => userObj.Gender == userParams.Gender);
            if ( userParams.MinAge != 18 || userParams.MaxAge != 99)
            {
                var minDoB = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDoB = DateTime.Today.AddYears(-userParams.MinAge);
                users = users.Where(userObj => userObj.DateOfBirth >= minDoB && userObj.DateOfBirth <= maxDoB);
            }
            users = users.OrderByDescending(userObj=> userObj.DateOfBirth);
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}