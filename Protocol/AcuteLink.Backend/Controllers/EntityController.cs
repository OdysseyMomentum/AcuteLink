namespace AcuteLink.Backend.Controllers
{
  using System.Collections.Generic;
  using System.Threading.Tasks;

  using AcuteLink.Backend.Core.Entity;
  using AcuteLink.Backend.Repository;

  using Microsoft.AspNetCore.Cors;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Mvc;

  using Swashbuckle.AspNetCore.Annotations;

  [Route("api/entity")]
  [ApiController]
  [EnableCors("AllowAll")]
  public class EntityController : ControllerBase
  {
    public EntityController(CoreRepository coreRepository)
    {
      this.CoreRepository = coreRepository;
    }

    private CoreRepository CoreRepository { get; }

    [HttpGet]
    [SwaggerResponse(StatusCodes.Status200OK, "All Entities in the system", typeof(List<Entity>))]
    public async Task<IActionResult> GetEntitiesAsync()
    {
      return this.Ok(await this.CoreRepository.GetEntitiesAsync());
    }
  }
}