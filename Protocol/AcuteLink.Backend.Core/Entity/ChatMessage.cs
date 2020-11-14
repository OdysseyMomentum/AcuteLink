namespace AcuteLink.Backend.Core.Entity
{
  using System;
  using System.Text.Json.Serialization;

  public class ChatMessage
  {
    public string Id { get; set; }
    public string Message { get; set; }
    public Client Receiver { get; set; }

    [JsonIgnore]
    public string ReceiverId { get; set; }
    public Client Sender { get; set; }

    [JsonIgnore]
    public string SenderId { get; set; }
    public DateTime Timestamp { get; set; }
  }
}