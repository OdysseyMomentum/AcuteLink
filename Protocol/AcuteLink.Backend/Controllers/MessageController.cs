﻿using System;
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
      if (string.IsNullOrEmpty(conversationPartnerId))
      {
        var allMessages = await this.Repository.GetAllChatMessagesAsync(clientId);
        if (!allMessages.Any())
        {
          return this.NoContent();
        }

        var conversations = new List<ConversationModel>();

        foreach (var message in allMessages)
        {
          if (conversations.Any(c => c.Sender.Id == message.SenderId))
          {
            var conversation = conversations.First(c => c.Sender.Id == message.SenderId);
            conversation.Messages.Add(new ChatMessageModel { Message = message.Message, Timestamp = message.Timestamp });
          }
          else
          {
            var conversation = new ConversationModel
                                 {
                                   Sender = message.Sender,
                                   Receiver = message.Receiver,
                                   Messages = new List<ChatMessageModel>
                                                {
                                                  new ChatMessageModel { Message = message.Message, Timestamp = message.Timestamp }
                                                }
                                 };

            conversations.Add(conversation);
          }
        }

        return this.Ok(conversations);
      }

      var messages = await this.Repository.GetConversationChatMessagesAsync(clientId, conversationPartnerId);
      if (!messages.Any())
      {
        return this.NoContent();
      }

      return this.Ok(
        new List<ConversationModel>
          {
            new ConversationModel
              {
                Sender = messages.First().Sender,
                Receiver = messages.First().Receiver,
                Messages = messages.Select(m => new ChatMessageModel { Message = m.Message, Timestamp = m.Timestamp }).ToList()
              }
          });
    }
  }
}