namespace AcuteLink.Backend.Controllers
{
  using System.Collections.Generic;
  using System.Threading.Tasks;

  using AcuteLink.Backend.Entity;
  using AcuteLink.Backend.Models;
  using AcuteLink.Backend.Repository;

  using Microsoft.AspNetCore.Cors;
  using Microsoft.AspNetCore.Http;
  using Microsoft.AspNetCore.Mvc;

  using Swashbuckle.AspNetCore.Annotations;

  [Route("api/client")]
  [ApiController]
  [EnableCors("AllowAll")]
  public class ClientController : ControllerBase
  {
    public ClientController(ICoreRepository coreRepository)
    {
      this.CoreRepository = coreRepository;
    }

    private ICoreRepository CoreRepository { get; }

    [Route("alive")]
    [HttpPost]
    [SwaggerResponse(StatusCodes.Status200OK)]
    public async Task<IActionResult> ClientKeepAliveAsync([FromBody] ClientKeepAliveModel clientModel)
    {
      await this.CoreRepository.ClientSetActiceAsnyc(clientModel.Id);
      return this.Ok();
    }

    [Route("clients")]
    [HttpGet]
    [SwaggerResponse(StatusCodes.Status200OK, "All Clients in the system", typeof(List<Client>))]
    public async Task<IActionResult> GetClientsAsync()
    {
      var clients = await this.CoreRepository.GetClientsAsync();
      return this.Ok(clients);
    }

    [Route("register")]
    [HttpPost]
    [SwaggerResponse(StatusCodes.Status200OK, "Newly Registered Client", typeof(Client))]
    public async Task<IActionResult> RegisterClientAsync([FromBody] RegisterClientModel clientModel)
    {
      return this.Ok(await this.CoreRepository.AddClientAsync(clientModel.Name, clientModel.EntityId));
    }
  }
}