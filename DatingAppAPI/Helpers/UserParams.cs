namespace DatingAppAPI.Helpers
{
    public class UserParams
    {
        private const int MaxPageSize = 50;

        // default to one unless specified
        public int PageNumber { get; set; } = 1;

        // prop full
        // default page size is 10
        // allows client to request up to 50
        private int pageSize = 10;
        public int PageSize
        {
            get { return pageSize; }
            // checks if request is more then page max size
            // if true, value is set to max page.. if false value is kept
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        public int TotalCount { get; set; }
    }
}