using System.ComponentModel.DataAnnotations;

namespace DatingAPP.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }
        [Required(ErrorMessage="El campo es requerido")]
        [StringLength(8, MinimumLength=4, ErrorMessage="La contrasena debe tener entre 4 y 8 caracteres")]
        public string Password { get; set; }
    }
}