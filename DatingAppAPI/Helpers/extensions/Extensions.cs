using System;
using DatingAppAPI.Helpers;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace DatingAppAPI.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse res, string message)
        {
            res.Headers.Add("Application-Error", message);
            res.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            res.Headers.Add("Access-Control-Allow-Origin", "*");
        }

        public static void AddPagination(this HttpResponse res, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
            res.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader));
            res.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

        public static int CalulateAge(this DateTime theDateTime)
        {
            var age = DateTime.Today.Year - theDateTime.Year;
            if (theDateTime.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }
    }
}