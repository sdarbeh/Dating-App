using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace DatingAppAPI.Helpers
{
    public class PagedList<T> : List<T>
    {
        // returning to client
        // CurPage, TotalPage, PageSize & TotalCount
        // Adds as a header
        public int CurrentPage { get; set; }

        public int TotalPages { get; set; }

        public int PageSize { get; set; }

        public int TotalCount { get; set; }

        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            // uses returned info to determine the properties
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            this.AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            // allows to define queries to DB

            // determines total count of list items
            // count async returns # of elements
            var count = await source.CountAsync();

            // get the items from the source of items that are passed
            // uses paging info to to determine what to send back
            // ex. Num of items: 13, Page size: 5 -- Skip will count from 6 to 10 for next page request
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            // returns new page lists with list count, cur page number and page size
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }

    }
}