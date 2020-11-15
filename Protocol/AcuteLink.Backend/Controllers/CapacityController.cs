namespace AcuteLink.Backend.Controllers
{
  using System.Collections.Generic;
  using System.Threading.Tasks;

  using AcuteLink.Backend.Core.Entity;
  using AcuteLink.Backend.Core.Repository;

  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Mvc;

  using Swashbuckle.AspNetCore.Annotations;

  [Route("api/capacity")]
  [ApiController]
  public class CapacityController : ControllerBase
  {
    public CapacityController(ICapacityRepository capacityRepository)
    {
      this.CapacityRepository = capacityRepository;
    }

    private ICapacityRepository CapacityRepository { get; }

    [HttpGet]
    [SwaggerResponse(StatusCodes.Status200OK, "Current Capacity for the selected type", typeof(List<CapacityEntry>))]
    public async Task<IActionResult> GetCapacityAsync([FromQuery] string type)
    {
      return this.Ok(await this.CapacityRepository.FindNearestSuitableEntitiesAsync(type, ""));
    }
  }
}