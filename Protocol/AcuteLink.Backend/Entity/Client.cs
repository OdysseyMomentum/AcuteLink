namespace AcuteLink.Backend.Entity
{
  using System;
  using System.ComponentModel.DataAnnotations.Schema;

  using Newtonsoft.Json;

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