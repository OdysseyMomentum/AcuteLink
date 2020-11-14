namespace AcuteLink.Backend.Models
{
  public class SendMessageModel
  {
    public string Message { get; set; }
    public string ReceiverId { get; set; }
    public string SenderId { get; set; }
  }
}