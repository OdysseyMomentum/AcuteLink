namespace AcuteLink.Backend.Core.Entity
{
  public class CapacityEntry
  {
    public float Distance { get; set; }
    public string EntityId { get; set; }
    public string EntityName { get; set; }
    public int FreeBeds { get; set; }
    public int Order { get; set; }
    public string Type { get; set; }
  }
}