using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AcuteLink.Backend.Controllers
{
  using AcuteLink.Backend.Entity;
  using AcuteLink.Backend.Models;
  using AcuteLink.Backend.Repository;

  using Microsoft.AspNetCore.Cors;

  using Swashbuckle.AspNetCore.Annotations;

  [Route("api/chat")]
    [ApiController]
  [EnableCors("AllowAll")]
  public class MessageController : ControllerBase
    {
      private ICoreRepository Repository { get; }

      public MessageController(ICoreRepository repository)
      {
        this.Repository = repository;
      }

      [Route("send")]
      [HttpPost]
      public async Task<IActionResult> SendMessageAsync([FromBody] SendMessageModel sendMessageModel)
      {
        var sender = await this.Repository.GetClientAsync(sendMessageModel.SenderId);
        var receiver = await this.Repository.GetClientAsync(sendMessageModel.ReceiverId);

        await this.Repository.SendMessageAsync(
          new ChatMessage
            {
              Id = Guid.NewGuid().ToString("N"),
              Message = sendMessageModel.Message,
              SenderId = sender.Id,
              ReceiverId = receiver.Id,
              Timestamp = DateTime.UtcNow
            });

        return this.Ok();
      }

      [Route("receive")]
      [HttpGet]
      [SwaggerResponse(StatusCodes.Status200OK, "All Entities in the system", typeof(List<ConversationModel>))]
      public async Task<IActionResult> ReceiveMessagesAsync([FromQuery] string clientId, [FromQuery] string conversationPartnerId)
      {
        var messages = await this.Repository.GetChatMessagesAsync(clientId, conversationPartnerId);
        if (!messages.Any())
        {
          return this.NoContent();
        }

        var conversation = new ConversationModel
                             {
                               Sender = messages.First().Sender,
                               Receiver = messages.First().Receiver,
                               Messages = messages.Select(m => new ChatMessageModel { Message = m.Message, Timestamp = m.Timestamp }).ToList()
                             };

        return this.Ok(conversation);
      }
    }
}