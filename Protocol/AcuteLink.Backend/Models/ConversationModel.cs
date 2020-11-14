namespace AcuteLink.Backend.Models
{
  using System.Collections.Generic;

  using AcuteLink.Backend.Core.Entity;

  public class ConversationModel
  {
    public List<ChatMessageModel> Messages { get; set; }
    public Client Receiver { get; set; }
    public Client Sender { get; set; }
  }
}