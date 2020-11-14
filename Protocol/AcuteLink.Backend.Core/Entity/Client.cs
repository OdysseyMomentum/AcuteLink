namespace AcuteLink.Backend.Core.Entity
{
  using System;
  using System.ComponentModel.DataAnnotations.Schema;
  using System.Text.Json.Serialization;

  public class Client
  {
    [NotMapped]
    public Entity Entity { get; set; }

    [JsonIgnore]
    public string EntityId { get; set; }
    public string Id { get; set; }

    public bool IsOnline => this.LastActive.AddMinutes(5) > DateTime.UtcNow;
    public DateTime LastActive { get; set; }

    public string Name { get; set; }
  }
}