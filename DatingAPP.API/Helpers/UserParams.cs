namespace DatingAPP.API.Helpers
{
    public class UserParams
    {
        public const int MAX_PAGE_SIZE = 50;
        public int PageNumber { get; set; } = 1;

        private int pageSize = 5;
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MAX_PAGE_SIZE) ? MAX_PAGE_SIZE : value; }
        }

        public int UserId { get; set; }
        public string Gender { get; set; }
        
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 99;
    }
}